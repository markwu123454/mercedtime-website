"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Scheme } from "@/lib/buildings";
import { classBlocks, freeBlocks, sectionsByCourse, starterSchedules } from "@/lib/week";
import AppFrame from "./app-frame";
import { useClasses } from "./use-classes";
import Week from "./week";

// The home page's calendar demo: like the extension's Schedule page, with the starter courses' best
// week this semester and its "On your week" switches working. The week always shows 9am to 7pm, the
// free time's hours, so a switch never changes the height of the box.

function Setting({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-h-8 items-center gap-3">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Swatch({ className, children }: { className: string; children: ReactNode }) {
  return <span className="flex items-center gap-1.5"><span className={`size-3 rounded-[2px] border ${className}`} />{children}</span>;
}

export default function ScheduleCalendar() {
  const classes = useClasses();
  const ready = classes && classes !== "error" ? classes : null;
  const [free, setFree] = useState(true);
  const [dining, setDining] = useState(true);
  const [scheme, setScheme] = useState<Scheme>("common");

  const week = useMemo(() => (ready ? starterSchedules(sectionsByCourse(ready)).results[0] : undefined), [ready]);
  const classesShown = week ? classBlocks(week.sections, "class", scheme) : [];
  const blocks = free ? [...freeBlocks(classesShown), ...classesShown] : classesShown;

  return (
    <AppFrame tab="Schedule" label="Your week, from the MercedTime extension">

      {/* "On your week": the extension's settings column, as a bar above the week here */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-[#e0e0e0] bg-[#f4f4f4] px-4 py-2">
        <span className="cds-label w-full sm:w-auto">On your week</span>
        <Setting label="Free time">
          <input type="checkbox" role="switch" className="cds-switch" checked={free} onChange={(e) => setFree(e.target.checked)} />
        </Setting>
        <Setting label="Dining hours">
          <input type="checkbox" role="switch" className="cds-switch" checked={dining} onChange={(e) => setDining(e.target.checked)} />
        </Setting>
        <Setting label="Buildings">
          <select className="cds-field" value={scheme} onChange={(e) => setScheme(e.target.value as Scheme)}>
            <option value="common">Common names</option>
            <option value="official">Official names</option>
          </select>
        </Setting>
      </div>

      <div>
        <div className="min-w-0 px-3 pt-4 pb-3 sm:px-5">
          <h3 className="mb-3 text-xl leading-7">{ready?.term ?? " "}</h3>
          {week ? <Week blocks={blocks} from={9} to={19} dining={dining} /> : <div className="h-90 bg-[#f4f4f4]" />}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#525252]">
            <Swatch className="border-[#3b82f6] bg-[#dbeafe]">Class</Swatch>
            <Swatch className="border-[#22c55e] bg-[#dcfce7]">Free time</Swatch>
            <Swatch className="border-[#9ca3af] bg-[#e5e7eb]">Dining hours</Swatch>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
