import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-display' });

export const metadata: Metadata = {
  title: "Resevia — Your AI Receptionist",
  description: "Resevia handles calls, bookings and enquiries 24/7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${playfair.variable} font-sans text-brand-gray bg-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
