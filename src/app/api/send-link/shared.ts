// What the "email me the link" form (components/send-link-form.tsx) and POST /api/send-link
// (route.ts) both need.

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
