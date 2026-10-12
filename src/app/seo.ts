import type { Metadata } from "next";

// What search engines and link previews (iMessage, Discord, Slack, X) show for each page. Next
// replaces a parent's openGraph and twitter objects whole rather than merging them, so every page
// builds its own here, and they all carry the same picture: the extension's small promo tile
// (store-assets/promo-small-440x280.png in the mercedtime repo, copied to public/og.png).

export const SITE = "https://mercedtime.com";
export const NAME = "MercedTime";

const IMAGE = { url: "/og.png", width: 440, height: 280, alt: "MercedTime: your UC Merced plan, from now to graduation" };

/** A page's title, description and canonical path, with its link previews to match. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: NAME,
      locale: "en_US",
      url: path,
      title,
      description,
      images: [IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [IMAGE] },
  };
}
