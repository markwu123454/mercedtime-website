import { cacheLife } from "next/cache";

// What a course page says about the course beyond its sections: Banner's description and
// prerequisites, read from UCM Registration's public class search (no sign-in), and the
// corequisites api.mercedtime.com has already read for every course (/v1/coreqs).
//
// Banner answers the first two per section, so each course asks about one of its sections. The
// answers change about once a year, so they're kept in the remote cache for weeks; a build still
// asks again (remote entries don't outlive a deploy), so the requests go out two at a time, gently.
// The mercedtime-api repo reads corequisites the same way once a day; these could move there too.

const BANNER = "https://reg-prod.ec.ucmerced.edu/StudentRegistrationSsb/ssb/searchResults";
const API = "https://api.mercedtime.com/v1";
const AT_ONCE = 2;

/** One course or test in a prerequisite. `subject` is Banner's name for it ("Physics"), not the
 *  code: the page turns it into one with the semester's subjects. */
export type Leaf = { subject: string; number: string; test: string; score: string; grade: string };
/** Courses joined by and/or. `conns[i]` joins items i and i + 1. */
export type Group = { op: "and" | "or" | "mixed"; items: Prereq[]; conns: ("and" | "or")[] };
export type Prereq = Leaf | Group;

export type Details = {
  /** "" when Banner has none. */
  description: string;
  /** null for none. `grade` is said once when several courses all ask the same ("C-"). */
  prereqs: { tree: Prereq; grade: string } | null;
};

let active = 0;
const waiting: (() => void)[] = [];

/** One POST to Banner's class search, no more than AT_ONCE at a time from this server. */
async function banner(path: string, term: string, crn: string) {
  while (active >= AT_ONCE) await new Promise<void>((resolve) => waiting.push(resolve));
  active++;
  try {
    const res = await fetch(`${BANNER}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: new URLSearchParams({ term, courseReferenceNumber: crn }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`${path} ${crn} -> ${res.status}`);
    return await res.text();
  } finally {
    active--;
    waiting.shift()?.();
  }
}

const unescapeHtml = (s: string) => s
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#0?39;|&#x27;/g, "'")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const text = (html: string) => unescapeHtml(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

/** getCourseDescription's fragment, without the section's own note (it's about one section). */
export function parseDescription(html: string) {
  const course = html.replace(/<!--[\s\S]*?-->/g, "").split(/<b>\s*Section information text/i)[0];
  const out = text(course);
  return /no course description/i.test(out) ? "" : out;
}

// Banner spells one AP exam many ways ("AP Physics C: Elec & Mag", "Self AP Physics C Elect & Mag"),
// so the same exam is known by a short code, as the extension shows them (src/lib/prereqs.js).
const AP_CODES: [RegExp, string][] = [
  [/calc\w*\W*ab/, "CALC AB"], [/calc\w*\W*bc/, "CALC BC"], [/precalc/, "PRECALC"], [/statis/, "STAT"],
  [/comp\w*\W*sci\w*\W*a\b|\bcs\W*a\b/, "CS A"], [/comp\w*\W*sci\w*\W*p|\bcsp\b/, "CSP"],
  [/phys\w*\W*c\b.*(elec|e\s*&\s*m|e\/m)/, "PHYS C:EM"], [/phys\w*\W*c\b/, "PHYS C:M"],
  [/phys\w*\W*(1|i)\b/, "PHYS 1"], [/phys\w*\W*(2|ii)\b/, "PHYS 2"], [/chem/, "CHEM"], [/bio/, "BIO"],
  [/env/, "ENV SCI"], [/eng\w*\W*(lang|comp\b(?!.*lit))/, "ENG LANG"], [/eng\w*\W*(lit|comp)/, "ENG LIT"],
];

/** A test's name, tidied: "Self AP Calculus BC/ucapp" -> "AP Calculus BC". */
export const testName = (test: string) => test.replace(/\/ucapp\b/i, "").replace(/^self\s+/i, "").replace(/\s+/g, " ").trim();

function testKey(test: string) {
  const name = testName(test).toLowerCase();
  if (!/^ap\b/.test(name)) return name;
  const rest = name.replace(/^ap\W*/, "").replace(/^math\w*\W*/, "");
  return `ap ${AP_CODES.find(([re]) => re.test(rest))?.[1] ?? rest}`;
}

/** getSectionPrerequisites' table: one row per course or test, the connector ("And"/"Or") on the
 *  row it starts, grouping as literal parentheses in the unlabelled columns. As the extension
 *  reads it (src/lib/banner.js there, parseTable). */
export function parsePrereqs(html: string): Details["prereqs"] {
  const table = /<table\b[\s\S]*?<\/table>/i.exec(html)?.[0];
  if (!table) return null;
  const cells = (row: string, tag: string) =>
    [...row.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))].map((m) => text(m[1]));
  const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((m) => m[1]);
  const heads = cells(rows[0] ?? "", "th").map((h) => h.toLowerCase());
  const at = (re: RegExp) => heads.findIndex((h) => re.test(h));
  const cols = { conn: at(/and\s*\/\s*or/), test: at(/^test/), score: at(/^score/), subject: at(/^subject/), number: at(/number/), grade: at(/grade/) };
  if (cols.conn < 0 || (cols.subject < 0 && cols.test < 0)) return null;
  const claimed = new Set(Object.values(cols));

  type Open = { items: (Open | Leaf)[]; conns: ("and" | "or")[]; parent: Open | null };
  const root: Open = { items: [], conns: [], parent: null };
  let cur = root;
  const leaves: Leaf[] = [];
  for (const row of rows.slice(1)) {
    const c = cells(row, "td");
    if (!c.length) continue;
    const get = (i: number) => (i >= 0 ? c[i] ?? "" : "");
    const loose = c.filter((_, i) => !claimed.has(i)).join("");
    const conn = get(cols.conn).toLowerCase();
    if (cur.items.length && (conn === "and" || conn === "or")) cur.conns.push(conn);
    for (let i = 0; i < (loose.match(/\(/g) ?? []).length; i++) {
      const g: Open = { items: [], conns: [], parent: cur };
      cur.items.push(g);
      cur = g;
    }
    const leaf: Leaf = { subject: get(cols.subject), number: get(cols.number), test: get(cols.test), score: get(cols.score), grade: get(cols.grade) };
    if (leaf.subject || leaf.test) { cur.items.push(leaf); leaves.push(leaf); }
    for (let i = 0; i < (loose.match(/\)/g) ?? []).length && cur.parent; i++) cur = cur.parent;
  }
  if (!leaves.length) return null;

  // Said once under the list when several courses all ask the same; one course keeps its own.
  const courses = leaves.filter((l) => !l.test);
  const grades = [...new Set(courses.map((l) => l.grade).filter(Boolean))];
  const grade = courses.length > 1 && grades.length === 1 ? grades[0] : "";
  if (grade) for (const l of leaves) l.grade = "";

  // Drop the parent links, the same test listed twice in one group, and one-item groups.
  const simplify = (node: Open | Leaf): Prereq | null => {
    if (!("items" in node)) return node;
    const seen = new Set<string>();
    const items = node.items.filter((n) => {
      if ("items" in n || !n.test) return true;
      const key = `${testKey(n.test)}|${n.score}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(simplify).filter((n): n is Prereq => !!n);
    if (items.length <= 1) return items[0] ?? null;
    const ops = new Set(node.conns);
    return { op: ops.size === 1 ? [...ops][0] : ops.size ? "mixed" : "and", items, conns: node.conns };
  };
  const tree = simplify(root);
  return tree && { tree, grade };
}

/** A course's description and prerequisites, asked about through one of its sections. Throws when
 *  Banner can't be reached, so a failure isn't kept; the page then goes without. */
export async function courseDetails(term: string, crn: string): Promise<Details> {
  "use cache: remote";
  cacheLife({ stale: 86_400, revalidate: 7 * 86_400, expire: 30 * 86_400 });
  const [description, prereqs] = await Promise.all([
    banner("getCourseDescription", term, crn).then(parseDescription),
    banner("getSectionPrerequisites", term, crn).then(parsePrereqs),
  ]);
  return { description, prereqs };
}

/** Every course's corequisites, by course key ("PHYS008" -> ["PHYS008L"]). Empty if the API
 *  can't be reached. */
export async function loadCoreqs(): Promise<Record<string, string[]>> {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 3600, expire: 86_400 });
  try {
    const res = await fetch(`${API}/coreqs`, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) return {};
    return ((await res.json()) as { courses: Record<string, string[]> }).courses;
  } catch {
    return {};
  }
}
