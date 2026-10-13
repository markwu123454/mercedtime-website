// Building names, as the extension shows them (the mercedtime repo's src/lib/buildings.js): the
// names students use ("COB1"), or Banner's official ones ("Classroom and Office 1 Bldg").

import type { Meeting } from "./classes";

const COMMON: Record<string, string> = {
  CLSSRM: "COB1", COB2: "COB2", ADMIN: "Admin", KOLLIG: "Library", SCIENG: "SE1", SE2: "SE2",
  ACS: "ACS", SSB: "SSB", GRAN: "Granite", GLCR: "Glacier", SSM: "SSM", SRE: "SRE", BSP: "BSP",
  REMOTE: "Remote",
};

// Banner is not consistent about codes, but its descriptions are stable.
const BY_NAME: [RegExp, string][] = [
  [/remote/i, "Remote"], [/administration|^admin\b/i, "Admin"], [/classroom and office 1/i, "COB1"],
  [/classroom and office 2/i, "COB2"], [/library/i, "Library"], [/science and engineering 1/i, "SE1"],
  [/science and engineering 2/i, "SE2"], [/arts\s*(&|and)\s*computational/i, "ACS"], [/student services/i, "SSB"],
  [/granite/i, "Granite"], [/glacier/i, "Glacier"], [/social sciences/i, "SSM"],
  [/sustainability research/i, "SRE"], [/biomedical/i, "BSP"],
];

export type Scheme = "common" | "official";

export function buildingName(m: Meeting, scheme: Scheme = "common") {
  if (scheme === "official") return m.buildingName || m.building;
  return COMMON[m.building] ?? BY_NAME.find(([re]) => re.test(m.buildingName))?.[1] ?? (m.buildingName || m.building);
}

/** "COB2, Room 170", "Rm" when that runs long, as the extension's calendar writes it. */
export function locationLabel(m: Meeting, scheme: Scheme = "common") {
  const name = buildingName(m, scheme);
  if (!m.room || /remote/i.test(name)) return name;
  if (!name) return `Room ${m.room}`;
  const full = `${name}, Room ${m.room}`;
  return full.length > 18 ? `${name}, Rm ${m.room}` : full;
}
