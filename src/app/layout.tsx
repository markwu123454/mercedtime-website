import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "./components/footer";
import "./globals.css";

// The extension's own wordmark font (public/fonts/bebas-neue.woff2 in the mercedtime repo).
const bebas = localFont({
  src: "../assets/fonts/bebas-neue.woff2",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mercedtime.com"),
  title: "MercedTime · Your UC Merced plan, from now to graduation",
  description:
    "Build your next schedule, plan ahead, and see what's left for your major, minor, and GEs.",
};

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
