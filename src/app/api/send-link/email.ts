// The email the "email me the link" form sends (route.ts), as HTML and as plain text.
// Email clients draw only tables and inline styles reliably, and classic Outlook draws with Word,
// so the layout is tables and the [if mso] table pins the width Outlook ignores in max-width.
// The button is the link itself, padding and all, so the whole pill can be clicked; classic
// Outlook ignores padding on links, so it gets the same pill drawn in VML ([if mso]) instead.
// Email can't load the site's Bebas Neue, so the wordmark is an image attached to the email
// (wordmark.ts); if an email app still hides it, its alt text, sized to fit its box, shows instead.
// Dark mode: apps that honor prefers-color-scheme (Apple Mail, Outlook for Mac, Thunderbird) get
// the dark-* classes below; Outlook.com and the Outlook apps mark recolored nodes with data-ogsc
// (text) and data-ogsb (backgrounds), so the same colors are pinned there too. Gmail ignores both
// and inverts on its own, so the header keeps its navy through a gradient (Gmail doesn't recolor
// background images) and the wordmark carries its own navy, so neither can wash out.

import { WORDMARK_PNG } from "./wordmark";

const SITE = "https://mercedtime.com";
const NAVY = "#0f2e53";
const NAVY_DEEP = "#081b33";
const GOLD = "#d8ac27";
const INK = "#1b1f24";
const MUTED = "#4b5563";
const RULE = "#e5e7eb";
const FONT = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const PREHEADER = "Open this on your laptop to add MercedTime to Chrome.";
const INTRO =
  "MercedTime runs in Chrome on a computer. Open this email on your laptop and add it from the Chrome Web Store.";
const FEATURES = [
  "Search classes and see open seats, times, and prerequisites at a glance",
  "See every schedule that fits your classes, and keep lunch free",
  "Watch a full class and get a notification when a seat opens",
  "Track your degree, and see what your plan would finish",
];
const WHY = "You got this because someone entered this address on mercedtime.com. If that wasn’t you, you can ignore it.";
const INDEPENDENT = "MercedTime is an independent student project, not affiliated with UC Merced.";
const FINE_LINK = "color:#6b7280;text-decoration:underline;";
const DARK = { page: "#0d1117", card: "#161b22", rule: "#30363d", ink: "#f3f4f6", muted: "#c3c9d2", fine: "#9ca3af" };

// One rule list, applied under prefers-color-scheme and again under Outlook's data-ogsc/data-ogsb.
const darkRules = (pre: string, bg: string) => `
  ${pre}.dark-page { background:${DARK.page} !important; }
  ${pre}.dark-card { background:${DARK.card} !important; border-color:${DARK.rule} !important; }
  ${pre}.dark-rule { border-color:${DARK.rule} !important; }
  ${bg}.dark-header { background:${NAVY} !important; }
  ${pre}.dark-ink { color:${DARK.ink} !important; }
  ${pre}.dark-muted { color:${DARK.muted} !important; }
  ${pre}.dark-fine, ${pre}.dark-fine a { color:${DARK.fine} !important; }
  ${pre}.dark-link { color:${GOLD} !important; }
  ${pre}.dark-gold { color:${GOLD} !important; }
  ${pre}.dark-button { background:${GOLD} !important; color:${NAVY_DEEP} !important; }`;

/** The subject, both bodies and the attached wordmark; `store` is the Chrome Web Store link the button opens. */
export function linkEmail(store: string) {
  const features = FEATURES.map(
    (f) => `
              <tr>
                <td valign="top" class="dark-gold" style="padding:0 10px 8px 0;font-family:${FONT};font-size:14px;line-height:22px;color:${GOLD};font-weight:700;">&#10003;</td>
                <td valign="top" class="dark-muted" style="padding:0 0 8px;font-family:${FONT};font-size:14px;line-height:22px;color:${MUTED};">${f}</td>
              </tr>`,
  ).join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Your MercedTime link</title>
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  @media (prefers-color-scheme: dark) {${darkRules("", "")}
  }${darkRules("[data-ogsc] ", "[data-ogsb] ")}
</style>
</head>
<body class="dark-page" style="margin:0;padding:0;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${PREHEADER}</div>
<table role="presentation" class="dark-page" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="padding:16px;">
      <!--[if mso]><table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
      <table role="presentation" class="dark-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#ffffff;border:1px solid ${RULE};border-radius:12px;">
        <tr>
          <td class="dark-header" bgcolor="${NAVY}" style="background:${NAVY};background-image:linear-gradient(${NAVY},${NAVY});border-radius:11px 11px 0 0;padding:26px 32px;">
            <a href="${SITE}" style="text-decoration:none;"><img src="cid:wordmark" width="155" height="27" alt="MERCEDTIME" style="display:block;border:0;outline:none;font-family:${FONT};font-size:17px;line-height:27px;font-weight:700;letter-spacing:1px;color:#ffffff;"></a>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 28px;">
            <h1 class="dark-ink" style="margin:0 0 12px;font-family:${FONT};font-size:22px;line-height:30px;font-weight:700;color:${INK};">Here’s your link</h1>
            <p class="dark-muted" style="margin:0 0 24px;font-family:${FONT};font-size:16px;line-height:25px;color:${MUTED};">${INTRO}</p>
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${store}" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="50%" stroke="f" fillcolor="${GOLD}">
              <w:anchorlock/>
              <center style="color:${NAVY_DEEP};font-family:'Segoe UI',Arial,sans-serif;font-size:16px;font-weight:bold;">Add to Chrome &rarr;</center>
            </v:roundrect>
            <![endif]-->
            <!--[if !mso]><!-->
            <a href="${store}" class="dark-button" style="display:inline-block;background:${GOLD};border-radius:999px;padding:14px 30px;font-family:${FONT};font-size:16px;line-height:20px;font-weight:700;color:${NAVY_DEEP};text-decoration:none;">Add to Chrome &rarr;</a>
            <!--<![endif]-->
            <p class="dark-muted" style="margin:18px 0 0;font-family:${FONT};font-size:14px;line-height:22px;color:${MUTED};">Or go to <a href="${SITE}" class="dark-link" style="color:${NAVY};text-decoration:underline;">mercedtime.com</a></p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="dark-ink dark-rule" style="border-top:1px solid ${RULE};padding-top:24px;font-family:${FONT};font-size:14px;line-height:22px;font-weight:700;color:${INK};padding-bottom:10px;">What it does</td>
              </tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">${features}
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
      <p class="dark-fine" style="max-width:520px;margin:20px auto 0;font-family:${FONT};font-size:12px;line-height:19px;color:#6b7280;text-align:center;">${WHY}<br>${INDEPENDENT}<br><a href="${SITE}/privacy" style="${FINE_LINK}">Privacy policy</a> &middot; <a href="${SITE}/terms" style="${FINE_LINK}">Terms of use</a></p>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = `Here’s your MercedTime link

${INTRO}

Add to Chrome: ${store}

Or go to ${SITE}

What it does:
${FEATURES.map((f) => `- ${f}`).join("\n")}

${WHY}
${INDEPENDENT}
Privacy policy: ${SITE}/privacy
Terms of use: ${SITE}/terms
`;

  return {
    subject: "Your MercedTime link",
    html,
    text,
    attachments: [{ filename: "mercedtime.png", content: WORDMARK_PNG, contentType: "image/png", contentId: "wordmark" }],
  };
}
