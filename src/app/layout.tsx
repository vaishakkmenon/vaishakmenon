// Remove head.tsx completely and update layout.tsx to include metadata
// app/layout.tsx
import 'flowbite';
import 'flowbite-react';
import "@/styles/layout.css";
import "@/styles/globals.css";

import { Metadata } from 'next';
import { Header } from "./header";
import { Inter } from "next/font/google";
import { ThemeProvider } from 'next-themes';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaishak Menon",
  description: "Personal website showcasing professional experience and certifications.",
  openGraph: {
    title: "Vaishak Menon",
    description: "Personal website showcasing professional experience and certifications.",
    type: "website",
  },
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body suppressHydrationWarning className={`${inter.className} flex flex-col h-full overflow-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableColorScheme={false}
          storageKey="theme"
          enableSystem={true}
        >
          {/* ---------- Header ---------- */}
          <Header />

          {/* ---------- Main Content ---------- */}
          <main className="site-main flex-grow px-4 py-6">
            {children}
          </main>

          {/* ---------- Footer ---------- */}
          <footer className="site-footer px-4 py-3 text-center">
            © {new Date().getFullYear()} Vaishak Menon. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}