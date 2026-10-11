// Links shared by the home page and the footer.

// Each link to the Web Store gets its own utm_source, so the store's traffic report shows which
// button an install came from (markwu.org uses portfolio-website-project and portfolio-quick-redirect).
export type StoreSource = "mercedtime-website-hero" | "mercedtime-website-bottom" | "mercedtime-website-footer";

export function storeUrl(source: StoreSource) {
  return `https://chromewebstore.google.com/detail/hjppipajfmgbkocbjejafmmdommjbnpg?utm_source=${source}`;
}

export const CONTACT = "mark.wu123454@gmail.com";
