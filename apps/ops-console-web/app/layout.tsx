import type { Metadata } from "next";

import { OpsNav } from "../components/ops-nav";
import { Providers } from "../components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expert Portal Ops Console",
  description: "Operations and compliance surface for Expert Portal MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="fixed inset-x-0 top-0 z-20 mx-auto mt-4 max-w-7xl px-5 md:px-8">
            <div className="rounded-full border border-slate-200 bg-white/90 p-2 shadow-xl backdrop-blur">
              <OpsNav currentPath="/" />
            </div>
          </div>
          <div className="pt-24">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
