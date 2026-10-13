import type { MetadataRoute } from "next";
import { coursePath } from "@/lib/classes";
import { loadSemesters } from "@/lib/load-classes";
import { SITE } from "./seo";

// mercedtime.com/sitemap.xml: every public page, a course page for each course in each of the
// newest fall and spring among them. The API routes and /support (a redirect) stay out. If the
// class data can't be had, the sitemap still lists the rest.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await loadSemesters()
    .then((semesters) => semesters.flatMap((c) =>
      [...new Set(c.sections.map((s) => s.course))].map((course) => coursePath(c.term, course))))
    .catch(() => []);
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    ...courses.map((path) => ({ url: `${SITE}${path}`, changeFrequency: "daily" as const, priority: 0.6 })),
    { url: `${SITE}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
