import { cacheLife } from "next/cache";
import type { Classes, Meeting, Section } from "./classes";

// Semesters' classes, from api.mercedtime.com (the mercedtime-api repo), cut down from Banner's
// own rows (about 3 MB a term) to the fields the site draws: the newest open one behind
// /api/classes (the home page's demos), the newest fall and spring behind the course pages and
// the sitemap. Cached for five minutes,
// so the seat counts are about as fresh as the server's own (it reads them at most once a minute).

const API = "https://api.mercedtime.com/v1";
const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

type BannerMeeting = { beginTime: string | null; endTime: string | null; building: string | null; buildingDescription: string | null; room: string | null; meetingType: string; meetingScheduleType: string } & Record<(typeof DAY_KEYS)[number], boolean>;
type BannerRow = {
  courseReferenceNumber: string;
  subject: string;
  courseNumber: string;
  courseTitle: string;
  subjectDescription: string;
  scheduleTypeDescription: string;
  linkIdentifier: string | null;
  creditHours: number | null;
  creditHourLow: number | null;
  creditHourHigh: number | null;
  seatsAvailable: number | null;
  maximumEnrollment: number | null;
  crossList: string | null;
  crossListAvailable: number | null;
  crossListCapacity: number | null;
  waitAvailable: number | null;
  waitCapacity: number | null;
  faculty: { displayName: string; primaryIndicator: boolean }[];
  meetingsFaculty: { meetingTime: BannerMeeting | null }[];
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}/${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

// Banner escapes its text as HTML ("Writing &amp; Rhetoric").
const unescape = (s: string | null) =>
  String(s ?? "").replace(/&(amp|lt|gt|quot|#39|#x27);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", "#x27": "'" })[e as string]!);

const toMin = (t: string) => {
  const s = t.padStart(4, "0");
  return Number(s.slice(0, 2)) * 60 + Number(s.slice(2));
};

/** "Lecture-Supplem Act (Discuss)" -> "Discussion", as the extension shortens them (schedule.js). */
function shortType(desc: string) {
  if (/discuss/i.test(desc)) return "Discussion";
  if (/^lab/i.test(desc)) return "Lab";
  if (/^seminar/i.test(desc)) return "Seminar";
  if (/^lecture/i.test(desc)) return "Lecture";
  if (/^studio/i.test(desc)) return "Studio";
  return desc.split(/[\s-]/)[0] || "";
}

function slim(r: BannerRow): Section {
  // A cross-listed section shares its seats with the others, so take the pool's when it is larger
  // (the extension's seatInfo).
  const pooled = !!r.crossList && r.crossListAvailable != null && r.crossListAvailable > (r.seatsAvailable ?? 0);
  const faculty = r.faculty.find((f) => f.primaryIndicator) ?? r.faculty[0];
  const meets: Meeting[] = r.meetingsFaculty
    .map((mf) => mf.meetingTime)
    // Banner lists the final exam as one more meeting.
    .filter((m): m is BannerMeeting => !!m && m.meetingType !== "EXAM" && m.meetingScheduleType !== "EXM" && !!m.beginTime && !!m.endTime)
    .map((m) => ({
      days: DAY_KEYS.flatMap((k, i) => (m[k] ? [i] : [])),
      start: toMin(m.beginTime!),
      end: toMin(m.endTime!),
      building: m.building ?? "",
      buildingName: unescape(m.buildingDescription).trim(),
      room: m.room ?? "",
    }))
    .filter((m) => m.days.length);
  return {
    crn: String(r.courseReferenceNumber),
    course: `${r.subject} ${r.courseNumber}`,
    title: unescape(r.courseTitle).trim(),
    type: shortType(r.scheduleTypeDescription ?? ""),
    link: r.linkIdentifier ?? "",
    units: r.creditHours ?? r.creditHourHigh ?? r.creditHourLow ?? 0,
    instructor: faculty ? unescape(faculty.displayName) : "",
    seats: Math.max(0, (pooled ? r.crossListAvailable : r.seatsAvailable) ?? 0),
    cap: (pooled ? r.crossListCapacity : r.maximumEnrollment) ?? 0,
    waitOpen: Math.max(0, r.waitAvailable ?? 0),
    waitCap: r.waitCapacity ?? 0,
    meets,
  };
}

type Term = { code: string; description: string; viewOnly: boolean };

async function getTerms(): Promise<Term[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  return (await get<{ terms: Term[] }>("terms")).terms;
}

/** One term's sections, with seat counts at most a minute old. */
async function loadTerm(term: Term): Promise<Classes> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });

  const [catalog, seats] = await Promise.all([
    get<{ rows: BannerRow[] }>(`catalog/${term.code}`),
    // The catalog's counts are from the server's daily read; these are at most a minute old.
    get<{ fields: string[]; seats: unknown[][] }>(`seats/${term.code}`).catch(() => null),
  ]);
  const live = new Map<string, Record<string, unknown>>();
  for (const s of seats?.seats ?? []) {
    const counts: Record<string, unknown> = {};
    seats!.fields.forEach((field, i) => { if (i) counts[field] = s[i]; });
    live.set(String(s[0]), counts);
  }
  const subjects: Record<string, string> = {};
  for (const r of catalog.rows) subjects[r.subject] = unescape(r.subjectDescription).trim();
  return {
    code: term.code,
    term: term.description.replace(/ Semester/, "").replace(/\s*\(.*\)$/, ""),
    seatsAt: Date.now(),
    subjects,
    sections: catalog.rows.map((r) => slim({ ...r, ...live.get(String(r.courseReferenceNumber)) })),
  };
}

/** The newest semester open for registration: the home page's demos. */
export async function loadClasses(): Promise<Classes> {
  const terms = await getTerms();
  return loadTerm(terms.find((t) => !t.viewOnly) ?? terms[0]);
}

/** The two newest fall and spring semesters (summer is left out), newest first: what the course
 *  pages list. A term that can't be had is left out; with neither, this throws. */
export async function loadSemesters(): Promise<Classes[]> {
  const terms = (await getTerms()).filter((t) => /^(fall|spring)\b/i.test(t.description)).slice(0, 2);
  const loaded = await Promise.allSettled(terms.map(loadTerm));
  const ok = loaded.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  if (!ok.length) throw new Error("no semesters");
  return ok;
}
