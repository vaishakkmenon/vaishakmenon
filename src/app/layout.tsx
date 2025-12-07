// app/layout.tsx
import '@/styles/globals.css';
import '@/styles/layout.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import { Header, Spotlight } from '@/components';
import { StructuredData } from '@/components/StructuredData';
import { THEME } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vaishakmenon.com'),
  title: 'Vaishak Menon - Software Engineer & Kubernetes Administrator',
  description: 'Entry-level Software Engineer specializing in Python development and DevOps. Certified Kubernetes Administrator with experience in GCP, Docker, and Linux.',
  openGraph: {
    title: 'Vaishak Menon - Software Engineer & Kubernetes Administrator',
    description: 'Entry-level Software Engineer specializing in Python development and DevOps. Certified Kubernetes Administrator with experience in GCP, Docker, and Linux.',
    url: 'https://www.vaishakmenon.com',
    siteName: 'Vaishak Menon Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vaishak Menon Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaishak Menon - Software Engineer & Kubernetes Administrator',
    description: 'Entry-level Software Engineer specializing in Python development and DevOps.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function Root({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
        {/* Prevent light/dark flash before hydration */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('${THEME.STORAGE_KEY}');
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
        <div aria-hidden className="mobile-stars" />
        <div aria-hidden className="mobile-stars-2" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey={THEME.STORAGE_KEY}>
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}