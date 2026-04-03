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
  const dict = await getDictionary(locale);

  return {
    title: {
      default: dict.seo.title,
      template: "%s | Road Ready UAE",
    },
    description: dict.seo.description,
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
      "RTA mock test online free",
      "Sharjah driving test",
      "Ajman driving theory test",
      "Ras Al Khaimah driving test",
      "Fujairah driving test",
      "Umm Al Quwain driving test",
      "RTA theory test passing marks",
      "RTA hazard perception test",
      "driving test questions UAE 2026",
      "free driving theory test UAE",
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
      title: dict.seo.ogTitle,
      description: dict.seo.ogDescription,
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
      title: dict.seo.title,
      description: dict.seo.description,
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
    other: {
      "geo.region": "AE",
      "geo.placename": "Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah, United Arab Emirates",
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
