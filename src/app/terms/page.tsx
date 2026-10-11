/**
 * MercedTime terms of use — mercedtime.com/terms
 *
 * Public at this URL, beside /privacy; the old address, markwu.org/mercedtime/terms,
 * redirects here. Styling is in globals.css. The text mirrors docs/terms.md in the
 * mercedtime repo; change both together.
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
            <p className="updated">Last updated October 10, 2026</p>

            <p>
                MercedTime is provided as is, without warranty of any kind. It is an independent student project, not
                affiliated with UC Merced. You use it at your own risk, and you are responsible for your own registration:
                always confirm your classes in UCM Registration.
            </p>
            <p>
                <a href="/privacy">Privacy policy</a>
            </p>
        </main>
    );
}
