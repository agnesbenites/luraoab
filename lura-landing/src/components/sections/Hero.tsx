import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroIllustration } from "@/components/ui/HeroIllustration";
import styles from "./Hero.module.css";

export default function Hero() {
  const checkoutUrl = "https://mpago.la/1pcSsGH";

  return (
    <section className={styles.hero} id="topo">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <Eyebrow>Método e Alta Performance</Eyebrow>

          <h1 className={styles.headline}>
            Aprovação na OAB
            <br />
            <em className={styles.accentText}>sem o preço dos cursinhos.</em>
          </h1>

          <p className={styles.sub}>
            O Lura OAB substitui preparatórios inflados de milhares de reais por
            um ecossistema cirúrgico. Tenha Vade Mecum inteligente, banco de
            questões estratégico e correção de peças por IA pelo valor de uma
            assinatura simples.
          </p>

          <div className={styles.cta}>
            <Button
              variant="primary"
              size="lg"
              as="a"
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quero ser aprovado
            </Button>

            <Button variant="secondary" size="lg" as="a" href="#recursos">
              Estudar com Estratégia
            </Button>
          </div>

          <div className={styles.priceAnchor}>
            <p>
              ⚡ <strong>Chega de pagar caro por PDFs infinitos:</strong> assine
              hoje e estude com método, clareza e estratégia por um valor
              acessível.
            </p>
          </div>

          <ul className={styles.proof} aria-label="Destaques do produto">
            <li className={styles.proofItem}>
              <strong>1ª e 2ª Fase</strong>
              <span>Trilhas integradas sem o excesso de matérias dos cursinhos</span>
            </li>

            <li className={styles.proofItem}>
              <strong>Vade Mecum + IA</strong>
              <span>Busca inteligente e marcações preditivas automáticas</span>
            </li>

            <li className={styles.proofItem}>
              <strong>Correção Avançada</strong>
              <span>IA jurídica que analisa e estrutura suas peças pelo espelho</span>
            </li>
          </ul>
        </div>

        <div
          className={styles.visual}
          aria-label="Ilustração editorial jurídica"
        >
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
