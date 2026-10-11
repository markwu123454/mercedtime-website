import { createHmac } from "node:crypto";
import { Resend } from "resend";
import { storeUrl } from "@/app/site";
import { linkEmail } from "./email";
import { releaseSend, reserveSend } from "./limits";
import { parseNetid, type SendLinkEvent } from "./shared";

// POST /api/send-link, behind the "email me the link" form: phones can't install Chrome
// extensions, so a student enters their NetID and gets the link to open on their laptop. Only
// @ucmerced.edu addresses, a Turnstile check and the limits in limits.ts keep it from being used
// to email anyone else.
//
// The body is JSON, { netid, token }, the token being the Turnstile widget's. The answer streams
// one SendLinkEvent per line (shared.ts) as each stage finishes, for the form's progress log.

// Exactly @mercedtime.com: the domain's DMARC asks for strict alignment, so a subdomain fails.
const FROM = "MercedTime <hello@mercedtime.com>";

// The widget must say this action, and the token must come from one of these hosts. localhost
// may be on the widget's domain list for development, so in production a token made there is
// refused. Development also takes Cloudflare's test keys, whose answers name neither.
const TURNSTILE_ACTION = "send-link";
const PRODUCTION = process.env.NODE_ENV === "production";
const TURNSTILE_HOSTS = PRODUCTION ? ["mercedtime.com", "www.mercedtime.com"] : ["localhost", "127.0.0.1"];

/** A keyed hash, so the database never holds an address or IP that could be read back. */
const hash = (value: string) => createHmac("sha256", process.env.HASH_SECRET!).update(value).digest("hex");

/** Whether Cloudflare accepts the Turnstile token the form carried. Each token works once; any error is a no. */
async function isHuman(token: unknown, ip: string | null) {
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET!, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;
    const result = (await res.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
      metadata?: { result_with_testing_key?: boolean };
    };
    if (result.success !== true) return false;
    if (!PRODUCTION && result.metadata?.result_with_testing_key) return true;
    return result.action === TURNSTILE_ACTION && TURNSTILE_HOSTS.includes(result.hostname ?? "");
  } catch {
    return false;
  }
}

/** The stages of one request, as the events the form shows. */
async function* sendLink(body: { netid?: unknown; token?: unknown } | null, ip: string | null): AsyncGenerator<SendLinkEvent> {
  const netid = typeof body?.netid === "string" ? parseNetid(body.netid) : null;
  if (!netid || !(await isHuman(body?.token, ip))) {
    yield { error: "failed" };
    return;
  }
  const to = `${netid}@ucmerced.edu`;

  const reserved = await reserveSend(hash(to), hash(ip ?? "unknown"));
  if ("limit" in reserved) {
    yield { error: reserved.limit === "recipient" ? "already-sent" : "failed" };
    return;
  }
  yield { step: "checked" };

  const resend = new Resend(process.env.RESEND_API);
  const { error } = await resend.emails
    .send({ from: FROM, to, ...linkEmail(storeUrl("mercedtime-website-email")) })
    .catch((err: unknown) => ({ error: err }));
  if (error) {
    console.error("send-link: the email didn't go out", error);
    await releaseSend(reserved.id);
    yield { error: "failed" };
    return;
  }
  yield { step: "sent", to };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  // Vercel sets x-forwarded-for itself, so its first address is the visitor's and can't be faked.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || null;

  const encoder = new TextEncoder();
  const line = (event: SendLinkEvent) => encoder.encode(JSON.stringify(event) + "\n");
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of sendLink(body, ip)) controller.enqueue(line(event));
      } catch (err) {
        console.error("send-link:", err);
        controller.enqueue(line({ error: "failed" }));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
