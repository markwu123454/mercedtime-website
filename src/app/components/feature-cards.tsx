"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { StaticImageData } from "next/image";
import home from "@/assets/store/home.png";
import findClasses from "@/assets/store/find-classes.png";
import plan from "@/assets/store/plan.png";
import schedule from "@/assets/store/schedule.png";
import degree from "@/assets/store/degree.png";

// The home page's tour of the extension: the callout cards from its Chrome Web Store art, each a
// crop of one of the 1280×800 store screenshots (sample data, not a real student).
//   CardCloud  with a mouse and room for it: the cards scattered in a cloud. Hovering one enlarges
//              it, straightens it and shows a line about it; the others fade back.
//   CardDeck   on phones, tablets and narrow windows: the cards in a pile, and scrolling deals them
//              out one at a time. The page holds still (a sticky stage) while they go by.
// The page renders both and shows one with the compact: variant (globals.css), so the right one is
// there from the first paint.

type Card = {
  title: string;
  desc: string;
  shot: StaticImageData;
  /** The part of the screenshot shown, x, y, width and height, then the zoom it's drawn at. */
  crop: [number, number, number, number, number];
  /** Its place in the 1280×860 cloud, left and top, and its tilt in degrees. */
  cloud: [number, number, number];
  /** Its place in the deck's pile, as an offset from the middle of the screen, and its tilt. */
  pile: [number, number, number];
};

const CARDS: Card[] = [
  {
    title: "Class details, one panel",
    desc: "Add a section to a future semester, watch it for seats, and see its waitlist, final exam and description.",
    shot: findClasses,
    crop: [942, 112, 320, 370, 0.81],
    cloud: [48, 20, -3],
    pile: [-112, -250, -4],
  },
  {
    title: "Seats and waitlists at a glance",
    desc: "Open seats and waitlist room on every section, without opening it.",
    shot: findClasses,
    crop: [735, 172, 105, 110, 1.3],
    cloud: [372, 0, 4],
    pile: [0, -280, 5],
  },
  {
    title: "Watch a full course for seats",
    desc: "Click the bell on a full course. A notification comes when a seat opens. A course and its lab are watched together.",
    shot: plan,
    crop: [674, 240, 292, 146, 1.0],
    cloud: [568, 24, -2],
    pile: [112, -240, -3],
  },
  {
    title: "Your registration time",
    desc: "A countdown to your own registration window, read from your registration status.",
    shot: home,
    crop: [905, 65, 358, 190, 0.8],
    cloud: [930, 0, 3],
    pile: [-104, -110, 3],
  },
  {
    title: "Every course, color-coded",
    desc: "Done, taking, planned or not yet, on every course in your degree.",
    shot: degree,
    crop: [640, 102, 275, 26, 1.2],
    cloud: [340, 262, 2],
    pile: [12, -130, -2],
  },
  {
    title: "Free time, marked",
    desc: "The gaps between your classes, using the hours you choose.",
    shot: schedule,
    crop: [284, 290, 160, 300, 0.8],
    cloud: [736, 278, -3],
    pile: [118, -90, 4],
  },
  {
    title: "Choose what counts as free",
    desc: "Set your free hours and show the dining halls’ meal times beside your classes.",
    shot: schedule,
    crop: [952, 286, 316, 160, 1.0],
    cloud: [924, 316, -2],
    pile: [-110, 40, -3],
  },
  {
    title: "Prerequisites, spelled out",
    desc: "Every prerequisite written out, checked against the classes you’ve taken.",
    shot: findClasses,
    crop: [948, 540, 300, 90, 1.0],
    cloud: [372, 388, -1],
    pile: [8, 20, 2],
  },
  {
    title: "A checklist before you register",
    desc: "Units, sections picked, open seats and holds, checked before your registration time.",
    shot: home,
    crop: [905, 252, 358, 252, 0.8],
    cloud: [40, 430, 2],
    pile: [116, 70, -4],
  },
  {
    title: "CRNs, ready to copy",
    desc: "The CRNs of the sections you picked, one click each or all at once.",
    shot: home,
    crop: [905, 528, 358, 262, 0.8],
    cloud: [944, 560, 2],
    pile: [-100, 200, 4],
  },
  {
    title: "One click to pick a schedule",
    desc: "Every clash-free schedule for your planned classes. Lock a section, keep lunch free, sort by fewest days.",
    shot: plan,
    crop: [834, 186, 134, 44, 1.4],
    cloud: [420, 590, 3],
    pile: [6, 230, -3],
  },
  {
    title: "What each requirement still needs",
    desc: "What’s done for each requirement, and which courses are still needed.",
    shot: degree,
    crop: [28, 296, 335, 92, 1.1],
    cloud: [640, 610, -2],
    pile: [112, 250, 3],
  },
];

/** A length of n design pixels. Inside the cloud --u shrinks with the page; in the deck it's 1px. */
const u = (n: number) => `calc(${n} * var(--u))`;

/**
 * The crop's size, and roughly the card's around it: padding, gold rule and title (a long title
 * can make a card wider than this).
 */
function measure({ crop: [, , w, h, zoom] }: Card) {
  const width = Math.round(w * zoom);
  const height = Math.round(h * zoom);
  return { width, height, cardWidth: width + 28, cardHeight: height + 59 };
}

/** A card: its title over its crop of the screenshot, then its description (children). */
function Face({ card, className = "", style, children }: { card: Card; className?: string; style?: CSSProperties; children: ReactNode }) {
  const [x, y, , , zoom] = card.crop;
  const { width, height } = measure(card);
  return (
    <div
      className={`relative border-t-gold bg-white text-[#161616] ${className}`}
      style={{ padding: `${u(12)} ${u(14)} ${u(14)}`, borderTopWidth: u(4), boxShadow: `0 ${u(24)} ${u(60)} rgb(0 0 0 / .5)`, ...style }}
    >
      <h3 className="leading-tight font-semibold whitespace-nowrap text-navy" style={{ fontSize: u(15), marginBottom: u(10) }}>
        {card.title}
      </h3>
      <div
        aria-hidden
        className="bg-no-repeat shadow-[inset_0_0_0_1px_#e0e0e0]"
        style={{
          width: u(width),
          height: u(height),
          borderRadius: u(6),
          backgroundImage: `url(${card.shot.src})`,
          backgroundSize: `${u(Math.round(1280 * zoom))} ${u(Math.round(800 * zoom))}`,
          backgroundPosition: `${u(-Math.round(x * zoom))} ${u(-Math.round(y * zoom))}`,
        }}
      />
      {children}
    </div>
  );
}

const CLOUD_HEIGHT = 860;

// Each card grows from the side nearest the cloud's edge, so enlarged it stays inside the cloud.
// The ones low in the cloud hang from their bottom edge, so the description an open card gains
// pushes it up rather than out of the bottom of the cloud.
const CLOUD = CARDS.map((card) => {
  const [left, top, tilt] = card.cloud;
  const { cardWidth, cardHeight } = measure(card);
  const middle = left + cardWidth / 2;
  const x = middle < 420 ? "left" : middle > 860 ? "right" : "center";
  const y = top < 120 ? "top" : top + cardHeight > 700 ? "bottom" : "center";
  const place = y === "bottom" ? { left: u(left), bottom: u(CLOUD_HEIGHT - top - cardHeight) } : { left: u(left), top: u(top) };
  return { card, place, tilt, origin: `${x} ${y}` };
});

export function CardCloud({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    // The cloud is laid out at 1280×860 and shrinks with narrower windows: --u is one of its pixels.
    <div className={`@container mx-auto w-full max-w-[1280px] ${className}`}>
      <ul aria-label="What MercedTime does" className="relative [--u:min(1px,100cqw/1280)]" style={{ height: u(CLOUD_HEIGHT) }}>
        {CLOUD.map(({ card, place, tilt, origin }, i) => {
          const on = open === i;
          return (
            // The <li> keeps the card's unscaled size, so the enlarged card doesn't catch the mouse
            // from its neighbours.
            <li
              key={card.title}
              onMouseEnter={() => setOpen(i)}
              onMouseLeave={() => setOpen((o) => (o === i ? null : o))}
              className="absolute"
              style={{ ...place, zIndex: on ? 50 : i + 1 }}
            >
              <Face
                card={card}
                className="pointer-events-none [transition:transform_.35s_cubic-bezier(.2,.8,.2,1),opacity_.25s] motion-reduce:transition-none"
                style={{
                  transform: on ? "rotate(0deg) scale(1.45)" : `rotate(${tilt}deg) scale(1)`,
                  transformOrigin: origin,
                  opacity: open === null || on ? 1 : 0.35,
                  borderRadius: u(12),
                }}
              >
                {/* Part of the open card and as wide as it (w-0 min-w-full keeps it from widening
                    the card). On a closed card it's there only for screen readers. */}
                <p
                  className={on ? "w-0 min-w-full leading-normal text-[#4b5563]" : "sr-only"}
                  style={on ? { marginTop: u(12), fontSize: u(13) } : undefined}
                >
                  {card.desc}
                </p>
              </Face>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const STEP = 420; // px of scrolling per card
// A card is fully out within HOLD of its place in the deck, and back in the pile FADE after that.
const HOLD = 0.12;
const FADE = 0.5;
const REACH = HOLD + FADE;
// Where the page snaps to in the deck: each card in front, and the pile with no card out, just
// before the first card and just after the last.
const STOPS = [-REACH, ...CARDS.map((_, i) => i), CARDS.length - 1 + REACH];
// How much the cards linger in front and hurry between, from 0 (steadily) to 1 (stopping dead).
const LINGER = 0.5;

/** How far through the cards the deck shows itself when scrolled to `at`: slower near each card, quicker between. */
function linger(at: number) {
  const card = Math.floor(at);
  const between = at - card;
  return card + between + LINGER * (smoothstep(between) - between);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}
// The deck was drawn on a 390×844 phone; on a smaller screen the pile draws in to fit.
const PHONE = { width: 390, height: 844 };

export function CardDeck({ className = "" }: { className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  // Which card is in focus: 0 is the first, 0.5 halfway to the second, -1 none yet.
  const [at, setAt] = useState(-1);
  const [screen, setScreen] = useState(PHONE);
  // Each card's unscaled size, estimated until the cards are on the page (a long title widens one).
  const [sizes, setSizes] = useState(() =>
    CARDS.map((card) => {
      const { cardWidth, cardHeight } = measure(card);
      return { width: cardWidth, height: cardHeight };
    }),
  );

  // The browser does the scrolling and the snapping (the markers below); this follows along.
  useEffect(() => {
    const trackEl = track.current;
    const stageEl = stage.current;
    if (!trackEl || !stageEl) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!trackEl.offsetHeight) return; // hidden: the page is showing the cloud
      // The first card comes into focus as the stage sticks, and each STEP after that the next.
      setAt(clamp(-trackEl.getBoundingClientRect().top / STEP - 0.6, -1, CARDS.length));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      setScreen({ width, height });
      // offsetWidth and offsetHeight leave out the cards' transforms.
      const faces = stageEl.querySelectorAll<HTMLElement>(":scope li > div");
      setSizes(Array.from(faces, (face) => ({ width: face.offsetWidth, height: face.offsetHeight })));
      onScroll();
    });

    resize.observe(stageEl);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const fit = Math.min(1, screen.width / PHONE.width, screen.height / PHONE.height);
  // How far each card is into focus, from 0 (in the pile) to 1 (front and centre, description showing).
  const shown = linger(at);
  const focus = CARDS.map((_, i) => smoothstep(clamp(1 - (Math.abs(i - shown) - HOLD) / FADE, 0, 1)));
  const anyFocus = Math.max(...focus);

  return (
    // data-deck-snap turns on the page's snapping while the deck is showing (globals.css).
    <div
      ref={track}
      data-deck-snap
      className={`relative ${className}`}
      style={{ height: `calc(100svh + ${(CARDS.length + 1) * STEP}px)` }}
    >
      {/* Where the page can come to rest in the deck: the scroll position of each stop. */}
      {STOPS.map((stop) => (
        <div key={stop} aria-hidden className="absolute inset-x-0 h-0 snap-start" style={{ top: (stop + 0.6) * STEP }} />
      ))}
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden [--u:1px]">
        <ul aria-label="What MercedTime does">
          {CARDS.map((card, i) => {
            const t = focus[i];
            const [px, py, tilt] = card.pile;
            const { width, height } = sizes[i];
            const small = Math.min(0.5, 128 / width, 150 / height) * fit;
            const large = Math.min(1.4, (screen.width - 60) / width, (screen.height * 0.52) / height);
            const x = px * fit * (1 - t);
            const y = py * fit * (1 - t) - 30 * t;
            const scale = small + (large - small) * t;
            // The card's bottom corners square off as its description fades in below them.
            const corner = (12 * (1 - t)).toFixed(1);
            return (
              <li
                key={card.title}
                className="absolute top-1/2 left-1/2 will-change-transform"
                style={{
                  transform: `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(tilt * (1 - t)).toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                  // While a card is out, the pile behind it dims.
                  opacity: t > 0.01 ? 1 : 1 - 0.65 * anyFocus,
                  zIndex: t > 0.01 ? 100 : i + 1,
                }}
              >
                <Face card={card} style={{ borderRadius: `12px 12px ${corner}px ${corner}px` }}>
                  {/* Hung below the card rather than in it, so in the pile a card is only as tall as its picture. */}
                  <p
                    className="absolute inset-x-0 top-full -mt-0.5 rounded-b-xl bg-white px-3.5 pb-3.5 text-[13px] leading-normal text-[#4b5563]"
                    style={{ opacity: t }}
                  >
                    {card.desc}
                  </p>
                </Face>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
