"use client";

import { Fragment, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import AppFrame from "./app-frame";

// The home page's plan showcase: like the extension's Plan board, a few semesters of an example
// student's courses, cut down to one row. Drag a card to another semester (or onto another card to
// go before it) and each semester's units add up again. With a mouse the whole card drags; on a
// touchscreen its grip does, so the page still scrolls under a finger. A focused card also moves
// with the left and right arrow keys.

type Card = { id: string; code: string; title: string; units: number; term: string };

const TERMS = ["Fall 2026", "Spring 2027", "Fall 2027"];
const CURRENT = "Fall 2026";

const START: Card[] = [
  { id: "m21", code: "MATH 021", title: "Calculus I", units: 4, term: "Fall 2026" },
  { id: "p8", code: "PHYS 008 + 008L", title: "Introductory Physics I", units: 5, term: "Fall 2026" },
  { id: "w10", code: "WRI 010", title: "College Reading and Composition", units: 4, term: "Fall 2026" },
  { id: "me1", code: "ME 001", title: "Introduction to Mechanical Engineering", units: 1, term: "Fall 2026" },
  { id: "m22", code: "MATH 022", title: "Calculus II", units: 4, term: "Spring 2027" },
  { id: "c2", code: "CHEM 002", title: "General Chemistry I", units: 4, term: "Spring 2027" },
  { id: "e57", code: "ENGR 057", title: "Statics and Dynamics", units: 4, term: "Spring 2027" },
  { id: "s10", code: "SPRK 010", title: "Cornerstone Engineering Design", units: 2, term: "Spring 2027" },
  { id: "m23", code: "MATH 023", title: "Vector Calculus", units: 4, term: "Fall 2027" },
  { id: "p9", code: "PHYS 009 + 009L", title: "Introductory Physics II", units: 5, term: "Fall 2027" },
  { id: "me21", code: "ME 021", title: "Engineering Computing", units: 4, term: "Fall 2027" },
];

/** A semester's load, as the extension warns about it: under 12 units or over 19. */
function load(units: number) {
  if (units > 19) return { text: "Over 19 units", tone: "cds-tag-full" };
  if (units > 0 && units < 12) return { text: "Under 12 units", tone: "cds-tag-low" };
  return null;
}

type Drag = { id: string; x: number; y: number; dx: number; dy: number; width: number };

export default function PlanBoard() {
  const [cards, setCards] = useState(START);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [over, setOver] = useState<{ term: string; before: string | null } | null>(null);
  const board = useRef<HTMLDivElement>(null);

  /** The semester under a point, and the card it would go before there. */
  const targetAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    const column = el?.closest<HTMLElement>("[data-term]");
    if (!column || !board.current?.contains(column)) return null;
    const below = [...column.querySelectorAll<HTMLElement>("[data-card]")]
      .find((c) => c.dataset.card !== drag?.id && c.getBoundingClientRect().top + c.offsetHeight / 2 > y);
    return { term: column.dataset.term!, before: below?.dataset.card ?? null };
  };

  const move = (id: string, term: string, before: string | null) => setCards((all) => {
    const card = all.find((c) => c.id === id)!;
    const rest = all.filter((c) => c.id !== id);
    const at = before ? rest.findIndex((c) => c.id === before) : -1;
    const moved = { ...card, term };
    return at < 0 ? [...rest, moved] : [...rest.slice(0, at), moved, ...rest.slice(at)];
  });

  // The card holds on to the pointer from the moment it is pressed (pointer capture), so every
  // move and the release come back to it however fast the drag, wherever the pointer goes.
  const start = (card: Card) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    // A finger drags by the grip only, so the page still scrolls under it elsewhere.
    if (e.pointerType !== "mouse" && !(e.target as HTMLElement).closest("[data-grip]")) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const box = e.currentTarget.getBoundingClientRect();
    setDrag({ id: card.id, x: e.clientX, y: e.clientY, dx: e.clientX - box.left, dy: e.clientY - box.top, width: box.width });
  };
  const follow = (e: ReactPointerEvent<HTMLElement>) => {
    if (!drag) return;
    setDrag({ ...drag, x: e.clientX, y: e.clientY });
    setOver(targetAt(e.clientX, e.clientY));
  };
  const drop = (e: ReactPointerEvent<HTMLElement>) => {
    if (!drag) return;
    const t = e.type === "pointerup" ? targetAt(e.clientX, e.clientY) : null;
    if (t) move(drag.id, t.term, t.before);
    setDrag(null);
    setOver(null);
  };

  const keys = (card: Card) => (e: KeyboardEvent) => {
    const i = TERMS.indexOf(card.term) + (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0);
    if (i === TERMS.indexOf(card.term) || i < 0 || i >= TERMS.length) return;
    e.preventDefault();
    move(card.id, TERMS[i], null);
    requestAnimationFrame(() => board.current?.querySelector<HTMLElement>(`[data-card="${card.id}"]`)?.focus());
  };

  const dragged = drag && cards.find((c) => c.id === drag.id);

  return (
    <AppFrame tab="Plan" label="A plan of semesters, from the MercedTime extension. Drag courses between semesters.">
      <div className="cds-toolbar" aria-hidden>
        <span className="font-semibold">Add course</span>
        <div className="cds-field flex flex-1 basis-48 items-center truncate text-sm text-[#6f6f6f]">Find a course<span className="hidden sm:inline">: ME 021, calculus, HIST…</span></div>
      </div>

      <div ref={board} className="grid h-80 grid-cols-3 sm:h-110 divide-x divide-[#e0e0e0] overflow-hidden select-none">
        {TERMS.map((term) => {
          const mine = cards.filter((c) => c.term === term);
          const units = mine.reduce((n, c) => n + c.units, 0);
          const warn = load(units);
          return (
            <div key={term} data-term={term}
              className={`flex min-w-0 flex-col transition-colors ${over?.term === term ? "bg-[#edf5ff]" : ""}`}>
              <div className={`border-b border-[#e0e0e0] border-t-[3px] px-2 py-2 sm:px-3 ${term === CURRENT ? "border-t-[#0f62fe]" : "border-t-transparent"}`}>
                <p className="truncate font-semibold">{term}</p>
                <p className="cds-label flex flex-wrap items-center gap-x-2 gap-y-1">
                  {units} units
                  {warn && <span className={`cds-tag ${warn.tone} before:hidden`}>{warn.text}</span>}
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-1.5 sm:gap-2 sm:p-2">
                {mine.map((c) => (
                  <Fragment key={c.id}>
                  {over?.term === term && over.before === c.id && <div className="-my-0.5 h-1 bg-[#0f62fe]" />}
                  <div data-card={c.id} tabIndex={0} role="button"
                    aria-label={`${c.code}, ${c.title}, ${c.units} units, in ${term}. Left and right arrows move it to another semester.`}
                    onPointerDown={start(c)} onPointerMove={follow} onPointerUp={drop} onPointerCancel={drop} onKeyDown={keys(c)}
                    className={`cursor-grab border border-[#c6c6c6] bg-white px-2 py-1.5 sm:px-2.5 ${term === CURRENT ? "border-dashed" : ""} ${drag?.id === c.id ? "opacity-30" : "hover:border-[#8d8d8d]"}`}>
                    <div className="flex items-center gap-1">
                      <span className="cds-code min-w-0 flex-1 truncate text-xs">{c.code}</span>
                      <span data-grip aria-hidden className="touch-none px-1 text-[#8d8d8d]">⠿</span>
                      <span className="hidden text-xs text-[#525252] sm:inline">{c.units} units</span>
                    </div>
                    <p className="mt-0.5 hidden truncate text-xs text-[#525252] sm:block">{c.title}</p>
                  </div>
                  </Fragment>
                ))}
                {over?.term === term && over.before === null && <div className="h-1 bg-[#0f62fe]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* the card under the pointer while it moves */}
      {drag && dragged && (
        <div className="pointer-events-none fixed z-50 border border-[#0f62fe] bg-white px-2.5 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,.3)]"
          style={{ left: drag.x - drag.dx, top: drag.y - drag.dy, width: drag.width }}>
          <span className="cds-code text-xs">{dragged.code}</span>
          <p className="mt-0.5 hidden truncate text-xs text-[#525252] sm:block">{dragged.title}</p>
        </div>
      )}
    </AppFrame>
  );
}
