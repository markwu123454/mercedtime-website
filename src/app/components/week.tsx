import type { CSSProperties } from "react";
import { DAY_NAMES } from "@/lib/classes";

// One week, Monday to Friday, drawn as the extension's calendar draws it (the mercedtime repo's
// scheduleSvg in src/lib/schedule.js): classes as tinted boxes with a 1px border, free time in
// green, and the dining centers' meal hours in a Food column. Positions are in hours times --hour,
// which the page sets smaller on phones.

export type Block = {
  key: string;
  day: number;
  start: number;
  end: number;
  /** The bold first line ("PHYS 008"), then whatever else fits. */
  title: string;
  lines?: string[];
  tone: "class" | "planned" | "free";
};

/** The extension's calendar colours (schedule.js STYLE). */
const TONES: Record<Block["tone"], string> = {
  class: "bg-[#dbeafe] border-[#3b82f6] text-[#1e40af]",
  planned: "bg-[#fef3c7] border-[#f59e0b] text-[#92400e] border-dashed",
  free: "bg-[#dcfce7] border-[#22c55e] text-[#15803d] items-center justify-center text-center",
};

/** The Pavilion's and the DC's weekday meals (the extension's dining.js, read October 2026). */
const DINING = [
  { short: "Pav", meals: [["Breakfast", 7, 10], ["Lunch", 11, 15], ["Dinner", 16, 21]] },
  { short: "DC", meals: [["Lunch", 10, 14], ["Dinner", 15, 20], ["Late night", 21, 24]] },
] as const;

const hourLabel = (h: number) => `${h % 12 || 12}${h >= 12 ? "pm" : "am"}`;

export default function Week({ blocks, from, to, dining = false }: {
  blocks: Block[];
  /** The hours shown, whole hours (9, 17). */
  from: number;
  to: number;
  dining?: boolean;
}) {
  const hours = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const y = (min: number) => `calc(${(min / 60 - from).toFixed(3)} * var(--hour))`;
  const place = (start: number, end: number): CSSProperties => ({
    top: y(Math.max(start, from * 60)),
    height: `calc(${((Math.min(end, to * 60) - Math.max(start, from * 60)) / 60).toFixed(3)} * var(--hour))`,
  });

  return (
    <div className="[--hour:34px] sm:[--hour:48px]">
      <div className={`grid text-[11px] leading-[13px] ${dining ? "grid-cols-[2.25rem_1.75rem_repeat(5,minmax(0,1fr))] sm:grid-cols-[2.75rem_2.5rem_repeat(5,minmax(0,1fr))]" : "grid-cols-[2.25rem_repeat(5,minmax(0,1fr))] sm:grid-cols-[2.75rem_repeat(5,minmax(0,1fr))]"}`}>
        {/* the header row */}
        <div />
        {dining && <div className="pb-2 text-center font-semibold text-[#161616]">Food</div>}
        {DAY_NAMES.slice(0, 5).map((d) => (
          <div key={d} className="pb-2 text-center text-[13px] font-semibold text-[#161616]">{d}</div>
        ))}

        {/* the hours */}
        <div className="relative" style={{ height: `calc(${to - from} * var(--hour))` }}>
          {hours.map((h) => (
            <span key={h} className="absolute right-1.5 -translate-y-1/2 text-[#8d8d8d]" style={{ top: y(h * 60) }}>{hourLabel(h)}</span>
          ))}
        </div>

        {/* the dining centers' meals, a strip each */}
        {dining && (
          <div className="relative flex justify-center gap-0.5 border-l border-[#e0e0e0] sm:gap-1">
            {DINING.map((hall) => (
              <div key={hall.short} className="relative w-3 sm:w-4">
                {hall.meals.filter(([, start, end]) => end > from && start < to).map(([meal, start, end]) => (
                  <div key={meal} title={`${hall.short} ${meal}`}
                    className="absolute inset-x-0 flex items-center justify-center overflow-hidden rounded-[3px] border border-[#9ca3af] bg-[#e5e7eb] text-[9px] text-black sm:text-[10px]"
                    style={place(start * 60, end * 60)}>
                    <span className="whitespace-nowrap [writing-mode:vertical-rl] rotate-180">{hall.short} {meal}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* the days */}
        {[0, 1, 2, 3, 4].map((day) => (
          <div key={day} className="relative border-l border-[#e0e0e0]">
            {hours.slice(0, -1).map((h) => (
              <div key={h} className="absolute inset-x-0 border-t border-[#f0f0f0]" style={{ top: y(h * 60) }} />
            ))}
            {blocks.filter((b) => b.day === day && b.end > from * 60 && b.start < to * 60).map((b) => (
              <div key={b.key}
                className={`absolute inset-x-[3px] flex flex-col overflow-hidden rounded-[3px] border px-1 py-0.5 sm:px-1.5 ${TONES[b.tone]}`}
                style={place(b.start, b.end)}>
                {b.tone === "free" ? (
                  <span className="text-[10px] sm:text-[11px]">{b.title}</span>
                ) : (
                  <>
                    <span className="truncate text-[10px] font-bold sm:text-[11px]">{b.title}</span>
                    {/* as many lines as the box holds at 48px an hour: 50 minutes fits one, 75 two */}
                    {b.lines?.slice(0, b.end - b.start >= 70 ? 2 : b.end - b.start >= 45 ? 1 : 0).map((l) => <span key={l} className="hidden truncate sm:block">{l}</span>)}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
