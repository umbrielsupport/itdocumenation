import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Toaster } from "sonner";
import AppSessionProvider from "@/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ITDoc Hub - Multi-Organization IT Documentation Platform",
  description: "A powerful IT documentation platform similar to ITGlue and Hudu, supporting multiple organizations with separate information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppSessionProvider>
          {children}
          <Toaster position="top-right" />
        </AppSessionProvider>
      </body>
    </html>
  );
}
