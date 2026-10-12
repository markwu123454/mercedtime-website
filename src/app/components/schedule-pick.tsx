"use client";

import { useMemo } from "react";
import type { Prefs } from "@/lib/schedules";
import { classBlocks, hoursFor, NO_PREFS, sectionsByCourse, starterSchedules, STARTERS } from "@/lib/week";
import AppFrame from "./app-frame";
import { useClasses } from "./use-classes";
import Week from "./week";

// The home page's schedule showcase, a still picture: like the extension's "Pick a schedule", with
// a couple of its filters set, on the starter courses' real sections this semester.

const PREFS: Prefs = { ...NO_PREFS, earliest: 10 * 60, lunch: true };

const count = (n: number) => (n >= 3000 ? "3,000+" : n.toLocaleString());

export default function SchedulePick() {
  const classes = useClasses();
  const ready = classes && classes !== "error" ? classes : null;
  const run = useMemo(() => (ready ? starterSchedules(sectionsByCourse(ready), PREFS) : null), [ready]);
  const schedule = run?.results[0];
  const blocks = schedule ? classBlocks(schedule.sections, "planned") : [];
  const { from, to } = hoursFor(blocks, 9, 17);

  return (
    <AppFrame tab="Plan" label="Pick a schedule, from the MercedTime extension">
      {/* A picture of the filters, not controls. */}
      <div className="cds-toolbar items-end gap-x-6 gap-y-3 text-sm whitespace-nowrap [&_.cds-field]:text-sm" aria-hidden>
        <div className="flex flex-col gap-1">
          <span className="cds-label">Sort by</span>
          <div className="cds-field flex w-56 items-center justify-between">Least time between classes<span className="text-[10px]">▼</span></div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="cds-label">Classes between</span>
          <div className="flex items-center gap-1.5">
            <div className="cds-field flex w-24 items-center">10:00 AM</div>
            <span>–</span>
            <div className="cds-field flex w-24 items-center text-[#8d8d8d]">Any time</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="cds-label">Keep free</span>
          <div className="cds-field flex items-center gap-2">Lunch <span className="text-[#525252]">12:00–1:00 PM</span></div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-4">
        <p className="mb-3">
          <span className="font-semibold">{run ? count(run.total) : "…"} schedules</span>
          <span className="text-[#525252]"> for {STARTERS.join(", ")}</span>
        </p>
        <div className="border border-[#e0e0e0] p-2 sm:p-3">
          {schedule ? <Week blocks={blocks} from={from} to={to} /> : <div className="h-90 bg-[#f4f4f4]" />}
        </div>
        <div className="mt-3 inline-flex h-8 items-center bg-[#0f62fe] px-4 text-white" aria-hidden>Use this schedule</div>
      </div>
    </AppFrame>
  );
}
