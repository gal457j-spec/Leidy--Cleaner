import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function SEOHead({ title, description, keywords }: SEOHeadProps) {
  const defaultTitle = "Leidy Cleaner - Limpeza Profissional";
  const defaultDescription = "Serviços de limpeza profissional para residências e empresas. Agende agora mesmo!";
  const defaultKeywords = "limpeza, limpeza profissional, diarista, faxina, limpeza residencial, limpeza comercial";

  return (
    <Head>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://leidycleaner.com" />
      <meta property="og:image" content="/leidy-logo.png" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://leidycleaner.com" />
    </Head>
  );
}
