'use client';

export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: 'Têtes Brûlées',
    description: 'Club de parapente et speedriding basé à Valfréjus en Savoie',
    url: 'https://tetes-brulees.vercel.app',
    logo: 'https://tetes-brulees.vercel.app/og-image.png',
    image: 'https://tetes-brulees.vercel.app/og-image.png',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Valfréjus',
      addressRegion: 'Savoie',
      addressCountry: 'FR',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Valfréjus, Savoie, France',
    },
    sport: ['Paragliding', 'Speedflying'],
    sameAs: [
      'https://www.instagram.com/tetesbrulees/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'French',
    },
    founder: {
      '@type': 'Organization',
      name: 'Têtes Brûlées',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}