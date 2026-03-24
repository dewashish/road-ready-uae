import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { ProgressProvider } from "@/context/ProgressContext";
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
    default: "Road Ready UAE - Driving Theory Test Prep",
    template: "%s | Road Ready UAE",
  },
  description:
    "Master the UAE driving theory test with 500+ practice questions, mock exams, and smart learning paths. Pass your RTA test with confidence.",
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
