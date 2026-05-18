import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Editorial } from "@/components/sections/Editorial";
import { Audience } from "@/components/sections/Audience";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <a className="sr-only" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Features />
        <Editorial />
        <Audience />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
