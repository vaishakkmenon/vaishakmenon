// app/head.tsx
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Vaishak Menon",
  description: "Personal website showcasing professional experience and certifications.",
  openGraph: {
    title: "Vaishak Menon",
    description: "Personal website showcasing professional experience and certifications.",
    type: "website",
  },
};

export default function Head() {
  return (
    <>
      {/* Default metadata tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Inject theme class early to avoid hydration mismatch */}
      <Script
        id="theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var t = localStorage.getItem('theme');
                if (t==='dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `
        }}
      />
    </>
  );
}