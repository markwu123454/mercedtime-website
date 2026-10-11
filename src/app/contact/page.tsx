/**
 * MercedTime contact — mercedtime.com/contact (and /support, which redirects here: next.config.ts)
 *
 * Just the address, for help, bugs and ideas. The footer's Contact link and the Chrome Web Store's
 * support URL point here. Styling is in globals.css.
 */

import type {Metadata} from "next";
import {CONTACT} from "../site";

export const metadata: Metadata = {
    title: "Contact MercedTime",
    description: "Email the developer of MercedTime for help, bug reports and ideas.",
    alternates: {canonical: "/contact"},
};

export default function ContactPage() {
    return (
        <main className="doc">
            <div className="brand">
                Merced<span>Time</span>
            </div>
            <h1>Contact</h1>
            <p className="text-xl break-all">
                <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
            </p>
        </main>
    );
}
