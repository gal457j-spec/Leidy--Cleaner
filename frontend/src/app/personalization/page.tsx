import React from 'react';
import PersonalizationPage from '@/pages/PersonalizationPage';
import SEOHead from '@/components/SEOHead';

// Força renderização no cliente para evitar problemas com SSR
export const dynamic = 'force-dynamic';

export default function Personalization() {
  return (
    <>
      <SEOHead
        title="Personalização - Leidy Cleaner"
        description="Personalize sua experiência no Leidy Cleaner com temas, cores, conquistas e muito mais."
        keywords="personalização, temas, cores, conquistas, perfil personalizado"
      />
      <PersonalizationPage />
    </>
  );
}