// The home page's demos run on the newest open semester's real classes: Banner's public class search
// as api.mercedtime.com serves it (the mercedtime repo's src/lib/server.js), cut down by
// /api/classes to what the demos draw. These are the shapes and helpers both sides share.

/** One weekly meeting: weekday indexes (0 = Monday), minutes after midnight, and where: Banner's
 *  building code ("CLSSRM"), its official name ("Classroom and Office 1 Bldg"), and the room. */
export type Meeting = { days: number[]; start: number; end: number; building: string; buildingName: string; room: string };

/** One section, the fields the demos use. */
export type Section = {
  crn: string;
  /** "MATH 021": the subject and Banner's three-digit number. */
  course: string;
  title: string;
  /** "Lecture", "Lab", "Discussion"... */
  type: string;
  /** Banner's linkIdentifier ("A1", "B1"), "" when the section stands alone. */
  link: string;
  units: number;
  instructor: string;
  seats: number;
  cap: number;
  /** Open waitlist spots, and the waitlist's size (0 when the section has none). */
  waitOpen: number;
  waitCap: number;
  /** Timed weekly meetings; none for an online or TBA section. */
  meets: Meeting[];
};

export type Classes = {
  /** Banner's term code, "202710" */
  code: string;
  /** "Spring 2027" */
  term: string;
  /** When the seat counts were read, epoch ms. */
  seatsAt: number;
  /** Each subject's name, "PHYS" -> "Physics". */
  subjects: Record<string, string>;
  sections: Section[];
};

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** 570 -> "9:30", no am/pm. */
export const clock = (m: number) => `${Math.floor(m / 60) % 12 || 12}:${String(m % 60).padStart(2, "0")}`;

/** 570 -> "9:30 AM". */
export const timeOfDay = (m: number) => `${clock(m)} ${m >= 12 * 60 ? "PM" : "AM"}`;

/** "MWF" style days, as UC Merced writes them (R for Thursday). */
export const dayLetters = (days: number[]) => days.map((d) => "MTWRFSU"[d]).join("");

/** "open", "low" (under 5 seats, or under a tenth), or "full", as the extension colours seats. */
export function seatTier(s: Section): "open" | "low" | "full" {
  if (s.seats <= 0) return "full";
  if (s.seats < 5 || (s.cap > 0 && s.seats < s.cap * 0.1)) return "low";
  return "open";
}

/** Ignore case and spaces: "math21", "Math 021" and "MATH 21" are the same search. */
export const squash = (v: string) => v.toLowerCase().replace(/\s+/g, "");

/** "MATH 021" -> "math21", so a search for "math 21" finds it. */
export const looseCourse = (course: string) => squash(course).replace(/(\D)0+(\d)/, "$1$2");

/** "Spring 2027" -> "spring-2027", a semester in the site's addresses. */
export const termSlug = (term: string) => term.toLowerCase().replace(/\s+/g, "-");

/** ("Spring 2027", "MATH 021") -> "/classes/spring-2027/math/021", the course's page for that semester. */
export const coursePath = (term: string, course: string) => `/classes/${termSlug(term)}/${course.toLowerCase().replace(" ", "/")}`;

/** A course's lectures first, then the rest, each in time order, as the extension lists them. */
export function bySection(a: Section, b: Section) {
  const order = (s: Section) => (s.link.startsWith("A") || !s.link ? 0 : 1);
  return order(a) - order(b) || (a.meets[0]?.start ?? 1e4) - (b.meets[0]?.start ?? 1e4) || a.crn.localeCompare(b.crn);
}
