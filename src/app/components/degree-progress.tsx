"use client";

import { useEffect, useRef, useState } from "react";
import AppFrame from "./app-frame";

// The home page's degree demo: the extension's Degree › Roadmap for an example student, a
// Mechanical Engineering major in their second spring. Nothing here is real data or interactive;
// the bars fill in and the courses settle into place the first time it scrolls into view.

type Status = "done" | "ip" | "plan" | "todo";
type Requirement = { name: string; state: "Done" | "Partly done" | "Planned" | "Needed"; has: [string, Status][]; need?: string[] };

const PROGRAM = { name: "Mechanical Engineering, B.S.", passed: 52, taking: 16, planned: 30, total: 128 };

const CARDS: { title: string; reqs: Requirement[] }[] = [
  {
    title: "Major preparation",
    reqs: [
      { name: "Mathematics", state: "Partly done", has: [["MATH 021", "done"], ["MATH 022", "done"], ["MATH 023", "ip"], ["MATH 024", "plan"]], need: ["MATH 032 or ENGR 080"] },
      { name: "Physics", state: "Planned", has: [["PHYS 008 + 008L", "done"], ["PHYS 009 + 009L", "plan"]] },
      { name: "Chemistry", state: "Done", has: [["CHEM 002", "done"]] },
      { name: "Computing", state: "Needed", has: [], need: ["ME 021"] },
    ],
  },
  {
    title: "Engineering fundamentals",
    reqs: [
      { name: "Engineering fundamentals", state: "Partly done", has: [["ENGR 057", "ip"], ["ENGR 065", "plan"]], need: ["ENGR 045", "ENGR 130", "ENGR 151", "ENGR 155"] },
    ],
  },
  {
    title: "General education",
    reqs: [
      { name: "Writing", state: "Partly done", has: [["WRI 010", "done"]], need: ["Upper-division writing"] },
      { name: "Spark seminar", state: "Done", has: [["SPRK 010", "done"]] },
    ],
  },
];

const STATE_TAG: Record<Requirement["state"], string> = {
  Done: "cds-chip-done",
  "Partly done": "cds-chip-todo",
  Planned: "bg-transparent text-[#0f62fe]",
  Needed: "cds-chip-todo",
};
const DOT: Record<Requirement["state"], string> = {
  Done: "bg-[#24a148]", "Partly done": "bg-[#8d8d8d]", Planned: "bg-[#0f62fe]", Needed: "bg-[#8d8d8d]",
};

export default function DegreeProgress() {
  const box = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const seen = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); seen.disconnect(); }
    }, { threshold: 0.3 });
    seen.observe(box.current!);
    return () => seen.disconnect();
  }, []);

  const pct = (n: number) => `${shown ? (n / PROGRAM.total) * 100 : 0}%`;
  const grow = "transition-[width,left] duration-1000 ease-[cubic-bezier(.2,0,.38,.9)]";
  let n = 0;   // each course after the last settles in a moment later
  const settle = () => ({
    className: `transition-[opacity,translate] duration-500 ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`,
    style: { transitionDelay: `${300 + 40 * n++}ms` },
  });

  return (
    <div ref={box}>
      <AppFrame tab="Degree" label="Degree progress for an example student, from the MercedTime extension">
        <div className="flex border-b border-[#e0e0e0]" aria-hidden>
          {["Roadmap", "Overlaps", "Explore"].map((t, i) => (
            <span key={t} className={`border-b-[3px] px-4 py-3 ${i ? "border-transparent text-[#525252]" : "border-[#0f62fe]"}`}>{t}</span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#e0e0e0] px-4 py-2.5 text-xs">
          <span className="text-[#525252]">Example student · Unofficial</span>
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5"><span className="size-3 border border-[#24a148] bg-[#defbe6]" />Done</span>
            <span className="flex items-center gap-1.5"><span className="size-3 border border-dashed border-[#24a148] bg-white" />Taking</span>
            <span className="flex items-center gap-1.5"><span className="size-3 border border-[#0f62fe] bg-[#edf5ff]" />Planned</span>
            <span className="flex items-center gap-1.5"><span className="size-3 border border-[#8d8d8d] bg-[#e0e0e0]" />Not yet</span>
          </span>
        </div>

        <div className="h-120 overflow-y-auto overscroll-contain px-4 py-4">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h3 className="text-xl leading-7">{PROGRAM.name}</h3>
            <span className="cds-label">{PROGRAM.passed} units passed · {PROGRAM.taking} in progress · {PROGRAM.planned} planned</span>
          </div>
          {/* passed solid green, in progress green stripes, planned blue stripes */}
          <div className="relative mt-3 mb-5 h-3 bg-[#e0e0e0]">
            <div className={`absolute inset-y-0 left-0 bg-[#24a148] ${grow}`} style={{ width: pct(PROGRAM.passed) }} />
            <div className={`absolute inset-y-0 bg-[repeating-linear-gradient(45deg,#24a148_0_4px,#defbe6_4px_8px)] ${grow}`}
              style={{ left: pct(PROGRAM.passed), width: pct(PROGRAM.taking) }} />
            <div className={`absolute inset-y-0 bg-[repeating-linear-gradient(45deg,#78a9ff_0_4px,#d0e2ff_4px_8px)] ${grow}`}
              style={{ left: pct(PROGRAM.passed + PROGRAM.taking), width: pct(PROGRAM.planned) }} />
          </div>

          <div className="space-y-4">
            {CARDS.map((card) => (
              <section key={card.title} className="border border-[#e0e0e0] bg-[#f4f4f4] px-4 py-3">
                <h4 className="mb-2 text-base font-semibold">{card.title}</h4>
                {card.reqs.map((r) => (
                  <div key={r.name} className="border-t border-[#e0e0e0] py-2.5 first:border-0 first:pt-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className={`size-1.5 rounded-full ${DOT[r.state]}`} />
                      <span className="font-semibold">{r.name}</span>
                      <span className={`cds-tag px-2 before:hidden ${STATE_TAG[r.state]}`}>{r.state}</span>
                    </div>
                    {r.has.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {r.has.map(([c, s]) => { const a = settle(); return <span key={c} className={`cds-chip cds-chip-${s} ${a.className}`} style={a.style}>{c}</span>; })}
                      </div>
                    )}
                    {r.need && (
                      <>
                        <p className="cds-label mt-2 mb-1 uppercase">Still need</p>
                        <div className="flex flex-wrap gap-1">
                          {r.need.map((c) => { const a = settle(); return <span key={c} className={`cds-chip cds-chip-todo ${a.className}`} style={a.style}>{c}</span>; })}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </AppFrame>
    </div>
  );
}
