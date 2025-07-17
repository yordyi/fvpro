import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/mobile-nav";
import { Providers } from "@/components/providers";
import { ErrorBoundary, DevToolsErrorFallback } from "@/components/error-boundary";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Privacy Guardian - 浏览器隐私检测工具",
  description: "检测您的浏览器隐私和安全状况，包括IP泄露、WebRTC、浏览器指纹等",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary fallback={DevToolsErrorFallback}>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <Header />
              <main className="pb-16 md:pb-0">{children}</main>
              <BottomNav />
            </Providers>
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}