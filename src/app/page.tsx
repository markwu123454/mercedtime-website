import Backdrop from "./components/backdrop";
import SendLinkForm from "./components/send-link-form";
// The cards are turned off for now (see below); this brings them back.
// import { CardCloud, CardDeck } from "./components/feature-cards";
import { storeUrl, type StoreSource } from "./site";

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
    // The background holds still behind the whole screen, so it reaches the footer however short
    // the page is (isolate keeps its -z-10 layer above the body's own background).
    <main className="relative isolate overflow-x-clip text-white">
      <Backdrop />

      <section className="relative flex flex-col items-start px-6 pt-[88px] pb-12 md:items-center md:px-16 md:pt-20 md:text-center">
        <div className="font-display text-[40px] leading-none tracking-[1px] md:text-[52px]">
          M<span className="text-gold">T</span>
        </div>
        <h1 className="mt-2 font-display text-[min(80px,20vw)] leading-[.86] tracking-[1px] md:mt-2.5 md:text-[118px]">
          MERCED<span className="text-gold">TIME</span>
        </h1>
        <div className="mt-[22px] mb-[18px] h-1 w-14 bg-gold md:mt-7 md:mb-[22px] md:w-16" />
        <p className="text-xl leading-[1.4] font-semibold md:max-w-[520px] md:text-2xl md:text-balance">
          Search UC Merced classes, build schedules around your preferences, and track your degree.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-9 pointer-coarse:hidden">
          <StoreButton source="mercedtime-website-hero" />
          <span className="text-sm text-[#9fb0c6]">Free for UC Merced students</span>
        </div>
        <SendLinkForm siteKey={TURNSTILE_SITE_KEY} className="mt-7 hidden w-full max-w-md text-left md:mt-9 pointer-coarse:block" />
        {/* Turned off with the cards below.
        <p className="mt-12 hidden font-display text-xl leading-none tracking-[.14em] text-[#9fb0c6] compact:block">
          What it does <span aria-hidden>↓</span>
        </p>
        */}
      </section>

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
