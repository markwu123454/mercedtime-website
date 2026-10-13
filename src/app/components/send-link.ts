// What the "email me the link" form (send-link-form.tsx) needs from the API that sends the email:
// POST /v1/send-link on api.mercedtime.com (the mercedtime-api repo's src/lib/send-link.ts, which
// has the same SendLinkEvent and parseNetid; change them together).

/** Where the form posts. NEXT_PUBLIC_API_URL points it at a local API in development
 *  ("http://localhost:3001"); the API's Turnstile secret must match the widget's site key. */
export const SEND_LINK_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "https://api.mercedtime.com"}/v1/send-link`;

/**
 * One line of the route's answer, which streams one JSON event per line as the work gets done:
 * `checked` once the address, Turnstile and the limits pass, `sent` once Resend takes the email.
 * `already-sent` is that address having had the link in the last day; `failed` is anything else.
 */
export type SendLinkEvent = { step: "checked" } | { step: "sent"; to: string } | { error: "already-sent" | "failed" };

/**
 * The NetID in what the student typed, or null if there isn't one. A whole @ucmerced.edu address
 * works too, but no other address: "jo@gmail.com" must not turn into jo@ucmerced.edu.
 */
export function parseNetid(input: string): string | null {
  const netid = input.trim().toLowerCase().replace(/@ucmerced\.edu$/, "");
  return /^[a-z0-9][a-z0-9._-]{0,63}$/.test(netid) ? netid : null;
}
