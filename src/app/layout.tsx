import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Med-Vission — AI Pneumonia Detection",
  description:
    "Upload a chest X-ray and get instant AI-powered pneumonia detection results using deep learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakartaSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary-dark`}
      >
        <div className="relative flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          {/* Clean, immersive background */}
          <div className="pointer-events-none fixed inset-0 z-[-1] bg-background">
            <div className="absolute top-0 left-1/2 h-[800px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] opacity-70" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
