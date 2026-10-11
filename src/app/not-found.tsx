import type { Metadata } from "next";
import Link from "next/link";

// The 404 page, for every address the site doesn't have (and any notFound() call). Next sends it
// with a 404 status and tells search engines not to index it.

export const metadata: Metadata = {
  title: "Page not found · MercedTime",
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <p aria-hidden className="font-display text-[clamp(120px,24vw,220px)] leading-[.8] tracking-wide text-accent">
        40<span className="text-gold">4</span>
      </p>
      <div className="mt-8 mb-6 h-1 w-16 bg-gold" />
      <h1 className="text-2xl font-bold md:text-3xl">This page doesn’t exist.</h1>
      <p className="mt-2 leading-relaxed text-muted">The link may be old, or the address mistyped.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-navy-deep shadow-lg shadow-black/20 transition hover:brightness-110"
      >
        Go to the home page
        <span aria-hidden>→</span>
      </Link>
    </main>
  );
}
