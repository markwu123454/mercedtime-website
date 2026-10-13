import type { MetadataRoute } from "next";
import { SITE } from "./seo";

// mercedtime.com/robots.txt: every page may be crawled except the API (the demos' class data and
// the "email me the link" form).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
