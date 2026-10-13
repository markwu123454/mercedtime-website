"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { locationLabel } from "@/lib/buildings";
import { dayLetters, looseCourse, seatTier, squash, timeOfDay, type Section } from "@/lib/classes";
import AppFrame from "./app-frame";
import { useClasses } from "./use-classes";

// The home page's class search: like the extension's Find classes, cut down to a search box and the
// first few courses it finds, a few sections each, on this semester's real classes and seats. It
// shows off the table; it makes no attempt to list everything.

const FIRST_QUERY = "physics";
const MAX_COURSES = 3;
const MAX_SECTIONS = 3;
/** Type, days and time, instructor and room, seats, on a wide screen. */
const COLUMNS = "sm:grid-cols-[5.5rem_minmax(11rem,1.2fr)_minmax(0,1fr)_5.5rem]";

/** How well a section matches: 0 for the course or CRN, then the subject's name, 1 the title, 2 the
 *  instructor or type, null for no match. Several words must each match somewhere, in any order, a
 *  number only the course number ("22" is not any CRN with 22 in it). */
function rank(s: Section, query: string, subjectName: string): number | null {
  const q = query.trim();
  if (/^\d{3,5}$/.test(q)) return s.crn.startsWith(q) ? 0 : null;
  if (looseCourse(s.course).startsWith(looseCourse(q))) return 0;
  const title = squash(s.title);
  const rest = [squash(s.instructor), squash(s.type)];
  const whole = squash(q);
  if (squash(subjectName).startsWith(whole)) return 0.5;
  if (title.includes(whole)) return 1;
  if (rest.some((v) => v.includes(whole))) return 2;

  const words = q.split(/\s+/).map(squash).filter(Boolean);
  if (words.length < 2) return null;
  const [subject, number] = s.course.toLowerCase().split(" ");
  let worst = 0;
  for (const w of words) {
    const t = /^\d/.test(w) ? (number.replace(/^0+/, "").startsWith(w.replace(/^0+/, "")) ? 0 : null)
      : subject.startsWith(w) ? 0
      : title.includes(w) ? 1
      : rest.some((v) => v.includes(w)) ? 2
      : null;
    if (t === null) return null;
    worst = Math.max(worst, t);
  }
  return 3 + worst;
}

function Seats({ s }: { s: Section }) {
  const tier = seatTier(s);
  return (
    <span className="flex flex-col items-start gap-0.5">
      <span className={`cds-tag cds-tag-${tier}`}>{s.seats}/{s.cap}</span>
      {tier === "full" && s.waitCap > 0 && <span className="cds-label">{s.waitOpen ? `WL open ×${s.waitOpen}` : "WL full"}</span>}
    </span>
  );
}

function SectionRow({ s }: { s: Section }) {
  const when = s.meets.length
    ? s.meets.map((m) => `${dayLetters(m.days)} ${timeOfDay(m.start)}–${timeOfDay(m.end)}`).join(", ")
    : "Online or TBA";
  const where = s.meets[0] ? locationLabel(s.meets[0]) : "";
  return (
    <li className={`grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 border-b border-[#e0e0e0] px-4 py-3 ${COLUMNS} sm:items-start`}>
      <span>{s.type || "Section"}</span>
      <span className="col-span-2 row-start-2 tabular-nums sm:col-span-1 sm:row-start-auto">{when}</span>
      <span className="col-span-2 row-start-3 truncate text-[#525252] sm:col-span-1 sm:row-start-auto sm:text-[#161616]">
        {s.instructor || "Staff"}{where && ` · ${where}`}
      </span>
      <span className="col-start-2 row-start-1 justify-self-end sm:col-start-auto sm:row-start-auto sm:justify-self-start"><Seats s={s} /></span>
    </li>
  );
}

function Course({ sections }: { sections: Section[] }) {
  const first = sections[0];
  const free = sections.filter((s) => s.link.startsWith("A") || !s.link).reduce((n, s) => n + s.seats, 0);
  return (
    <li>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-[#e0e0e0] bg-[#f4f4f4] px-4 py-2.5">
        <span aria-hidden className="text-[10px] text-[#525252]">▼</span>
        <span className="cds-code">{first.course}</span>
        <span className="min-w-0 flex-1 truncate">{first.title}</span>
        <span className={`cds-tag ${free ? "cds-tag-open" : "cds-tag-full"}`}>{free} seats</span>
      </div>
      <ul>{sections.slice(0, MAX_SECTIONS).map((s) => <SectionRow key={s.crn} s={s} />)}</ul>
    </li>
  );
}

export default function ClassSearch() {
  const classes = useClasses();
  const [query, setQuery] = useState(FIRST_QUERY);
  const deferred = useDeferredValue(query);
  const ready = classes && classes !== "error" ? classes : null;

  const results = useMemo(() => {
    if (!ready || !deferred.trim()) return [];
    const byCourse = new Map<string, { best: number; sections: Section[] }>();
    for (const s of ready.sections) {
      const r = rank(s, deferred, ready.subjects?.[s.course.split(" ")[0]] ?? "");
      if (r === null) continue;
      const c = byCourse.get(s.course) ?? { best: r, sections: [] };
      c.best = Math.min(c.best, r);
      c.sections.push(s);
      byCourse.set(s.course, c);
    }
    return [...byCourse.values()]
      .sort((a, b) => a.best - b.best || a.sections[0].course.localeCompare(b.sections[0].course, undefined, { numeric: true }))
      .map((c) => {
        // A course's lectures first, then the rest, each in time order.
        const order = (s: Section) => (s.link.startsWith("A") || !s.link ? 0 : 1);
        return c.sections.sort((a, b) => order(a) - order(b) || (a.meets[0]?.start ?? 1e4) - (b.meets[0]?.start ?? 1e4));
      });
  }, [ready, deferred]);

  return (
    <AppFrame tab="Find classes" label="Find classes, from the MercedTime extension">
      <div className="cds-toolbar">
        <div className="cds-field flex shrink-0 items-center gap-6" aria-label="Semester">
          {ready?.term ?? "Semester"}<span aria-hidden className="text-[10px]">▼</span>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a course, title, instructor, or CRN"
          aria-label="Search classes"
          className="cds-field flex-1 basis-48"
        />
      </div>

      <div className={`hidden gap-x-4 bg-[#e0e0e0] px-4 py-2.5 font-semibold sm:grid ${COLUMNS}`} aria-hidden>
        <span>Type</span><span>Days/Time</span><span>Instructor</span><span>Seats</span>
      </div>
      <div className="h-110 overflow-hidden">
        {classes === "error" ? (
          <p className="p-6 text-[#525252]">Classes couldn&apos;t be loaded right now. Try again in a minute.</p>
        ) : !ready ? (
          <p className="p-6 text-[#525252]">Loading this semester&apos;s classes…</p>
        ) : !results.length ? (
          <p className="p-6 text-[#525252]">{query.trim() ? `No ${ready.term} classes match “${query.trim()}”.` : "Type a course, a subject, or an instructor."}</p>
        ) : (
          <ul>
            {results.slice(0, MAX_COURSES).map((sections) => <Course key={sections[0].course} sections={sections} />)}
          </ul>
        )}
      </div>
    </AppFrame>
  );
}
