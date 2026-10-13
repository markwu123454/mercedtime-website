import {storeUrl, type StoreSource} from "../site";

/** The gold Add to Chrome button, its link tagged with where on the site it is (site.ts). */
export default function StoreButton({source}: { source: StoreSource }) {
    return (
        <a
            href={storeUrl(source)}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-navy-deep shadow-lg shadow-black/20 transition hover:brightness-110"
        >
            Add to Chrome
            <span aria-hidden>→</span>
        </a>
    );
}
