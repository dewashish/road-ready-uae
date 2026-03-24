export function StructuredData() {
  const jsonLd = {
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
    availableLanguage: {
      '@type': 'Language',
      name: 'English',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
