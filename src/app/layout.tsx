import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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

export default function Root({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ---------- Header ---------- */}
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">Your Name</h1>
          </div>
        </header>

        {/* ---------- Main ---------- */}
        <main className="container mx-auto px-4 py-8">{children}</main>

        {/* ---------- Footer ---------- */}
        <footer className="bg-gray-100 mt-8">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Your Name. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
