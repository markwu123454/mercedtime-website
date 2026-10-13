"use client";

import { useState } from "react";

/** Copies the address, for anyone whose browser has no mail app to open. */
export default function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => navigator.clipboard.writeText(address).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })}
      className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/10"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
