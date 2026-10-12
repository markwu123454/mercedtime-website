import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Footer from "./components/footer";
import { NAME, pageMetadata, SITE } from "./seo";
import "./globals.css";

// The extension's own wordmark font (public/fonts/bebas-neue.woff2 in the mercedtime repo).
const bebas = localFont({
  src: "../assets/fonts/bebas-neue.woff2",
  variable: "--font-bebas",
});

// The home page's, and the defaults for the rest (each page sets its own through seo.ts).
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  applicationName: NAME,
  ...pageMetadata(
    "MercedTime · Your UC Merced plan, from now to graduation",
    "A free Chrome extension for UC Merced students. Build your next schedule, plan ahead, and see what's left for your major, minor, and GEs.",
    "/",
  ),
  keywords: [
    "UC Merced", "UCM", "class schedule", "schedule builder", "course planner", "degree progress",
    "registration", "open seats", "Chrome extension",
  ],
  category: "education",
  robots: { index: true, follow: true },
};

// The navy of the footer and the home page's backdrop, for the phone's browser bar.
export const viewport: Viewport = { themeColor: "#081b33" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={bebas.variable}>
      <body className="flex min-h-screen flex-col">
        {/* flex-1 keeps the footer at the bottom of short pages like /terms */}
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
