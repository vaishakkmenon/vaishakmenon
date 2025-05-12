import "@/styles/globals.css";         // Tailwind + any global resets
import "@/styles/layout.css";          // the plain‑English CSS we wrote earlier
import 'flowbite';
import 'flowbite-react';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/themeToggle';
import { ThemeProvider } from '@/components/themeContext';


const inter = Inter({ subsets: ["latin"] });

/* -------- Site‑wide <head> metadata -------- */
export const metadata: Metadata = {
  title: "Vaishak Menon",
  description: "Personal website showcasing professional experience and certifications.",
  openGraph: {
    title: "Vaishak Menon",
    description: "Personal website showcasing professional experience and certifications.",
    type: "website",
  },
};

export default function Root({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {/* ---------- Header ---------- */}
          <header className="site-header flex justify-between items-center px-4 py-3">
            <div className="flex items-center space-x-4">
              <Sidebar />
              <h1 className="site-title font-bold text-lg">Vaishak Menon</h1>
            </div>
            <ThemeToggle />
          </header>

          {/* ---------- Main Content ---------- */}
          <main className="site-main">{children}</main>

          {/* ---------- Footer ---------- */}
          <footer className="site-footer">
            © {new Date().getFullYear()} Vaishak Menon. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}