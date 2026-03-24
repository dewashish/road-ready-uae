import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { ProgressProvider } from "@/context/ProgressContext";
import { StructuredData } from "./structured-data";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-headline",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Road Ready UAE – Free Driving Theory Test Practice",
    template: "%s | Road Ready UAE",
  },
  description:
    "Pass your UAE driving theory test on the first attempt. Free practice questions for Light Vehicle, Motorcycle, Heavy Truck, Light Bus & Heavy Bus — aligned with RTA exam standards.",
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
    canonical: "/",
  },
  openGraph: {
    title: "Road Ready UAE – Free Driving Theory Test Practice",
    description:
      "UAE's #1 theory test platform. Practice with real exam-style questions for all vehicle categories.",
    url: "https://www.roadreadyuae.com",
    siteName: "Road Ready UAE",
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Road Ready UAE – Free Driving Theory Test Practice",
    description:
      "Pass your UAE driving theory test. Free practice for all vehicle categories.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${manrope.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface min-h-dvh antialiased">
        <StructuredData />
        <ProgressProvider>
          {children}
        </ProgressProvider>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#191919",
              border: "2px solid #000000",
              color: "#ffffff",
              fontFamily: "Manrope, sans-serif",
              boxShadow: "4px 4px 0px 0px #000000",
            },
          }}
        />
      </body>
    </html>
  );
}
