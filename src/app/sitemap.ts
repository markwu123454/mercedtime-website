import type { MetadataRoute } from "next";
import { SITE } from "./seo";

// mercedtime.com/sitemap.xml: every public page. The API routes and /support (a redirect) stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
