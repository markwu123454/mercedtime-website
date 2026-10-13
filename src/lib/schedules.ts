// Every schedule that fits a set of courses, for the home page's demo: a cut-down copy of the
// extension's generator (the mercedtime repo's src/lib/generate.js), with only the preferences the
// demo offers. As there, a course is taken as one bundle: its lecture (Banner's "A" link) plus one
// section of each other linked kind (a lab, a discussion), and the search is a depth-first walk
// that drops a branch the moment two classes overlap.

import type { Section } from "./classes";

export type Prefs = {
  /** No class before this, minutes after midnight (0 for any time). */
  earliest: number;
  /** No class after this (24 * 60 for any time). */
  latest: number;
  /** Weekday indexes with no class at all. */
  daysOff: number[];
  /** Keep 12–1 free on weekdays. */
  lunch: boolean;
  /** Leave out full sections. */
  openOnly: boolean;
  sort: "gaps" | "days" | "late";
};

export type Schedule = { sections: Section[]; days: number; gaps: number; earliest: number };

type Slot = { day: number; start: number; end: number };

const LUNCH = { start: 12 * 60, end: 13 * 60 };
/** The least time between two classes, as in the extension. */
const PASSING = 5;

const slotsOf = (sections: Section[]): Slot[] =>
  sections.flatMap((s) => s.meets.flatMap((m) => m.days.map((day) => ({ day, start: m.start, end: m.end }))));

const overlap = (a: Slot, b: Slot, gap: number) => a.day === b.day && a.start < b.end + gap && b.start < a.end + gap;

/** Every way to take one course: each lecture bundle with one section of each linked kind. */
export function courseChoices(sections: Section[]): Section[][] {
  const bundles = new Map<string, Section[]>();
  const out: Section[][] = [];
  for (const s of sections) {
    const m = s.link.match(/^([A-Za-z]+)(\d+)$/);
    if (!m) out.push([s]);
    else bundles.set(m[2], [...(bundles.get(m[2]) ?? []), s]);
  }
  for (const members of bundles.values()) {
    const anchors = members.filter((s) => s.link.startsWith("A"));
    const kinds = new Map<string, Section[]>();
    for (const s of members) {
      if (anchors.includes(s)) continue;
      const k = s.link.replace(/\d+$/, "");
      kinds.set(k, [...(kinds.get(k) ?? []), s]);
    }
    for (const anchor of anchors.length ? anchors : members.slice(0, 1)) {
      let combos: Section[][] = [[anchor]];
      for (const group of kinds.values()) combos = combos.flatMap((base) => group.map((c) => [...base, c]));
      out.push(...combos);
    }
  }
  return out;
}

function metrics(slots: Slot[]) {
  const byDay = new Map<number, Slot[]>();
  for (const s of slots) byDay.set(s.day, [...(byDay.get(s.day) ?? []), s]);
  let gaps = 0;
  for (const list of byDay.values()) {
    list.sort((a, b) => a.start - b.start);
    for (let i = 1; i < list.length; i++) gaps += Math.max(0, list[i].start - list[i - 1].end);
  }
  return { days: byDay.size, gaps, earliest: slots.length ? Math.min(...slots.map((s) => s.start)) : 0 };
}

const SORTS = {
  gaps: (a: Schedule, b: Schedule) => a.gaps - b.gaps || a.days - b.days || b.earliest - a.earliest,
  days: (a: Schedule, b: Schedule) => a.days - b.days || a.gaps - b.gaps || b.earliest - a.earliest,
  late: (a: Schedule, b: Schedule) => b.earliest - a.earliest || a.gaps - b.gaps || a.days - b.days,
};

/** The schedules that fit, best first by `prefs.sort`, and which courses fit no way at all. Stops
 *  after `cap` schedules, sorting those: plenty to page through. */
export function buildSchedules(courses: Section[][], prefs: Prefs, cap = 3000) {
  const off = new Set(prefs.daysOff);
  const fits = (sections: Section[], slots: Slot[]) =>
    slots.every((m) => m.start >= prefs.earliest && m.end <= prefs.latest && !off.has(m.day)
      && !(prefs.lunch && m.day < 5 && m.start < LUNCH.end && LUNCH.start < m.end))
    && (!prefs.openOnly || sections.every((s) => s.seats > 0))
    && !slots.some((a, i) => slots.slice(i + 1).some((b) => overlap(a, b, 0)));

  const options = courses.map((sections) => ({
    course: sections[0]?.course ?? "",
    choices: courseChoices(sections).map((ch) => ({ sections: ch, slots: slotsOf(ch) })).filter((ch) => fits(ch.sections, ch.slots)),
  }));
  const blocked = options.filter((o) => !o.choices.length).map((o) => o.course);
  if (blocked.length) return { results: [] as Schedule[], total: 0, blocked };

  options.sort((a, b) => a.choices.length - b.choices.length);   // fewest choices first, to prune early
  const placed: Slot[] = [];
  const picks: Section[][] = [];
  const results: Schedule[] = [];
  let nodes = 0;
  const walk = (i: number) => {
    if (results.length >= cap || ++nodes > 200000) return;
    if (i === options.length) {
      results.push({ sections: picks.flat(), ...metrics(placed) });
      return;
    }
    for (const ch of options[i].choices) {
      if (ch.slots.some((m) => placed.some((p) => overlap(m, p, PASSING)))) continue;
      placed.push(...ch.slots);
      picks.push(ch.sections);
      walk(i + 1);
      picks.pop();
      placed.length -= ch.slots.length;
    }
  };
  walk(0);
  results.sort(SORTS[prefs.sort]);
  return { results, total: results.length, blocked };
}
