import React from 'react';
import FavoritesPage from '@/pages/FavoritesPage';
import SEOHead from '@/components/SEOHead';

export default function Favorites() {
  return (
    <>
      <SEOHead
        title="Meus Favoritos - Leidy Cleaner"
        description="Gerencie seus serviços e profissionais favoritos para agendar mais rapidamente."
        keywords="favoritos limpeza, serviços salvos, profissionais favoritos"
      />
      <FavoritesPage />
    </>
  );
}