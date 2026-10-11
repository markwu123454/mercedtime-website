import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mercedtime.com"),
  title: "MercedTime",
  description:
    "A Chrome extension for UC Merced students: class search, schedules and degree progress in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
