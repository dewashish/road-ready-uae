export function StructuredData() {
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Road Ready UAE',
    url: 'https://www.roadreadyuae.com',
    description:
      'Free UAE driving theory test practice platform for all vehicle categories including light vehicle, motorcycle, heavy truck, light bus, and heavy bus.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AED',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Driving license applicants in the UAE',
    },
    areaServed: [
      { '@type': 'Country', name: 'United Arab Emirates', alternateName: 'UAE' },
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'City', name: 'Abu Dhabi' },
      { '@type': 'City', name: 'Sharjah' },
      { '@type': 'City', name: 'Ajman' },
      { '@type': 'City', name: 'Umm Al Quwain' },
      { '@type': 'City', name: 'Ras Al Khaimah' },
      { '@type': 'City', name: 'Fujairah' },
    ],
    availableLanguage: [
      { '@type': 'Language', name: 'English', alternateName: 'en' },
      { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
      { '@type': 'Language', name: 'Urdu', alternateName: 'ur' },
      { '@type': 'Language', name: 'Hindi', alternateName: 'hi' },
      { '@type': 'Language', name: 'Bengali', alternateName: 'bn' },
      { '@type': 'Language', name: 'Malayalam', alternateName: 'ml' },
      { '@type': 'Language', name: 'Filipino', alternateName: 'tl' },
      { '@type': 'Language', name: 'Tamil', alternateName: 'ta' },
      { '@type': 'Language', name: 'Sinhala', alternateName: 'si' },
    ],
  }

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Road Ready UAE',
    url: 'https://www.roadreadyuae.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.roadreadyuae.com/en/blog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  )
}
