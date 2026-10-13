import type { CSSProperties } from "react";

// The home page's background, held still behind the whole screen: the navy gradient, two slow glows
// (blue top right, gold on the left), a week of faint timetable lines fading down from the top with
// a few class blocks on it in the app's own calendar colours, and a little grain.
//
// The blocks sit on the timetable's cells: columns counted from the middle of the screen (0 is the
// one just right of centre, -1 just left), rows from the top. They stay out from behind the text:
// on wide screens beside the title, on phones above it.

type Tone = "class" | "free" | "planned" | "plain" | "gold";

// The app's calendar: a registered class in blue, free time in green, a planned course dashed.
const TONES: Record<Tone, string> = {
  class: "border border-[#3b82f6]/25 bg-[#3b82f6]/10",
  free: "border border-[#22c55e]/20 bg-[#22c55e]/[.07]",
  planned: "border border-dashed border-gold/35 bg-gold/[.05]",
  plain: "border border-white/[.07] bg-white/[.04]",
  gold: "bg-gold/[.12]",
};

/** [column, row, rows tall, tone] */
type Block = [number, number, number, Tone];

const WIDE: Block[] = [
  [3, 0, 1, "plain"],
  [4, 0, 2, "class"],
  [5, 0, 1, "gold"],
  [5, 1, 3, "plain"],
  [4, 3, 2, "free"],
  [3, 5, 1, "planned"],
  [-5, 1, 2, "class"],
  [-6, 2, 3, "plain"],
  [-4, 4, 1, "gold"],
  [-5, 5, 2, "free"],
  [-4, 7, 1, "planned"],
];

const NARROW: Block[] = [
  [-3, 0, 1, "free"],
  [0, 0, 1, "plain"],
  [1, 0, 2, "class"],
  [2, 0, 1, "gold"],
  [2, 1, 1, "planned"],
];

// Lines down the middle of each column-wide tile (so one runs down the centre of the screen) and
// along the top of each row.
const LINE = "rgb(255 255 255 / .05)";
const TIMETABLE: CSSProperties = {
  backgroundImage: [
    `linear-gradient(to right, transparent calc(50% - .5px), ${LINE} calc(50% - .5px) calc(50% + .5px), transparent calc(50% + .5px))`,
    `linear-gradient(to bottom, ${LINE} 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: "var(--col) 100%, 100% var(--row)",
  backgroundPosition: "center top, left top",
  maskImage: "linear-gradient(to bottom, black 10%, transparent 80%)",
};

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Blocks({ blocks, className }: { blocks: Block[]; className: string }) {
  return blocks.map(([col, row, rows, tone]) => (
    <div
      key={`${col},${row}`}
      className={`absolute rounded-[10px] ${TONES[tone]} ${className}`}
      style={{
        left: `calc(50% + ${col} * var(--col) + 5px)`,
        top: `calc(${row} * var(--row) + 5px)`,
        width: "calc(var(--col) - 10px)",
        height: `calc(${rows} * var(--row) - 10px)`,
      }}
    />
  ));
}

export default function Backdrop() {
  return (
    <div
      aria-hidden
      data-backdrop
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden bg-[linear-gradient(160deg,var(--color-navy-light)_0%,var(--color-navy)_30%,var(--color-navy-deep)_60%)] md:bg-[linear-gradient(160deg,var(--color-navy-light)_0%,var(--color-navy)_45%,var(--color-navy-deep)_100%)]"
    >
      <div className="absolute -top-[200px] -right-[220px] size-[480px] animate-drift rounded-full bg-[radial-gradient(circle,rgb(64_140_255/.28),rgb(64_140_255/0)_70%)] motion-reduce:animate-none md:-top-[260px] md:-right-[280px] md:size-[800px]" />
      <div className="absolute top-[35%] -left-[220px] size-[440px] animate-drift rounded-full bg-[radial-gradient(circle,rgb(216_172_39/.16),rgb(216_172_39/0)_70%)] [animation-direction:alternate-reverse] [animation-duration:36s] motion-reduce:animate-none md:top-[8%] md:-left-[320px] md:size-[760px]" />
      <div className="absolute inset-0 [--col:72px] [--row:44px] md:[--col:112px] md:[--row:56px]" style={TIMETABLE}>
        <Blocks blocks={WIDE} className="hidden md:block" />
        <Blocks blocks={NARROW} className="md:hidden" />
      </div>
      <div className="absolute inset-0 opacity-[.05]" style={{ backgroundImage: GRAIN }} />
      {/* Phones: above the backdrop the browser shows the page's own navy-deep (under the status
          bar, and on overscroll), so the backdrop's top fades in from it rather than starting at a
          hard line. */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-navy-deep to-transparent md:hidden" />
    </div>
  );
}
