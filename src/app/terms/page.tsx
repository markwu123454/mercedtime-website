/**
 * MercedTime terms of use — mercedtime.com/terms
 *
 * Public at this URL, beside /privacy; the old address, markwu.org/mercedtime/terms,
 * redirects here. Styling is in globals.css. This page is the terms: the mercedtime repo keeps
 * no copy of them.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MercedTime terms of use',
    description: 'The terms for using the MercedTime Chrome extension.',
    alternates: { canonical: '/terms' },
};

export default function MercedTimeTermsPage() {
    return (
        <main className="doc">
            <div className="brand">Merced<span>Time</span></div>
            <h1>Terms of use</h1>
            <p className="updated">Last updated October 12, 2026</p>

            <p>
                MercedTime is provided as is, without warranty of any kind. It is an independent student project, not
                affiliated with UC Merced. You use it at your own risk, and you are responsible for your own registration:
                always confirm your classes in UCM Registration.
            </p>

            <h2>Class and degree information</h2>
            <p>
                Classes and open seats come from UCM Registration’s public class search, copied by MercedTime’s server
                (api.mercedtime.com), and can be behind it: open seats by a few minutes, the list of classes by up to a
                day, and which courses must be taken together by up to a month. The degree requirements are transcribed from the UC Merced General Catalog and may contain mistakes.
                UCM Registration, My Degree Path and your advisor have the final word on what you can take and what you
                need to graduate.
            </p>

            <h2>Availability</h2>
            <p>
                MercedTime and its server may change, be unavailable, or stop at any time. When the server does not
                answer, the extension reads classes and seats from UCM Registration directly.
            </p>

            <h2>Fair use</h2>
            <p>
                MercedTime’s server is there for the extension. Don’t use it, or the extension, in ways that put unusual
                load on UC Merced’s systems, such as automated bulk requests.
            </p>

            <h2>Changes</h2>
            <p>
                These terms may change; the date above says when they last did. Using MercedTime after a change means you
                accept the new terms.
            </p>

            <p>
                <a href="/privacy">Privacy policy</a>
            </p>
        </main>
    );
}
