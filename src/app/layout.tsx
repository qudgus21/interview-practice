import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interview Mate | 면접 질문 관리 플랫폼",
  description:
    "면접 질문을 체계적으로 관리하고, 면접 준비를 효과적으로 해보세요.",
  keywords: ["면접", "면접 질문", "면접 준비", "취업", "인터뷰", "면접 관리"],
  authors: [{ name: "Interview Mate Team" }],
  creator: "Interview Mate",
  publisher: "Interview Mate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://interviewmate.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Interview Mate | 면접 질문 관리 플랫폼",
    description:
      "면접 질문을 체계적으로 관리하고, 면접 준비를 효과적으로 해보세요.",
    url: "https://interviewmate.org",
    siteName: "Interview Mate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Interview Mate",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Mate | 면접 질문 관리 플랫폼",
    description:
      "면접 질문을 체계적으로 관리하고, 면접 준비를 효과적으로 해보세요.",
    images: ["/og-image.png"],
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
    icon: "/favicon.svg",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "your-google-site-verification",
  },
  manifest: "/manifest.json",
  themeColor: "#E8AA9B",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Interview Mate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4113492235812561"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Interview Mate",
              description:
                "면접 질문을 체계적으로 관리하고, 면접 준비를 효과적으로 해보세요.",
              url: "https://interviewmate.org",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
            }),
          }}
        />
        <meta name="application-name" content="Interview Mate" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Interview Mate" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#E8AA9B" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
