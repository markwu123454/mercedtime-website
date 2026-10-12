/**
 * MercedTime privacy policy — mercedtime.com/privacy
 *
 * Linked from the Chrome Web Store listing and the extension's first-run
 * disclosure, so it must stay public at this URL. The old address,
 * markwu.org/mercedtime/privacy, redirects here. Styling is in globals.css.
 * This page is the policy: the mercedtime repo keeps no copy of it. When the extension starts
 * handling data differently, change this page, its in-app disclosure (src/pages/Disclosure.jsx
 * there) and the store listing's privacy answers (store-assets/listing.md) together.
 */

import type { Metadata } from 'next';
import { pageMetadata } from '../seo';

export const metadata: Metadata = pageMetadata(
    'MercedTime privacy policy',
    'What the MercedTime Chrome extension reads, what it stores, and what it shares.',
    '/privacy',
);

const CONTACT = 'mark.wu123454@gmail.com';

export default function MercedTimePrivacyPage() {
    return (
        <main className="doc">
            <div className="brand">Merced<span>Time</span></div>
            <h1>Privacy policy</h1>
            <p className="updated">Last updated October 12, 2026 (version 1.1.1)</p>

            <p>
                MercedTime is a Chrome extension for UC Merced students. It is an independent student project and is not
                affiliated with the University of California, Merced.
            </p>

            <h2>What the extension does with data</h2>
            <p>
                The extension reads pages and data from UCM Registration (reg-prod.ec.ucmerced.edu) and My Degree Path (ucmerced.uachieve.com) using the sign-in you already have in your browser, and shows it to you in its own
                page. It reads your registrations, registration status, and degree audit.
            </p>
            <p>
                Each semester’s classes, their open seats, which courses must be taken together (corequisites, such as a
                course and its lab), and the degree requirements for the Roadmap come from MercedTime’s server
                (api.mercedtime.com). The server copies the classes, seats, and corequisites from UCM Registration’s
                public class search, the part anyone can see without signing in. When the server does not answer, the
                extension reads classes and seats from UCM Registration instead.
            </p>
            <p>MercedTime never sees or stores your password. Sign-in happens on the university’s own pages.</p>

            <h2>Data types handled</h2>
            <ul>
                <li>
                    Personal academic information: your registrations, registration status, degree audit, and course
                    history, read from UCM Registration and My Degree Path.
                </li>
                <li>
                    Website content: the pages and data returned by reg-prod.ec.ucmerced.edu and ucmerced.uachieve.com, and
                    the classes, seats, and degree requirements from api.mercedtime.com.
                </li>
                <li>
                    Page addresses: the extension sees when the browser opens UCM Registration’s menu page or returns from its sign-in, so it can open MercedTime. Addresses are not saved.
                </li>
                <li>
                    Your programs: the names of your majors and minors, read from UCM Registration and matched on your
                    computer to choose which degree requirements to download. The names are not sent anywhere (see “What
                    is shared”).
                </li>
            </ul>
            <p>
                The extension shows a disclosure and asks for your agreement the first time it opens. It reads nothing
                from UCM Registration or My Degree Path before you agree.
            </p>

            <h2>Notifications</h2>
            <p>
                MercedTime can notify you when a new semester is posted, a day before and when your
                registration time opens, and when a course you watch fills up or gets an open seat. To do this it
                checks UCM Registration’s public list of semesters every two hours while Chrome is
                running, even when MercedTime isn’t open. For each semester with a course you watch, it also
                asks MercedTime’s server for that semester’s open seats: every two hours, and every ten minutes
                while your registration window is open. That request names only the semester. If the server
                does not answer, it asks UCM Registration how many seats each of the course’s sections has
                instead; those requests carry only the semester and the sections’ numbers (CRNs). None of
                these requests send your cookies or anything about you. Registration reminders are worked out
                on your computer from the registration time MercedTime last read. You can choose which
                notifications you get, or turn them all off, in Settings.
            </p>

            <h2>What is stored</h2>
            <p>
                Your plan and settings, including the courses you watch for open seats, are saved in Chrome’s sync storage
                for the extension. If you are signed in to Chrome with sync turned on, Chrome copies them to your other
                computers through your Google account, the same way it syncs your bookmarks. They go to Google as part of
                Chrome sync, never to the developer. Without Chrome sync they stay on your computer.
            </p>
            <p>The following is saved in your browser’s extension storage on your computer only:</p>
            <ul>
                <li>downloaded course catalogs</li>
                <li>the latest degree audit and course history the extension read</li>
                <li>
                    your latest registrations and registration status, so your schedule still shows when your UCM Registration sign-in has ended
                </li>
                <li>the degree requirements downloaded for the Roadmap</li>
                <li>the list of semesters seen on UCM Registration, and which reminders have already been shown, so none shows twice</li>
                <li>the seats last seen in each course you watch, so you are notified only when they change</li>
                <li>
                    a short log of your last few sign-ins: the addresses of the pages they went through (without anything
                    after the “?”) and whether each check found you signed in, to help fix sign-in problems
                </li>
            </ul>

            <h2>What is shared</h2>
            <p>
                Two things about you leave your computer: the plan and settings Chrome sync carries for you, as described
                above, and which programs’ degree requirements you download, as described below. Nothing else about you is
                sent to the developer or to any third party. The extension has no analytics, no advertising, and no
                tracking.
            </p>
            <p>
                MercedTime’s server (api.mercedtime.com) is run by the developer. It is hosted by Vercel (vercel.com), and
                its data is kept in a database on Neon (neon.tech). The extension asks it for:
            </p>
            <ul>
                <li>a semester’s classes and open seats: the request names only the semester;</li>
                <li>which courses are corequisites, for every course at once: the request carries nothing;</li>
                <li>the list of all degree requirements: the request carries nothing;</li>
                <li>
                    the requirements for your programs and for General Education: the Degree page’s Roadmap and the Plan
                    board need them. Your majors and minors are matched against the list on your computer, and only the
                    matching requirements are requested, so the server can tell which programs’ requirements were asked
                    for, but not by whom. The names themselves are never sent.
                </li>
            </ul>
            <p>
                No request to the server carries your cookies, name, student ID, courses, or grades. Like any web request,
                they reveal your IP address to Vercel; MercedTime’s database does not store it. The server stores nothing
                about you: only the degree requirements, and the public class lists, seat counts, and corequisites it reads
                from UCM Registration. The Roadmap is
                worked out on your computer. Data is not sold, not transferred, and not used for anything other than
                showing it to you in the extension.
            </p>
            <p>
                Versions of the extension before 1.1.1 worked differently in two ways. They sent the names of your majors
                and minors as UCM Registration lists them (for example, “Mechanical Engineering”) to the developer’s
                requirements database on Neon, to choose which requirements to download; nothing else about you went with
                them. And they read classes and seats from UCM Registration only.
            </p>

            <h2>Limited Use disclosure</h2>
            <p>
                The use of information received from UCM Registration and My Degree Path will adhere to the Chrome Web Store User Data
                Policy, including the Limited Use requirements. The data is used only to provide the extension’s single
                purpose of showing you your catalog, schedule, plan, and degree audit. It is not transferred to others,
                except where required by law. It is not used for advertising. No person reads it. Which programs’ degree
                requirements you need is revealed to MercedTime’s server only to download those requirements. Your
                registrations, degree audit, course history, and the names of your programs never leave your computer.
            </p>

            <h2>Removing your data</h2>
            <p>
                Removing the extension from Chrome deletes the data saved on your computer. To delete the plan and settings
                kept by Chrome sync, use Chrome’s own option to clear synced data. MercedTime’s server keeps nothing about
                you, so there is nothing of yours there to delete. The data in UCM Registration and My Degree Path is not changed by the extension, except that “Rerun audit” asks My Degree Path to run an audit, the same as pressing
                its own button.
            </p>

            <h2>The mercedtime.com website</h2>
            <p>
                The website has no analytics, advertising, or tracking. On a phone or tablet, which can’t install the
                extension, it offers to email you the link so you can open it on your laptop. If you use that form:
            </p>
            <ul>
                <li>The UC Merced address you enter is sent to Resend (resend.com), which delivers the email.</li>
                <li>
                    Cloudflare Turnstile checks that you’re not a bot. It loads only when you use the form, runs in your
                    browser, and sends Cloudflare information about your browser and device.
                </li>
                <li>
                    To limit how many emails go out, the developer’s database on Neon keeps a scrambled code made from your
                    address, another made from your IP address, and the time. The codes can’t be turned back into your
                    address or IP. After a day they are no longer used, and they are deleted the next time anyone uses the
                    form.
                </li>
            </ul>
            <p>Your address is used only to send that one email. It is not added to any list.</p>

            <h2>Terms</h2>
            <p>
                Using MercedTime is also subject to its <a href="/terms">terms of use</a>.
            </p>

            <h2>Contact</h2>
            <p>
                <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
            </p>
            <p>
                The bug report and feature request buttons in Settings open an email in your own email app, addressed to
                the developer. Nothing is sent unless you send that email yourself. It includes the extension and Chrome
                version and the semester you were viewing, which you can see and edit before sending.
            </p>
        </main>
    );
}