import type { Metadata } from "next";
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
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', t);
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
