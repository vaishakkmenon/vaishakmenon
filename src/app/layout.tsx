// app/layout.tsx
import "@/styles/globals.css";
import "@/styles/layout.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { Header } from "@/components/Header";
import Spotlight from "@/components/Spotlight";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaishak Menon",
  description: "Personal website showcasing professional experience and certifications.",
  openGraph: { title: "Vaishak Menon", description: "Personal website...", type: "website" },
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent light/dark flash before hydration */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                var d = t==='dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (d) document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-dvh`}>
        <div aria-hidden className="bg-shell" />
        <Spotlight />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}