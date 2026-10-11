import Link from "next/link";
import { CONTACT, storeUrl } from "../site";

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-[#9fb0c6]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="font-display text-3xl leading-none tracking-wide text-white">
            MERCED<span className="text-gold">TIME</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed">
            An independent student project. Not made by, affiliated with or endorsed by the University of California,
            Merced.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          <a href={storeUrl("mercedtime-website-footer")} className="hover:text-white">Chrome Web Store</a>
          <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
          <a href={`mailto:${CONTACT}`} className="hover:text-white">Contact</a>
          <Link href="/terms" className="hover:text-white">Terms of use</Link>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs">© 2026 MercedTime</p>
      </div>
    </footer>
  );
}
