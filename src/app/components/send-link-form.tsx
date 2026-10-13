"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { parseNetid, SEND_LINK_URL, type SendLinkEvent } from "./send-link";

// What phones and tablets get in place of Add to Chrome, since they can't install extensions: the
// student types their school email and the API (POST /v1/send-link on api.mercedtime.com,
// send-link.ts) sends them the link to open on their laptop. One status line under the button
// follows the request, its spinner turning to a check at "Sent to ..."; an error takes the
// line's place:
//   Preparing your email    until the server has checked Turnstile, the address and the limits
//   Processing your email   until Resend has taken the email
//   Sending your email      five seconds more, so the email has usually landed when it says Sent
// Turnstile loads the first time the field is touched, so only visitors who use the form load it.
//
// The field takes the part of the address before the @ (the NetID), with "@ucmerced.edu" drawn
// right after the text so it reads as the address being made. Typing the @ works too, but after
// it the field only ever holds the start of ucmerced.edu, ending at the caret:
//   maiwu@uc        the rest is drawn after it: merced.edu. A letter that doesn't come next
//                   ("maiwu@ug") is refused: the border pulses red and a line says only @ucmerced.edu works
//   maiwu@ucm|erce  moving the caret into the domain drops what's right of it: maiwu@ucm
//   maiwu|@uc       deleting the @ drops the domain typed after it: maiwu, not maiwuuc
//   jo@gmail.com    autofilled or pasted, is refused whole. It is never cut to jo@, which would
//                   send to jo@ucmerced.edu, who may be someone else.

type Turnstile = {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

type Step = "preparing" | "processing" | "sending";
/** The one status line under the button: a step in progress, then the address it went to, or an error. */
type Status = { step: Step } | { sent: string } | { error: "already-sent" | "failed"; to: string };

const STEP_LABELS: Record<Step, string> = {
  preparing: "Preparing your email",
  processing: "Processing your email",
  sending: "Sending your email",
};
const SENDING_MS = 5000;
const MIN_STEP_MS = 600; // each step stays up long enough to read, however fast the server is
const TOKEN_WAIT_MS = 60_000; // long enough to answer a Turnstile checkbox

const DOMAIN = "ucmerced.edu";
// With the domain drawn after it, the empty field reads "you@ucmerced.edu". The page calls the
// address "school email": students know the address, not the word NetID.
const PLACEHOLDER = "you";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

/**
 * What was typed, autofilled or pasted, tidied: no spaces, a UC Merced address taken out of
 * "Name <...>" or "mailto:...", and the domain lowercased to match the drawn one.
 */
function tidy(value: string) {
  const compact = value.replace(/\s+/g, "");
  const text = compact.match(/[a-z0-9._-]+@ucmerced\.edu(?![a-z0-9.-])/i)?.[0] ?? compact;
  const at = text.indexOf("@");
  return at < 0 ? text : text.slice(0, at + 1) + text.slice(at + 1).toLowerCase();
}

/** Whether all that follows the @, if there is one, is the start of ucmerced.edu: the only text the field allows. */
function fits(value: string) {
  const at = value.indexOf("@");
  return at < 0 || DOMAIN.startsWith(value.slice(at + 1));
}

/**
 * The field's text cut at the caret, if the caret sits inside the domain typed so far (a click, an
 * arrow key), or null. Cutting keeps the domain ending at the caret, so only its next letter can follow.
 */
function cutAtCaret(field: HTMLInputElement): string | null {
  const at = field.value.indexOf("@");
  const start = field.selectionStart ?? 0;
  return at >= 0 && start > at && start < field.value.length ? field.value.slice(0, start) : null;
}

/** The part of "@ucmerced.edu" not typed yet, drawn after the text. */
function ghostFor(value: string) {
  const at = value.indexOf("@");
  return at < 0 ? `@${DOMAIN}` : DOMAIN.slice(value.length - at - 1);
}

let turnstileScript: Promise<Turnstile> | null = null;

/** Cloudflare's Turnstile script, loaded once for every form on the page. */
function loadTurnstile() {
  turnstileScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("no window.turnstile")));
    script.onerror = () => {
      turnstileScript = null; // the next try loads it again
      script.remove();
      reject(new Error("Turnstile didn't load"));
    };
    document.head.append(script);
  });
  return turnstileScript;
}

/** The route's answer, one event per line, each as soon as it arrives. */
async function* readEvents(res: Response): AsyncGenerator<SendLinkEvent> {
  if (!res.ok || !res.body) throw new Error(`send-link answered ${res.status}`);
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let rest = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      if (rest.trim()) yield JSON.parse(rest) as SendLinkEvent; // a last line without its newline
      return;
    }
    const lines = (rest + value).split("\n");
    rest = lines.pop()!;
    for (const line of lines) if (line.trim()) yield JSON.parse(line) as SendLinkEvent;
  }
}

function statusText(status: Status) {
  if ("step" in status) return `${STEP_LABELS[status.step]}…`;
  if ("sent" in status) return `Sent to ${status.sent}`;
  return status.error === "already-sent"
    ? `Already sent to ${status.to} today. Check Junk if it isn’t in your inbox.`
    : "Couldn’t send it. Try again, or open mercedtime.com on your laptop.";
}

/** As tall as the text beside it and in its color: a spinner while working, then a check or a cross. */
function StatusIcon({ status }: { status: Status }) {
  if ("step" in status) {
    return <span className="size-[1em] rounded-full border-2 border-current/25 border-t-current motion-safe:animate-spin" />;
  }
  return "sent" in status ? (
    <svg viewBox="0 0 16 16" className="size-[1em]" aria-hidden>
      <path d="M2.5 8.5 6.5 12.5 13.5 3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="size-[1em]" aria-hidden>
      <path d="m3.5 3.5 9 9m0-9-9 9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** The status line's color, which its icon takes too: white while working, then green or red. */
function statusColor(status: Status | null) {
  if (!status || "step" in status) return "text-white";
  return "sent" in status ? "text-green-400" : "text-red-400";
}

export default function SendLinkForm({ siteKey, className }: { siteKey: string; className?: string }) {
  const [value, setValue] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const busy = status !== null && "step" in status;
  const hintId = useId();

  const input = useRef<HTMLInputElement>(null);
  const pill = useRef<HTMLLabelElement>(null);
  const pulse = useRef<Animation | null>(null);
  const composing = useRef<string | null>(null); // the text from before an input method started composing
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const starting = useRef(false);
  const token = useRef<string | null>(null);
  const waiting = useRef<((token: string | null) => void)[]>([]);

  const settle = (value: string | null) => {
    for (const resolve of waiting.current.splice(0)) resolve(value);
  };

  /** Puts the Turnstile widget in the form the first time it's needed. It shows only if Cloudflare wants a click. */
  async function startTurnstile() {
    if (widget.current || starting.current || !box.current) return;
    starting.current = true;
    try {
      const turnstile = await loadTurnstile();
      widget.current = turnstile.render(box.current, {
        sitekey: siteKey,
        action: "send-link",
        appearance: "interaction-only",
        theme: "dark",
        callback: (value: string) => {
          token.current = value;
          settle(value);
        },
        "expired-callback": () => {
          token.current = null;
        },
        "error-callback": () => {
          token.current = null;
          settle(null);
        },
      });
    } catch {
      settle(null);
    } finally {
      starting.current = false;
    }
  }

  /** A Turnstile token, waiting for the widget to make one if it hasn't yet; null if it can't. */
  function getToken(): Promise<string | null> {
    if (token.current) return Promise.resolve(token.current);
    const wait = new Promise<string | null>((resolve) => {
      waiting.current.push(resolve);
      setTimeout(() => resolve(null), TOKEN_WAIT_MS);
    });
    void startTurnstile();
    return wait;
  }

  /** Puts the caret at `at` once React has rewritten the field's text, which sends it to the end. */
  function caretTo(field: HTMLInputElement, at: number) {
    queueMicrotask(() => field.setSelectionRange(at, at));
  }

  /**
   * Pulses the field's border red when it refuses something (a key, a paste, an autofill). It fades
   * back to whatever ring the field has: gold while focused, none otherwise.
   */
  function pulseRed() {
    const red = "0 0 0 3px #ef4444";
    pulse.current?.cancel(); // a refusal during a pulse starts it again rather than stacking
    pulse.current =
      pill.current?.animate([{ boxShadow: red, offset: 0 }, { boxShadow: red, offset: 0.3 }], {
        duration: 600,
        easing: "ease-out",
      }) ?? null;
  }

  /**
   * Takes the field's new text if it still fits (fits()), or refuses it: the old text comes back
   * with the caret where the edit began, the domain flashes, and a line says why.
   */
  function update(field: HTMLInputElement, before = value) {
    const raw = field.value;
    const caret = field.selectionStart ?? raw.length;
    // With the @ gone (deleted or typed over), the domain typed after it goes too: "maiwu@uc"
    // losing its @ is "maiwu", not "maiwuuc".
    const lostAt = before.includes("@") && !raw.includes("@");
    const next = lostAt ? raw.slice(0, caret) : tidy(raw);
    if (fits(next)) {
      setValue(next);
      setHint(null);
      if (next !== raw) caretTo(field, lostAt ? caret : Math.max(0, caret - (raw.length - next.length)));
      return;
    }
    const added = raw.length - before.length;
    setValue(before);
    caretTo(field, Math.max(0, caret - Math.max(0, added)));
    setHint(
      added > 1
        ? `${next.slice(next.indexOf("@"))} isn’t a UC Merced address. Use your school email.`
        : `Only @${DOMAIN} addresses work.`,
    );
    pulseRed();
  }

  // Cuts the domain wherever the caret moves into it. React's onSelect misses some moves (a
  // selection the browser sets itself, iOS's press-and-drag caret); selectionchange doesn't, and
  // depending on the browser it fires at the field or at the document.
  useEffect(() => {
    const field = input.current;
    if (!field) return;
    const onSelectionChange = () => {
      if (document.activeElement !== field || composing.current !== null) return;
      const cut = cutAtCaret(field);
      if (cut !== null) setValue(cut);
    };
    field.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      field.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  useEffect(() => {
    const ref = widget;
    return () => {
      if (ref.current) window.turnstile?.remove(ref.current);
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const typed = value.split("@")[0];
    const id = parseNetid(typed);
    if (!id) {
      // The red pulse is the field's error sign. An empty field needs no words; anything else typed
      // that isn't an address gets a line.
      setHint(typed ? `That isn’t a school email. Check the part before @${DOMAIN}.` : null);
      pulseRed();
      input.current?.focus();
      return;
    }
    setHint(null);
    setStatus({ step: "preparing" });

    let shownAt = Date.now();
    /** Replaces the status line once the current one has been up long enough to read. */
    const show = async (next: Status) => {
      await sleep(MIN_STEP_MS - (Date.now() - shownAt));
      shownAt = Date.now();
      setStatus(next);
    };
    const fail = (error: "already-sent" | "failed") => show({ error, to: `${id}@${DOMAIN}` });

    let sentTo: string | null = null;
    try {
      const turnstileToken = await getToken();
      // Each token works once, so the widget starts on the next one now.
      token.current = null;
      if (widget.current) window.turnstile?.reset(widget.current);
      if (!turnstileToken) return fail("failed");

      const res = await fetch(SEND_LINK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ netid: id, token: turnstileToken }),
      });
      for await (const e of readEvents(res)) {
        if ("error" in e) return fail(e.error);
        if (e.step === "checked") {
          await show({ step: "processing" });
        } else {
          sentTo = e.to;
          await show({ step: "sending" });
        }
      }
    } catch {
      return fail("failed");
    }
    if (!sentTo) return fail("failed");
    await sleep(SENDING_MS);
    setStatus({ sent: sentTo });
  }

  return (
    <form onSubmit={submit} noValidate className={className}>
      <p className="text-sm leading-relaxed text-[#c9d4e2]">
        MercedTime runs in Chrome on a computer. Email yourself the link.
      </p>
      <label
        ref={pill}
        className="mt-4 flex h-12 cursor-text items-center overflow-hidden rounded-full bg-white px-5 text-base text-navy-deep ring-2 ring-transparent transition [color-scheme:light] focus-within:ring-gold">
        <span className="sr-only">Your school email, the part before @ucmerced.edu</span>
        {/* The hidden copy of the text sizes the grid, so the input is as wide as what's in it and the domain follows. */}
        <span className="grid min-w-0">
          <span aria-hidden className="invisible col-start-1 row-start-1 overflow-hidden pr-px whitespace-pre">
            {value || PLACEHOLDER}
          </span>
          {/* Chrome keeps a field it autofilled marked as autofilled even after the field refuses the
              fill, and forces its text to the system field color: white in dark mode, on this white
              pill. So the pill is light-scheme, and autofilled text is pinned navy on white. */}
          <input
            ref={input}
            name="netid"
            value={value}
            onChange={(e) => {
              // Text an input method (pinyin, Gboard's word in progress) is still composing is left
              // alone, then checked against the text from before it once it's done.
              if (composing.current !== null) setValue(e.target.value);
              else update(e.currentTarget);
            }}
            onCompositionStart={() => {
              composing.current = value;
            }}
            onCompositionEnd={(e) => {
              const before = composing.current ?? value;
              composing.current = null;
              update(e.currentTarget, before);
            }}
            onSelect={(e) => {
              const cut = composing.current === null ? cutAtCaret(e.currentTarget) : null;
              if (cut !== null) setValue(cut);
            }}
            onFocus={() => void startTurnstile()}
            readOnly={busy}
            placeholder={PLACEHOLDER}
            size={1}
            maxLength={100}
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            aria-describedby={hintId}
            className="col-start-1 row-start-1 w-0 min-w-full bg-transparent outline-none placeholder:text-[#8a97a8] autofill:shadow-[inset_0_0_0_1000px_#fff] autofill:[-webkit-text-fill-color:var(--color-navy-deep)]"
          />
        </span>
        <span aria-hidden className="shrink-0 whitespace-pre text-[#5b6b80]">
          {ghostFor(value)}
        </span>
      </label>
      <p id={hintId} aria-live="polite" className="mt-2 text-sm break-words text-[#f3c969] empty:hidden">
        {hint}
      </p>
      <button
        type="submit"
        disabled={busy}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold font-semibold text-navy-deep shadow-lg shadow-black/20 transition hover:brightness-110 disabled:opacity-70"
      >
        Email me the link
        <span aria-hidden>→</span>
      </button>
      <div ref={box} />
      {/* Always in the page, empty when idle, so screen readers hear each change. */}
      <p
        role="status"
        className={`mt-4 flex gap-2 text-sm leading-5 transition-colors duration-300 empty:mt-0 ${statusColor(status)}`}
      >
        {status && (
          <>
            {/* As tall as the first line, so the icon sits beside it when an error wraps. */}
            <span className="flex h-5 shrink-0 items-center">
              <StatusIcon status={status} />
            </span>
            <span>{statusText(status)}</span>
          </>
        )}
      </p>
    </form>
  );
}
