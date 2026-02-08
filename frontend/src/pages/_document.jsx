import Document, { Html, Head, Main, NextScript } from 'next/document'

function parseCookies(cookieHeader) {
  const result = {};
  if (!cookieHeader) return result;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [k, ...v] = part.split('=');
    if (!k) continue;
    result[k.trim()] = decodeURIComponent((v || []).join('=').trim());
  }
  return result;
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // Ler cookie do request para aplicar tema no SSR
    const req = ctx?.req;
    const cookies = req ? parseCookies(req.headers?.cookie || '') : {};
    const theme = cookies['vamos_theme'] || null;

    return {
      ...initialProps,
      theme
    };
  }

  render() {
    const theme = this.props.theme;
    const htmlProps = {};
    if (theme) htmlProps['data-theme'] = theme;

    return (
      <Html lang="pt-BR" {...htmlProps}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="description" content="Leidy Cleaner - Serviços de limpeza profissional em Porto Alegre. Agende online e receba atendimento rápido e confiável." />
          <meta name="theme-color" content="#0f172a" />
          {/* Favicon baseado na imagem da marca */}
          <link rel="icon" href="/icon-brand.jpg" type="image/jpeg" />
          <link rel="apple-touch-icon" href="/icon-brand.jpg" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
