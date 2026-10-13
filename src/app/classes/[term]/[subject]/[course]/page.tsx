/**
 * A course's page for one semester — mercedtime.com/classes/spring-2027/math/021
 *
 * One page for every course in each of the newest fall and spring semesters, since what's offered,
 * who teaches it and even the description change from one to the next: Banner's description and
 * prerequisites for that semester, the corequisites, its sections with their times, rooms,
 * instructors and seats, a link to the same course in the other semester, a few nearby courses in
 * its subject, and the store button. They're here for students searching a course's name ("MATH
 * 021 UC Merced"), so each is a real page for search engines: rendered the first time it's asked
 * for after a deploy (see generateStaticParams), kept, and refreshed once a day with the class data
 * (load-classes.ts, loadSemesters), seats included: the extension is where they're live. A course
 * the semester doesn't offer, or a semester the site doesn't list, is a 404.
 */

import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {Fragment, Suspense, type ReactNode} from "react";
import {locationLabel} from "@/lib/buildings";
import {bySection, coursePath, dayLetters, seatTier, termSlug, timeOfDay, type Classes, type Section} from "@/lib/classes";
import {courseDetails, loadCoreqs, testName, type Details, type Prereq} from "@/lib/course-details";
import {loadSemesters} from "@/lib/load-classes";
import Backdrop from "../../../../components/backdrop";
import SendLinkForm from "../../../../components/send-link-form";
import StoreButton from "../../../../components/store-button";
import {pageMetadata, SITE} from "../../../../seo";

const TURNSTILE_SITE_KEY = process.env.TURNSTILE_KEY!;

/** How many of the subject's other courses the bottom of the page links to. */
const NEARBY = 4;

type Props = PageProps<"/classes/[term]/[subject]/[course]">;

/** One course, the newest semester's first: the rest are rendered the first time each is asked for
 *  after a deploy, then kept like this one. Making all thousand-odd at build made every deploy slow
 *  and asked Banner about each in one burst (course-details.ts); this way the asking is spread out,
 *  and only for pages someone opens. The build must make at least one, so if the class data can't
 *  be had it makes MATH 021 (which then fills in, or 404s, once it can). */
export async function generateStaticParams() {
    try {
        const [newest] = await loadSemesters();
        const [, , term, subject, number] = coursePath(newest.term, newest.sections[0].course).split("/");
        return [{term, subject, course: number}];
    } catch {
        return [{term: "spring-2027", subject: "math", course: "021"}];
    }
}

/** The semester and course in the address, with the course's sections in the order the extension
 *  lists them, and the other semester if it offers the course too. */
async function find(params: Props["params"]) {
    const {term, subject, course} = await params;
    const semesters = await loadSemesters();
    const classes = semesters.find((c) => termSlug(c.term) === term.toLowerCase());
    if (!classes) return null;
    const path = coursePath(classes.term, `${subject} ${course}`);
    const sections = classes.sections.filter((s) => coursePath(classes.term, s.course) === path).sort(bySection);
    if (!sections.length) return null;
    const first = sections[0];
    const elsewhere = semesters.filter((c) => c !== classes && c.sections.some((s) => s.course === first.course));
    return {semesters, classes, sections, first, elsewhere};
}

type Found = NonNullable<Awaited<ReturnType<typeof find>>>;

/** The semester's description and prerequisites, through its first section; null when Banner
 *  can't be reached. */
const details = ({classes, first}: Found): Promise<Details | null> =>
    courseDetails(classes.code, first.crn).catch(() => null);

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const found = await find(params);
    if (!found) return {title: "Course not found · MercedTime", robots: {index: false}};
    const {classes, first} = found;
    const about = (await details(found))?.description;
    return pageMetadata(
        `${first.course}: ${first.title} · UC Merced ${classes.term}`,
        about
            ? `${first.course} at UC Merced, ${classes.term}: ${about.length > 130 ? `${about.slice(0, 127).replace(/\s+\S*$/, "")}…` : about}`
            : `${first.course} ${first.title} at UC Merced, ${classes.term}: prerequisites, sections, times, rooms, instructors, and open seats.`,
        coursePath(classes.term, first.course),
    );
}

// --- requirements ---------------------------------------------------------------------

/** Turns Banner's subject names into codes, and links the courses this semester has pages for. */
type Names = { code: (name: string) => string; href: (course: string) => string | null };

function CourseLink({course, names}: { course: string; names: Names }) {
    const href = names.href(course);
    return href
        ? <Link href={href} className="font-semibold text-gold hover:underline">{course}</Link>
        : <span className="font-semibold">{course}</span>;
}

/** Items in a sentence: "A, B, or C", "A and B", or with each item's own connector when they mix. */
function joined(items: ReactNode[], conns: string[], op: string) {
    return items.map((item, i) => (
        <Fragment key={i}>
            {i > 0 && (op === "mixed" ? ` ${conns[i - 1]} ` : items.length > 2 ? (i === items.length - 1 ? `, ${op} ` : ", ") : ` ${op} `)}
            {item}
        </Fragment>
    ));
}

function Requirement({node, names, nested = false}: { node: Prereq; names: Names; nested?: boolean }) {
    if (!("items" in node)) {
        if (node.test) return <>{testName(node.test)}{node.score && ` (score ${Number(node.score) || node.score}+)`}</>;
        const course = `${names.code(node.subject)} ${node.number}`.trim();
        return <><CourseLink course={course} names={names}/>{node.grade && ` (${node.grade} or better)`}</>;
    }
    const parts = joined(node.items.map((n, i) => <Requirement key={i} node={n} names={names} nested/>), node.conns, node.op);
    return nested ? <>({parts})</> : <>{parts}</>;
}

/** Prerequisites as a list when they're several requirements together, each a line of options. */
function Prerequisites({prereqs, names}: { prereqs: NonNullable<Details["prereqs"]>; names: Names }) {
    const {tree, grade} = prereqs;
    const lines = "items" in tree && tree.op === "and" ? tree.items : [tree];
    return (
        <>
            {lines.length > 1 && <p>All of these:</p>}
            <ul className={lines.length > 1 ? "mt-2 list-disc space-y-1.5 pl-5" : ""}>
                {lines.map((line, i) => <li key={i}><Requirement node={line} names={names}/></li>)}
            </ul>
            {grade && <p className="mt-2 text-sm text-[#9fb0c6]">Each course with a {grade} or better.</p>}
        </>
    );
}

// --- sections -------------------------------------------------------------------------

const SEAT_TONE = {open: "text-[#6fdc8c]", low: "text-gold", full: "text-[#ff8389]"};

function Seats({s}: { s: Section }) {
    const tier = seatTier(s);
    if (tier !== "full") return <span className={SEAT_TONE[tier]}>{s.seats} of {s.cap} open</span>;
    return (
        <span className={SEAT_TONE.full}>
            Full{s.waitCap > 0 && <span className="text-[#9fb0c6]"> · {s.waitOpen ? `${s.waitOpen} waitlist open` : "waitlist full"}</span>}
        </span>
    );
}

function SectionRow({s}: { s: Section }) {
    const where = s.meets[0] ? locationLabel(s.meets[0]) : "";
    return (
        <li className="grid gap-x-6 gap-y-1 px-5 py-4 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1.2fr)_9rem] sm:items-baseline">
            <p>
                <span className="font-semibold">{s.type || "Section"}</span>
                <span className="ml-2 text-sm text-[#9fb0c6] tabular-nums sm:ml-0 sm:block">CRN {s.crn}</span>
            </p>
            <p className="tabular-nums">
                {s.meets.length
                    ? s.meets.map((m, i) => <span key={i} className="block">{dayLetters(m.days)} {timeOfDay(m.start)}–{timeOfDay(m.end)}</span>)
                    : "Online or TBA"}
            </p>
            <p className="text-[#c3cfdd]">{s.instructor || "Staff"}{where && <span className="text-[#9fb0c6]"> · {where}</span>}</p>
            <p className="text-sm sm:text-right"><Seats s={s}/></p>
        </li>
    );
}

/** The subject's other courses this semester, the ones numbered nearest this one. */
function Nearby({classes, first}: { classes: Classes; first: Section }) {
    const subject = first.course.split(" ")[0];
    const titles = new Map<string, string>();
    for (const s of classes.sections) {
        if (s.course !== first.course && s.course.startsWith(`${subject} `) && !titles.has(s.course)) titles.set(s.course, s.title);
    }
    const n = (course: string) => parseInt(course.split(" ")[1], 10) || 0;
    const courses = [...titles]
        .sort(([a], [b]) => Math.abs(n(a) - n(first.course)) - Math.abs(n(b) - n(first.course)) || a.localeCompare(b))
        .slice(0, NEARBY)
        .sort(([a], [b]) => a.localeCompare(b, undefined, {numeric: true}));
    if (!courses.length) return null;
    return (
        <section aria-labelledby="more" className="mt-16">
            <h2 id="more" className="font-display text-4xl leading-none tracking-[1px]">
                More <span className="text-gold">{classes.subjects[subject] ?? subject}</span>
            </h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {courses.map(([course, title]) => (
                    <li key={course}>
                        <Link href={coursePath(classes.term, course)}
                              className="flex h-full gap-3 rounded-xl bg-white/[.04] px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/[.08] hover:ring-gold/40">
                            <span className="shrink-0 font-semibold text-gold">{course}</span>
                            <span className="min-w-0 text-[#c3cfdd]">{title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

// --- the page -------------------------------------------------------------------------

/** Everything that depends on the address: inside <Suspense>, so the backdrop and wordmark are a
 *  shell that shows at once even for an address the build didn't make. */
async function Course({params}: { params: Props["params"] }) {
    const found = await find(params);
    if (!found) notFound();
    const {semesters, classes, sections, first, elsewhere} = found;
    const [about, coreqs] = await Promise.all([details(found), loadCoreqs()]);

    const subject = first.course.split(" ")[0];
    const subjects: Record<string, string> = Object.assign({}, ...semesters.map((c) => c.subjects));
    const byName = new Map(Object.entries(subjects).map(([code, name]) => [name.toLowerCase(), code]));
    const offered = new Set(classes.sections.map((s) => s.course));
    const names: Names = {
        code: (name) => byName.get(name.toLowerCase()) ?? name,
        href: (course) => (offered.has(course) ? coursePath(classes.term, course) : null),
    };
    const together = (coreqs[first.course.replace(" ", "")] ?? []).map((key) => key.replace(/^([A-Z]+)(\d)/, "$1 $2"));
    const units = [...new Set(sections.map((s) => s.units).filter(Boolean))];
    const seatsAt = new Date(classes.seatsAt).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    });

    // For search engines: the course as schema.org describes one, with this semester's run of it.
    const structured = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: `${first.course}: ${first.title}`,
        courseCode: first.course,
        description: about?.description || `${first.title}, offered at UC Merced in ${classes.term}.`,
        url: `${SITE}${coursePath(classes.term, first.course)}`,
        provider: {"@type": "CollegeOrUniversity", name: "University of California, Merced", sameAs: "https://www.ucmerced.edu"},
        ...(units.length && {numberOfCredits: units[0]}),
        hasCourseInstance: {
            "@type": "CourseInstance",
            name: classes.term,
            courseMode: sections.some((s) => s.meets.length) ? "Onsite" : "Online",
            instructor: [...new Set(sections.map((s) => s.instructor).filter(Boolean))].map((name) => ({"@type": "Person", name})),
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structured)}}/>
            <p className="mt-8 text-sm font-semibold tracking-wide text-[#9fb0c6] uppercase">
                {classes.term} · {subjects[subject] ?? subject}{units.length > 0 && ` · ${units.join(" or ")} unit${units.join() === "1" ? "" : "s"}`}
            </p>
            <h1 className="mt-2 font-display text-6xl leading-[.9] tracking-[1px] md:text-8xl">
                {first.course}
                <span className="mt-2 block text-4xl text-gold md:text-5xl">{first.title}</span>
            </h1>
            {elsewhere.length > 0 && (
                <p className="mt-4 text-sm text-[#9fb0c6]">
                    Also offered in{" "}
                    {joined(elsewhere.map((c) => (
                        <Link key={c.code} href={coursePath(c.term, first.course)} className="font-semibold text-gold hover:underline">{c.term}</Link>
                    )), [], "and")}
                </p>
            )}
            {about?.description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#c3cfdd]">{about.description}</p>}

            <dl className="mt-8 grid gap-6 rounded-2xl bg-white/[.06] p-6 ring-1 ring-white/10 backdrop-blur-sm sm:grid-cols-2">
                <div>
                    <dt className="font-display text-2xl leading-none tracking-[1px] text-gold">Prerequisites</dt>
                    <dd className="mt-2 leading-relaxed">
                        {about?.prereqs ? <Prerequisites prereqs={about.prereqs} names={names}/>
                            : about ? "None." : <span className="text-[#9fb0c6]">Couldn&apos;t be loaded right now. UCM Registration lists them.</span>}
                    </dd>
                </div>
                <div>
                    <dt className="font-display text-2xl leading-none tracking-[1px] text-gold">Corequisites</dt>
                    <dd className="mt-2 leading-relaxed">
                        {together.length
                            ? <>Taken in the same semester: {joined(together.map((c) => <CourseLink key={c} course={c} names={names}/>), [], "and")}.</>
                            : "None."}
                    </dd>
                </div>
            </dl>

            <section aria-labelledby="sections" className="mt-12">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 id="sections" className="font-display text-4xl leading-none tracking-[1px]">Sections</h2>
                    <p className="text-sm text-[#9fb0c6]">{sections.length} in {classes.term} · seats as of {seatsAt}</p>
                </div>
                <ul className="mt-4 divide-y divide-white/10 rounded-2xl bg-white/[.04] ring-1 ring-white/10 backdrop-blur-sm">
                    {sections.map((s) => <SectionRow key={s.crn} s={s}/>)}
                </ul>
                <p className="mt-3 text-sm text-[#9fb0c6]">
                    From UC Merced&apos;s public class search, updated daily. MercedTime shows seats live; check UCM
                    Registration before you register.
                </p>
            </section>

            <section aria-labelledby="plan"
                     className="mt-16 rounded-2xl bg-white/[.06] p-6 ring-1 ring-white/10 backdrop-blur-sm md:p-8">
                <h2 id="plan" className="font-display text-4xl leading-[.95] tracking-[1px] md:text-5xl">
                    Fit {first.course} into <span className="text-gold">your week</span>
                </h2>
                <p className="mt-3 max-w-xl text-[#c3cfdd]">
                    MercedTime works out every way to take {first.course} with the rest of your classes,
                    without a clash, and shows what&apos;s left for your major, minor, and GEs.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 pointer-coarse:hidden">
                    <StoreButton source="mercedtime-website-course"/>
                    <span className="text-sm text-[#9fb0c6]">Free for UC Merced students</span>
                </div>
                <SendLinkForm siteKey={TURNSTILE_SITE_KEY} className="mt-6 hidden w-full max-w-md pointer-coarse:block"/>
            </section>

            <Nearby classes={classes} first={first}/>
        </>
    );
}

export default function CoursePage({params}: Props) {
    return (
        <main className="relative isolate overflow-x-clip text-white">
            <Backdrop/>
            <div className="mx-auto max-w-5xl px-4 pt-20 pb-24 sm:px-6 md:pt-28">
                <Link href="/" className="font-display text-3xl leading-none tracking-[1px]">
                    MERCED<span className="text-gold">TIME</span>
                </Link>
                <Suspense fallback={<p className="mt-8 text-[#9fb0c6]">Loading this course…</p>}>
                    <Course params={params}/>
                </Suspense>
            </div>
        </main>
    );
}
