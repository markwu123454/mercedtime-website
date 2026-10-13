import type {ReactNode} from "react";
import Backdrop from "./components/backdrop";
import ClassSearch from "./components/class-search";
import DegreeProgress from "./components/degree-progress";
import ScheduleCalendar from "./components/schedule-calendar";
import PlanBoard from "./components/plan-board";
import SchedulePick from "./components/schedule-pick";
import SendLinkForm from "./components/send-link-form";
// The cards are turned off for now (see below); this brings them back.
// import { CardCloud, CardDeck } from "./components/feature-cards";
import {NAME, SITE} from "./seo";
import {storeUrl, type StoreSource} from "./site";

// Phones and tablets can't install Chrome extensions, so where the main pointer is a finger
// (pointer: coarse) the store buttons give way to a form that emails the student the link.
// It's CSS, so the right one shows from the first paint; a touchscreen laptop still counts as a
// mouse. The site key is public: it names the Turnstile widget the form shows.
const TURNSTILE_SITE_KEY = process.env.TURNSTILE_KEY!;

function StoreButton({source}: { source: StoreSource }) {
    return (
        <a
            href={storeUrl(source)}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-navy-deep shadow-lg shadow-black/20 transition hover:brightness-110"
        >
            Add to Chrome
            <span aria-hidden>→</span>
        </a>
    );
}

const STEPS = [
    ["Add it to Chrome", "Free from the Chrome Web Store, on any computer with Chrome."],
    ["Sign in to UCM Registration", "The way you already do. MercedTime never asks for your password."],
    ["Open MercedTime", "Click its icon in Chrome’s toolbar, or just open UCM Registration."],
];

/** One thing MercedTime does: what it is beside a demo to try (above it on phones). */
function Feature({id, title, text, note, demo, flip = false}: {
    id: string;
    title: ReactNode;
    text: string;
    note: string;
    demo: ReactNode;
    flip?: boolean;
}) {
    return (
        <section aria-labelledby={id} className="relative px-4 pb-24 sm:px-6 md:px-16">
            <div
                className={`mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-center gap-8 lg:gap-14 ${flip ? "lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]" : "lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"}`}>
                <div className={`px-2 sm:px-0 ${flip ? "lg:order-2" : ""}`}>
                    <h2 id={id} className="font-display text-5xl leading-[.95] tracking-[1px] text-balance md:text-6xl">{title}</h2>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-[#c3cfdd]">{text}</p>
                    <p className="mt-4 text-sm text-[#9fb0c6]">{note}</p>
                </div>
                <div className={flip ? "lg:order-1" : ""}>{demo}</div>
            </div>
        </section>
    );
}

// For search engines: what MercedTime is, as schema.org describes a free app.
const STRUCTURED = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: NAME,
    url: SITE,
    description: "A free Chrome extension for UC Merced students: search classes, plan semesters, pick a schedule, and track degree progress.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Chrome",
    image: `${SITE}/og.png`,
    downloadUrl: storeUrl("mercedtime-website-hero"),
    offers: {"@type": "Offer", price: "0", priceCurrency: "USD"},
};

export default function Home() {
    return (
        // The background holds still behind the whole screen, so it reaches the footer however short
        // the page is (isolate keeps its -z-10 layer above the body's own background).
        <main className="relative isolate overflow-x-clip text-white">
            <Backdrop/>
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(STRUCTURED)}}/>

            {/* The hero fills the first screen, whatever its height; the steps start below it. */}
            <section
                className="relative flex min-h-svh flex-col items-start justify-center px-6 py-16 md:items-center md:px-16 md:text-center">
                <div className="font-display text-[40px] leading-none tracking-[1px] md:text-[52px]">
                    M<span className="text-gold">T</span>
                </div>
                <h1 className="mt-2 font-display text-[min(80px,20vw)] leading-[.86] tracking-[1px] md:mt-2.5 md:text-[118px]">
                    MERCED<span className="text-gold">TIME</span>
                </h1>
                <div className="mt-5.5 mb-4.5 h-1 w-14 bg-gold md:mt-7 md:mb-5.5 md:w-16"/>
                <p className="text-xl leading-[1.4] font-semibold md:max-w-130 md:text-2xl md:text-balance">
                    Your UC Merced plan, from now to graduation.
                </p>
                <p className="mt-3 max-w-130 text-base leading-normal text-[#c3cfdd] md:text-lg md:text-balance">
                    Build your next schedule, plan ahead, and see what&apos;s left for your
                    major, minor, and GEs.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-9 pointer-coarse:hidden">
                    <StoreButton source="mercedtime-website-hero"/>
                    <span className="text-sm text-[#9fb0c6]">Free for UC Merced students</span>
                </div>
                <SendLinkForm siteKey={TURNSTILE_SITE_KEY}
                              className="mt-7 hidden w-full max-w-md text-left md:mt-9 pointer-coarse:block"/>
                {/* Turned off with the cards below.
        <p className="mt-12 hidden font-display text-xl leading-none tracking-[.14em] text-[#9fb0c6] compact:block">
          What it does <span aria-hidden>↓</span>
        </p>
        */}
            </section>

            <section aria-labelledby="start" className="relative px-6 pt-4 pb-24 md:px-16">
                <h2 id="start" className="sr-only">How to start</h2>
                <ol className="mx-auto grid max-w-5xl gap-3 md:grid-cols-3 md:gap-4">
                    {STEPS.map(([title, text], i) => (
                        <li key={title}
                            className="flex gap-4 rounded-2xl bg-white/[.06] p-5 ring-1 ring-white/10 backdrop-blur-sm md:flex-col md:gap-3">
                            <span className="font-display text-4xl leading-none text-gold">{i + 1}</span>
                            <div>
                                <p className="font-semibold">{title}</p>
                                <p className="mt-1 text-sm leading-relaxed text-[#b5c3d4]">{text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <Feature
                id="search"
                title={<>Every class, <span className="text-gold">every seat</span></>}
                text="Search the semester by course, title, instructor, or CRN."
                note="Try it: these are this semester’s real classes."
                demo={<ClassSearch/>}
            />

            <Feature
                id="plan"
                flip
                title={<>Every semester, <span className="text-gold">side by side</span></>}
                text="Lay out each semester from now to graduation."
                note="Try it: drag a course to another semester."
                demo={<PlanBoard/>}
            />

            <Feature
                id="schedules"
                title={<>Every schedule <span className="text-gold">that fits</span></>}
                text="Pick your courses and say what matters to you. MercedTime works out every way to take them without a clash, best first."
                note=""
                demo={<SchedulePick/>}
            />

            <Feature
                id="calendar"
                flip
                title={<>Your week, <span className="text-gold">ready to go</span></>}
                text="See your classes, the free time between them, and when the dining halls are open."
                note="Try it: switch things on and off."
                demo={<ScheduleCalendar/>}
            />

            <Feature
                id="degree"
                title={<>See what&apos;s left <span className="text-gold">to graduate</span></>}
                text="Your major, minor, and GE requirements, with every course marked done, taking, planned, or not yet. Plan ahead and see what your plan would finish."
                note="My Degree Path stays your official record."
                demo={<DegreeProgress/>}
            />

            {/*
        Turned off for now: the cards (a cloud to hover with a mouse, a deck to scroll through on
        phones and tablets) and the closing section under them. To bring them back, uncomment this,
        the "What it does" line above and the import at the top. The cloud's mb-12 leaves the
        footer's fade (the 3rem above it) on empty background, not the lowest cards.

      <CardCloud className="mt-6 mb-12 compact:hidden" />
      <CardDeck className="hidden compact:block" />

      <section className="hidden bg-navy-deep px-6 pt-14 pb-10 compact:block">
        <div className="mx-auto max-w-md">
          <p className="font-display text-[44px] leading-[.95] tracking-[1px]">
            Free for every UC Merced <span className="text-gold">student</span>
          </p>
          <div className="mt-6 pointer-coarse:hidden">
            <StoreButton source="mercedtime-website-bottom" />
          </div>
          <SendLinkForm siteKey={TURNSTILE_SITE_KEY} className="mt-6 hidden pointer-coarse:block" />
        </div>
      </section>
      */}
        </main>
    );
}
