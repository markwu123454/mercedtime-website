"use client";

import { useEffect, useState } from "react";
import type { Classes } from "@/lib/classes";

// One download of /api/classes for every demo on the page, started by whichever asks first.
let request: Promise<Classes> | null = null;

function load() {
  request ??= fetch("/api/classes")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .catch((e) => {
      request = null;   // let a later mount try again
      throw e;
    });
  return request;
}

/** This semester's classes, null while they download, or "error" when they can't be had. */
export function useClasses() {
  const [classes, setClasses] = useState<Classes | null | "error">(null);
  useEffect(() => {
    let live = true;
    load().then((c) => live && setClasses(c), () => live && setClasses("error"));
    return () => { live = false; };
  }, []);
  return classes;
}
