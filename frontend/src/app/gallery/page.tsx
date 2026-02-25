import React from 'react';
import Gallery from '@/components/Gallery';
import SEOHead from '@/components/SEOHead';

export default function GalleryPage() {
  return (
    <>
      <SEOHead
        title="Nossos Trabalhos - Leidy Cleaner"
        description="Conheça alguns dos nossos trabalhos realizados com excelência e dedicação em limpeza residencial, comercial e especializada."
        keywords="galeria limpeza, trabalhos realizados, portfólio limpeza, antes e depois limpeza"
      />
      <Gallery />
    </>
  );
}