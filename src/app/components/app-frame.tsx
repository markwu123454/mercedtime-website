import type { ReactNode } from "react";

// A demo's window: the extension's top bar, with the page it shows as the current tab. On a phone
// only that tab is listed, as there is no room for the rest.

const TABS = ["Find classes", "Plan", "Schedule", "Degree"] as const;

export default function AppFrame({ tab, label, children }: {
  tab: (typeof TABS)[number];
  /** What the frame shows, for screen readers. */
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="cds" role="group" aria-label={label}>
      <div className="cds-masthead" aria-hidden>
        <div className="cds-brand">MERCED<span>TIME</span></div>
        {TABS.map((t) => <div key={t} className="cds-tab" aria-current={t === tab ? "page" : undefined}>{t}</div>)}
      </div>
      {children}
    </div>
  );
}
