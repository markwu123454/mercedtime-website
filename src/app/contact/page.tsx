/**
 * MercedTime contact — mercedtime.com/contact (and /support, which redirects here: next.config.ts)
 *
 * The address, for help, bugs and ideas, on the home page's background. The footer's Contact link
 * and the Chrome Web Store's support URL point here. Each reason opens an email with its subject
 * filled in; the extension's own buttons in Settings also add its version.
 */

import type {Metadata} from "next";
import Link from "next/link";
import Backdrop from "../components/backdrop";
import {pageMetadata} from "../seo";
import {CONTACT} from "../site";
import CopyAddress from "./copy-address";

export const metadata: Metadata = pageMetadata(
    "Contact MercedTime",
    "Email the developer of MercedTime for help, bug reports, and ideas.",
    "/contact",
);

const REASONS = [
    ["Get help", "Something isn’t working the way you expect.", "MercedTime: help"],
    ["Report a bug", "Say what you did, what happened, and the semester you were looking at.", "MercedTime: bug report"],
    ["Share an idea", "A feature you’d use, or something that could be easier.", "MercedTime: idea"],
];

const mail = (subject: string) => `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}`;

export default function ContactPage() {
    return (
        <main className="relative isolate overflow-x-clip text-white">
            <Backdrop/>
            <div className="mx-auto max-w-2xl px-6 pt-20 pb-24 md:pt-28">
                <Link href="/" className="font-display text-3xl leading-none tracking-[1px]">
                    MERCED<span className="text-gold">TIME</span>
                </Link>
                <h1 className="mt-6 font-display text-6xl leading-[.9] tracking-[1px] md:text-7xl">
                    Get in <span className="text-gold">touch</span>
                </h1>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-[#c3cfdd]">
                    Questions, bugs, and ideas all go to the developer, a UC Merced student.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/[.06] p-5 ring-1 ring-white/10 backdrop-blur-sm">
                    <div className="min-w-0">
                        <p className="text-sm text-[#9fb0c6]">Email</p>
                        <a href={`mailto:${CONTACT}`} className="text-lg font-semibold break-all hover:text-gold md:text-xl">{CONTACT}</a>
                    </div>
                    <CopyAddress address={CONTACT}/>
                </div>

                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                    {REASONS.map(([title, text, subject]) => (
                        <li key={title}>
                            <a href={mail(subject)}
                               className="flex h-full flex-col rounded-2xl bg-white/[.04] p-5 ring-1 ring-white/10 transition hover:bg-white/[.08] hover:ring-gold/40">
                                <span className="font-semibold">{title} <span aria-hidden className="text-gold">→</span></span>
                                <span className="mt-1 text-sm leading-relaxed text-[#b5c3d4]">{text}</span>
                            </a>
                        </li>
                    ))}
                </ul>

                <p className="mt-8 text-sm leading-relaxed text-[#9fb0c6]">
                    Already using MercedTime? Settings in the extension has buttons that start the email for you, with your
                    version filled in.
                </p>
            </div>
        </main>
    );
}
