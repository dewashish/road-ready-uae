import type { Metadata } from 'next'

const VEHICLE_SEO: Record<string, { title: string; description: string }> = {
  B: {
    title: 'Light Vehicle Theory Test – Cars & SUVs',
    description:
      'Practice UAE light vehicle driving theory test questions. Covers cars, SUVs & vehicles up to 3,500 kg. Aligned with RTA exam format.',
  },
  A: {
    title: 'Motorcycle Theory Test – Two-Wheeler License',
    description:
      'Free UAE motorcycle theory test practice. Prepare for your two-wheeler driving license exam with real-style questions.',
  },
  C: {
    title: 'Heavy Truck Theory Test – Commercial Vehicles',
    description:
      'UAE heavy truck driving theory test practice. Questions for commercial trucks and lorries over 3,500 kg.',
  },
  D: {
    title: 'Light Bus Theory Test – Minibus License',
    description:
      'Practice for your UAE light bus theory test. Covers minibuses and coaches up to 26 passengers.',
  },
  E: {
    title: 'Heavy Bus Theory Test – Large Passenger Bus',
    description:
      'UAE heavy bus driving theory test practice. Prepare for large passenger bus license exam with 26+ seat vehicle questions.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vehicleType: string }>
}): Promise<Metadata> {
  const { vehicleType } = await params
  const seo = VEHICLE_SEO[vehicleType]

  if (!seo) {
    return { title: 'Quiz' }
  }

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/quiz/${vehicleType}` },
  }
}

export default function QuizVehicleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
