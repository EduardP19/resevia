import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { Suspense } from "react";
import Script from 'next/script';
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-display' });

export const metadata: Metadata = {
  title: "Resevia — Your AI Receptionist",
  description: "Resevia handles calls, bookings and enquiries 24/7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://resevia.co.uk/#organization",
        "name": "Resevia",
        "url": "https://resevia.co.uk",
        "description": "Your AI receptionist. Always ready. Resevia handles calls, bookings and enquiries 24/7."
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://resevia.co.uk/#software",
        "name": "Resevia AI Receptionist",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "79.00",
          "priceCurrency": "GBP"
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
        `}
      </Script>
    </html>
  );
}
