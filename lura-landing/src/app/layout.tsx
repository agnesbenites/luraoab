import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lura OAB — Estude de verdade para a OAB",
  description:
    "Plataforma de estudos inteligente para 1ª e 2ª fase da OAB. Vade Mecum, questões comentadas, simulados e trilhas personalizadas.",
  openGraph: {
    title: "Lura OAB",
    description: "Estude de verdade para a OAB.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}