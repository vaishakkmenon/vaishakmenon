import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// 1 – load Inter (regular Latin subset)
const inter = Inter({ subsets: ['latin'] });

// 2 – export site‑wide metadata
export const metadata: Metadata = {
  title: 'Vaishak Menon',
  description: 'Showcasing professional experience, resume and certifications.',
  openGraph: {
    title: 'Vaishak Menon',
    description: 'Showcasing professional experience, resume and certifications.',
    type: 'website',
  },
};

// 3 – root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ----------  Header  ---------- */}
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">Vaishak Menon</h1>
          </div>
        </header>

        {/* ----------  Main content  ---------- */}
        <main className="container mx-auto px-4 py-8">{children}</main>

        {/* ----------  Footer  ---------- */}
        <footer className="bg-gray-100 mt-8">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Vaishak Menon. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}