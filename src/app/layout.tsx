import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConnectUS Quest",
  description:
    "Mini app gamificado para missões simples, progresso pessoal e impacto em comunidade.",
  other: {
    "talentapp:project_verification":
      "8305c41d68165a08c9fbc89c1d02323cf782065e7a24ba2332c6b39b41b604847427e8456f1db50d5f3785e3deb2e3e31a6e830b93d6af64197cf4e8634f905d",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
