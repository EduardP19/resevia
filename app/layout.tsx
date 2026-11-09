import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import { Suspense } from "react";
import Script from 'next/script';
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL("https://resevia.co.uk"),
  title: "Resevia — The AI Receptionist for Salons, Clinics & Booking Businesses",
  description: "Every call answered. Every booking captured. Resevia answers calls, replies on SMS and WhatsApp, and books appointments 24/7 for salons, clinics and every business that runs on bookings.",
  openGraph: {
    title: "Resevia — Every call answered. Every booking captured.",
    description: "The AI receptionist for salons, clinics and every business that runs on bookings. Test the agent live.",
    url: "https://resevia.co.uk",
    siteName: "Resevia",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/ReseviaLogo.png", alt: "Resevia" }],
  },
  twitter: { card: "summary_large_image", images: ["/ReseviaLogo.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0C0A1D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = "https://resevia.co.uk";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Resevia",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.svg`,
        "description": "Your AI receptionist. Always ready. Resevia handles calls, bookings and enquiries 24/7 for beauty salons, aesthetic clinics, dental practices and other appointment-based businesses.",
        "email": "hello@resevia.co.uk",
        "areaServed": {
          "@type": "Country",
          "name": "United Kingdom"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "hello@resevia.co.uk",
          "contactType": "customer support",
          "areaServed": "GB",
          "availableLanguage": "English"
        },
        "sameAs": [
          "https://www.instagram.com/resevia.ai"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "name": "Resevia",
        "url": siteUrl,
        "description": "AI receptionist for salons and clinics — every call answered, every booking captured.",
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "inLanguage": "en-GB"
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        "name": "Resevia AI Receptionist",
        "url": siteUrl,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "description": "Resevia is an AI receptionist that answers calls, replies to enquiries over SMS and WhatsApp, books appointments and sends reminders 24/7 — built for beauty salons, aesthetic clinics and dental practices.",
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "featureList": [
          "24/7 AI receptionist",
          "Missed-call text-back",
          "SMS and WhatsApp booking",
          "AI voice receptionist",
          "Automated appointment reminders",
          "No-show follow-ups",
          "Calendar integration"
        ],
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "GBP",
          "lowPrice": "79",
          "highPrice": "499",
          "offerCount": "3"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
      </head>
      <body className={`${inter.variable} ${montserrat.variable} font-sans text-brand-gray bg-white antialiased`}>
        <Suspense fallback={null}>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </Suspense>
      </body>
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "w0dh1pomxp");
          // TEMP (testing): grant consent up front so Clarity records full sessions
          // without waiting for a cookie banner. Remove once a consent banner exists.
          window.clarity("consentv2", { ad_Storage: "granted", analytics_Storage: "granted" });
        `}
      </Script>
    </html>
  );
}
