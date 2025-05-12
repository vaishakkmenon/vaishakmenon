import Head from 'next/head';

export default function MyHead() {
  return (
    <Head>
      <title>Vaishak Menon</title>
      <meta name="description" content="Personal website showcasing professional experience and certifications." />
      <meta property="og:title" content="Vaishak Menon" />
      <meta property="og:description" content="Personal website showcasing professional experience and certifications." />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      {/* Add any other necessary meta tags */}
    </Head>
  );
}