import { loadClasses } from "@/lib/load-classes";

// GET /api/classes, behind the home page's class search and schedule demos: this semester's
// classes as src/lib/load-classes.ts reads them.

export async function GET() {
  try {
    return Response.json(await loadClasses(), {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
