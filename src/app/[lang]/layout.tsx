import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { ProgressProvider } from "@/context/ProgressContext";
import { DictionaryProvider } from "@/i18n/DictionaryContext";
import { getDictionary } from "@/i18n/dictionaries";
import { getFontsForLocale } from "@/i18n/fonts";
import { hasLocale, isRtl, locales, ogLocaleMap, type Locale } from "@/i18n/config";
import { StructuredData } from "../structured-data";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = (hasLocale(lang) ? lang : "en") as Locale;
  const ogLocale = ogLocaleMap[locale];

  return {
    title: {
      default: "Road Ready UAE – Free Driving Theory Test Practice",
      template: "%s | Road Ready UAE",
    },
    description:
      "Pass your UAE driving theory test on the first try. 1,200+ real exam questions for Car, Motorcycle, Truck & Bus — in 9 languages. Mock exams, adaptive learning, 100% free.",
    keywords: [
      "UAE driving theory test",
      "RTA theory test practice",
      "Dubai driving test questions",
      "UAE light vehicle theory test",
      "Abu Dhabi driving test",
      "UAE motorcycle theory test",
      "heavy truck driving test UAE",
      "Emirates driving theory",
      "driving license test UAE",
      "road test practice UAE",
    ],
    verification: {
      google: "MEk7UVmCMF6Wp1ERJdvw0VLsJADYt4GnQgooawW4coY",
    },
    metadataBase: new URL("https://www.roadreadyuae.com"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "x-default": "/en",
        en: "/en",
        ar: "/ar",
        ur: "/ur",
        hi: "/hi",
        bn: "/bn",
        ml: "/ml",
        tl: "/tl",
        ta: "/ta",
        si: "/si",
      },
    },
    openGraph: {
      title: "Road Ready UAE – Free Driving Theory Test Practice",
      description:
        "Pass your UAE driving test on the first try. 1,200+ real exam questions for Car, Motorcycle, Truck & Bus — in 9 languages. Mock exams, adaptive learning, 100% free.",
      url: `https://www.roadreadyuae.com/${locale}`,
      siteName: "Road Ready UAE",
      locale: ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocaleMap[l]),
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Road Ready UAE – Free UAE Driving Theory Test Practice for All Vehicle Types",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Road Ready UAE – Free Driving Theory Test Practice",
      description:
        "Pass your UAE driving test on the first try. 1,200+ questions, 9 languages, mock exams — 100% free.",
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/icon.svg",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const fontClasses = getFontsForLocale(locale);
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`dark ${fontClasses}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-dvh antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <StructuredData />
        <DictionaryProvider dict={dict} locale={locale}>
          <ProgressProvider>
            {children}
          </ProgressProvider>
        </DictionaryProvider>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#191919",
              border: "2px solid #000000",
              color: "#ffffff",
              fontFamily: "Manrope, sans-serif",
              boxShadow: dir === "rtl" ? "-4px 4px 0px 0px #000000" : "4px 4px 0px 0px #000000",
            },
          }}
        />
      </body>
    </html>
  );
}
