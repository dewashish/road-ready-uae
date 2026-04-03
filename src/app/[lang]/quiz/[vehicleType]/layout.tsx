import type { Metadata } from 'next'

const VEHICLE_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  B: {
    title: 'Free RTA Light Vehicle Theory Test 2026 – Cars & SUVs Mock Exam',
    description:
      'Free online UAE light vehicle driving theory test practice. 1,200+ real RTA exam questions for cars & SUVs. Mock exams aligned with Dubai, Abu Dhabi & Sharjah test format.',
    keywords: [
      'RTA light vehicle theory test', 'UAE car driving test 2026', 'free RTA mock test online',
      'Dubai driving theory test practice', 'light vehicle theory test questions',
      'Abu Dhabi car theory test', 'Sharjah driving test practice',
    ],
  },
  A: {
    title: 'Free UAE Motorcycle Theory Test 2026 – Two-Wheeler Mock Exam',
    description:
      'Free UAE motorcycle theory test practice. Prepare for your two-wheeler RTA driving license exam with real-style mock questions for Dubai, Abu Dhabi & all emirates.',
    keywords: [
      'motorcycle theory test UAE', 'bike driving test Dubai 2026', 'free motorcycle mock test UAE',
      'two-wheeler license test practice', 'RTA motorcycle theory test questions',
      'Abu Dhabi motorcycle test', 'UAE bike license test online',
    ],
  },
  C: {
    title: 'Free UAE Heavy Truck Theory Test 2026 – Commercial Vehicle Mock Exam',
    description:
      'Free UAE heavy truck driving theory test practice. Mock exam questions for commercial trucks & lorries over 3,500 kg. Aligned with RTA exam format for all emirates.',
    keywords: [
      'heavy truck theory test UAE', 'commercial vehicle driving test Dubai 2026',
      'free truck mock test online', 'RTA heavy vehicle theory test',
      'lorry driving test UAE', 'Abu Dhabi truck theory test',
    ],
  },
  D: {
    title: 'Free UAE Light Bus Theory Test 2026 – Minibus License Mock Exam',
    description:
      'Free UAE light bus theory test practice. Mock exam for minibuses & coaches up to 26 passengers. RTA-aligned questions for Dubai, Abu Dhabi & Sharjah.',
    keywords: [
      'light bus theory test UAE', 'minibus driving test Dubai 2026',
      'free bus mock test online', 'RTA light bus theory test',
      'coach driving test UAE', 'Abu Dhabi bus theory test',
    ],
  },
  E: {
    title: 'Free UAE Heavy Bus Theory Test 2026 – Large Passenger Bus Mock Exam',
    description:
      'Free UAE heavy bus driving theory test practice. Mock exam for large passenger buses with 26+ seats. RTA-aligned for Dubai, Abu Dhabi & all emirates.',
    keywords: [
      'heavy bus theory test UAE', 'large bus driving test Dubai 2026',
      'free bus mock test online', 'RTA heavy bus theory test',
      'passenger bus license test UAE', 'Abu Dhabi heavy bus test',
    ],
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
    keywords: seo.keywords,
  }
}

export default function QuizVehicleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
