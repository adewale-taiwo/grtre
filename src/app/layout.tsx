import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Netcore Job Log Formatter",
  description:
    "A simple tool that converts job logs into Excel format. Easily input your logs, specify separators, and format them for clear, structured reporting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark antialiased">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
