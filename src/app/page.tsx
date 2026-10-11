import Image, { type StaticImageData } from "next/image";
import SendLinkForm from "./components/send-link-form";
import { storeUrl, type StoreSource } from "./site";
import home from "@/assets/screenshots/home.png";
import findClasses from "@/assets/screenshots/find-classes.png";
import plan from "@/assets/screenshots/plan.png";
import schedule from "@/assets/screenshots/schedule.png";
import degree from "@/assets/screenshots/degree.png";

// Screenshots are copies of store-assets/*.png in the mercedtime repo (sample data, not a real student).

const CHIPS = ["Class search", "Semester planner", "Weekly schedule", "Degree audit", "Seat alerts", "Registration reminders"];

const FEATURES: { title: string; body: string; shot: StaticImageData; alt: string }[] = [
  {
    title: "Find classes",
    body: "Search by class name, subject, course number, CRN or instructor, and see open seats, waitlists, times, rooms, final exams and prerequisites at a glance.",
    shot: findClasses,
    alt: "Find classes: a searchable course list with open seats, times and a section detail panel.",
  },
  {
    title: "Plan",
    body: "Every semester in one list, from classes you’ve taken to future plans. See every possible schedule for your classes, keep lunch free, and sort by fewest days on campus.",
    shot: plan,
    alt: "Plan: every semester listed with planned courses and unit totals.",
  },
  {
    title: "Schedule",
    body: "Your week, drawn from your registered or planned classes, with the free time between them, dining hall hours, and a one-click download as an image.",
    shot: schedule,
    alt: "Schedule: a weekly calendar of registered classes with free time between them.",
  },
  {
    title: "Degree",
    body: "Your degree audit, with each requirement marked done, in progress, planned or still needed, and what your plan would finish.",
    shot: degree,
    alt: "Degree: the degree audit with each requirement marked done, in progress, planned or needed.",
  },
];

const POINTS = [
  {
    title: "Never asks for your password",
    body: "It works with the UC Merced registration and degree audit sites you’re already signed in to.",
  },
  {
    title: "Can’t add or drop classes",
    body: "Its Register button takes you to UC Merced’s own registration page for that.",
  },
  {
    title: "Your data stays with you",
    body: "Your plan and settings follow you through Chrome sync, if you have it on. Everything else stays on your computer.",
  },
];

// Phones and tablets can't install Chrome extensions, so where the main pointer is a finger
// (pointer: coarse) the store buttons give way to a form that emails the student the link.
// It's CSS, so the right one shows from the first paint; a touchscreen laptop still counts as a
// mouse. The site key is public: it names the Turnstile widget the form shows.
const TURNSTILE_SITE_KEY = process.env.TURNSTILE_KEY!;

function StoreButton({ source }: { source: StoreSource }) {
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

export default function Home() {
  return (
    <main>
      <section className="overflow-hidden bg-[linear-gradient(160deg,var(--color-navy-light)_0%,var(--color-navy)_45%,var(--color-navy-deep)_100%)] text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 md:py-24 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="font-display text-5xl leading-none tracking-wide">
              M<span className="text-gold">T</span>
            </div>
            <h1 className="mt-2 font-display text-[clamp(64px,11vw,118px)] leading-[.86] tracking-wide">
              MERCED<span className="text-gold">TIME</span>
            </h1>
            <div className="mt-7 mb-6 h-1 w-16 bg-gold" />
            <p className="max-w-md text-xl leading-snug font-semibold md:text-2xl">
              Search UC Merced classes, build schedules around your preferences, and track your degree.
            </p>
            <ul className="mt-6 flex max-w-md flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <li key={chip} className="rounded-full border border-gold/60 px-3 py-1 text-sm text-[#f1dfa4]">
                  {chip}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 pointer-coarse:hidden">
              <StoreButton source="mercedtime-website-hero" />
              <span className="text-sm text-[#9fb0c6]">Free for UC Merced students</span>
            </div>
            <SendLinkForm siteKey={TURNSTILE_SITE_KEY} className="mt-9 hidden max-w-md pointer-coarse:block" />
            <p className="mt-6 text-sm text-[#9fb0c6]">
              Uses your existing UC Merced sign-in · Your data stays in your browser
            </p>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-[0_40px_90px_rgba(0,0,0,.55)] ring-1 ring-white/10">
            <div className="flex h-8 items-center gap-1.5 bg-[#e9edf2] px-3.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-[#c4cbd4]" />
              <span className="size-2.5 rounded-full bg-[#c4cbd4]" />
              <span className="size-2.5 rounded-full bg-[#c4cbd4]" />
            </div>
            <Image
              src={home}
              alt="The MercedTime home page: this semester’s weekly calendar, a registration countdown, CRNs to copy and the courses being watched for open seats."
              sizes="(min-width: 1152px) 600px, (min-width: 1024px) 52vw, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-2xl text-3xl leading-tight font-bold md:text-4xl">
          Your classes, schedule, plan and degree progress, in one place.
        </h2>
        <div className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {FEATURES.map((f) => (
            <article key={f.title}>
              <Image
                src={f.shot}
                alt={f.alt}
                sizes="(min-width: 1152px) 536px, (min-width: 768px) 46vw, 100vw"
                className="rounded-lg border border-rule shadow-sm"
              />
              <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-3xl leading-tight font-bold md:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {POINTS.map((p) => (
              <div key={p.title} className="border-t-4 border-gold pt-4">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col items-start gap-4 rounded-xl bg-navy px-8 py-10 text-white md:flex-row md:items-center md:justify-between">
            <p className="font-display text-4xl leading-none tracking-wide">
              Free for every UC Merced <span className="text-gold">student</span>
            </p>
            <div className="pointer-coarse:hidden">
              <StoreButton source="mercedtime-website-bottom" />
            </div>
            <SendLinkForm siteKey={TURNSTILE_SITE_KEY} className="hidden w-full max-w-md pointer-coarse:block" />
          </div>
        </div>
      </section>
    </main>
  );
}
