import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { TRPCReactQueryProvider } from "@/app/components/providers/trpc-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wines",
  description: "Wines App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCReactQueryProvider>{children}</TRPCReactQueryProvider>
      </body>
    </html>
  );
}
