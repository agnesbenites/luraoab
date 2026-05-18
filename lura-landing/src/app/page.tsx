import { Metadata } from "next";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Editorial from "@/components/sections/Editorial";
import Audience from "@/components/sections/Audience";
import Pricing from "@/components/sections/Pricing";
import CTA from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

// CONFIGURAÇÃO DE PALAVRAS-CHAVE E SEO PARA O GOOGLE
export const metadata: Metadata = {
  title: "Lura OAB | Preparatório Inteligente com IA para o Exame de Ordem",
  description: "Passe na OAB estudando sem excessos. Plataforma completa com Vade Mecum inteligente, questões estratégicas e correção de peças por IA por apenas R$ 15,90/mês.",
  keywords: [
    "preparatorio oab",
    "como passar na oab",
    "vade mecum inteligente",
    "ia juridica oab",
    "correcao de pecas oab ia",
    "estudo para oab por questoes",
    "repescagem oab estrategia",
    "lura oab",
    "exame de ordem fgv",
    "segunda fase oab pecas"
  ],
  openGraph: {
    title: "Lura OAB | Estudo Jurídico com Inteligência Artificial",
    description: "Esqueça os cursinhos caros de milhares de reais. Estude de forma cirúrgica para a 1ª e 2ª fase da OAB com IA.",
    type: "website",
  }
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Editorial />
        <Audience />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}