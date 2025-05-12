// Remove head.tsx completely and update layout.tsx to include metadata
// app/layout.tsx
import 'flowbite';
import 'flowbite-react';
import "@/styles/layout.css";
import "@/styles/globals.css";

import Link from "next/link";
import { Metadata } from 'next';
import { Inter } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/themeToggle';

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableColorScheme={false}
          storageKey="theme"
          enableSystem={true}
        >
          {/* ---------- Header ---------- */}
          <header className="site-header flex justify-between items-center px-4 py-3">
            <div className="flex items-center space-x-4">
              <Sidebar />
              <h1 className="site-title font-bold text-lg">
                <Link href="/">Vaishak Menon</Link>
              </h1>
            </div>
            <ThemeToggle />
          </header>

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