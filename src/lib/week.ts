// Turning sections into the boxes components/week.tsx draws, and the week the demos share: the
// usual spring load for a first-year science or engineering major, taken the best way it fits.

import { locationLabel, type Scheme } from "./buildings";
import { clock, type Classes, type Section } from "./classes";
import { buildSchedules, type Prefs } from "./schedules";
import type { Block } from "@/app/components/week";

export const STARTERS = ["MATH 022", "PHYS 008", "CHEM 002", "CHEM 002L"];

export const NO_PREFS: Prefs = { earliest: 0, latest: 24 * 60, daysOff: [], lunch: false, openOnly: false, sort: "gaps" };

/** Each course's sections in `classes`, by course. */
export function sectionsByCourse(classes: Classes) {
  const m = new Map<string, Section[]>();
  for (const s of classes.sections) m.set(s.course, [...(m.get(s.course) ?? []), s]);
  return m;
}

/** The schedules for the starter courses the term has, under `prefs`. */
export function starterSchedules(byCourse: Map<string, Section[]>, prefs: Prefs = NO_PREFS) {
  const courses = STARTERS.filter((c) => byCourse.has(c));
  return buildSchedules(courses.map((c) => byCourse.get(c)!), prefs);
}

/** One box per meeting per weekday: "PHYS 008", then "Lecture 9:00-10:15" and where. */
export function classBlocks(sections: Section[], tone: Block["tone"], scheme: Scheme = "common"): Block[] {
  return sections.flatMap((s) => s.meets.flatMap((m, i) => m.days.filter((d) => d < 5).map((day) => ({
    key: `${s.course}|${s.type}|${i}|${day}`,
    day, start: m.start, end: m.end, tone,
    title: s.course,
    lines: [`${s.type === "Discussion" ? "Disc" : s.type} ${clock(m.start)}-${clock(m.end)}`, locationLabel(m, scheme)],
  }))));
}

/** The gaps of an hour or more between 9am and 7pm clear of class, leaving 15 minutes either side
 *  of each class to get there (the extension's freeTimes, at its default settings). */
export function freeBlocks(classes: Block[]): Block[] {
  const FROM = 9 * 60, TO = 19 * 60, PAD = 15, MIN = 60;
  const free: Block[] = [];
  for (let day = 0; day < 5; day++) {
    const busy = classes.filter((b) => b.day === day)
      .map((b) => [Math.max(FROM, b.start - PAD), Math.min(TO, b.end + PAD)])
      .filter(([a, b]) => b > a)
      .sort((x, y) => x[0] - y[0]);
    let cursor = FROM;
    const gap = (a: number, b: number) => {
      if (b - a >= MIN) free.push({ key: `free|${day}|${a}`, day, start: a, end: b, tone: "free", title: `${clock(a)}-${clock(b)}` });
    };
    for (const [a, b] of busy) {
      if (a > cursor) gap(cursor, a);
      cursor = Math.max(cursor, b);
    }
    if (cursor < TO) gap(cursor, TO);
  }
  return free;
}

/** The whole hours a week needs to show `blocks`, never less than `from`-`to`. */
export function hoursFor(blocks: Block[], from = 9, to = 17) {
  return {
    from: Math.min(from, ...blocks.map((b) => Math.floor(b.start / 60))),
    to: Math.max(to, ...blocks.map((b) => Math.ceil(b.end / 60))),
  };
}
