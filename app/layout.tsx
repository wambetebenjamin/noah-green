import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import "../css/animate.css";
import "../css/flaticon.css";
import "../css/style.css";
import "../css/noah-green.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import SessionWrapper from "@/components/SessionWrapper";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsGate from "@/components/AnalyticsGate";
import WhatsAppButton from "@/components/WhatsAppButton";
import VoiceTour from "@/components/VoiceTour";
import { SITE } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: IMAGES.heroSorting.remote, alt: IMAGES.heroSorting.alt }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body>
        <Loader />
        <SmoothScroll />
        <SessionWrapper>
          <Header />
          <main>{children}</main>
          <Footer />
        </SessionWrapper>
        <CookieConsent />
        <AnalyticsGate />
        <WhatsAppButton />
        <VoiceTour />
      </body>
    </html>
  );
}
