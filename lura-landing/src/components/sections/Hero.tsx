import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroIllustration } from "@/components/ui/HeroIllustration";
import styles from "./Hero.module.css";

const proofItems = [
  { stat: "1ª e 2ª Fase", label: "Trilhas integradas sem o excesso de matérias dos cursinhos" },
  { stat: "Vade Mecum + IA", label: "Busca inteligente e marcações preditivas automáticas" },
  { stat: "Correção Avançada", label: "IA jurídica que analisa e estrutura suas peças pelo espelho" },
];

export function Hero() {
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
            O Lura OAB substitui preparatórios inflados de milhares de reais por um ecossistema cirúrgico. Tenha Vade Mecum inteligente, banco de questões estratégico e correção de peças por IA pelo valor de uma assinatura simples.
          </p>
          
          <div className={styles.cta}>
            <Button variant="primary" size="lg" as="a" href="#espera">
              Entrar na lista (Acesso com Desconto)
            </Button>
            <Button variant="secondary" size="lg" as="a" href="#recursos">
              Estudar com Estratégia
            </Button>
          </div>

          <div className={styles.priceAnchor}>
            <p>
              ⚡ <strong>Chega de pagar caro por PDFs infinitos:</strong> Cadastre-se hoje e garanta o preço de lançamento com condições exclusivas para os primeiros usuários.
            </p>
          </div>

          <ul className={styles.proof} aria-label="Destaques do produto">
            {proofItems.map((item) => (
              <li key={item.stat} className={styles.proofItem}>
                <strong>{item.stat}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} aria-label="Ilustração editorial jurídica">
          <div className={styles.floatingTop}>
            <p className={styles.miniLabel}>Vade Mecum + IA</p>
            <strong>Art. 5º CF — Direitos Fundamentais</strong>
            <div className={styles.miniLines}>
              <span style={{ width: "100%" }} />
              <span style={{ width: "78%" }} />
              <span style={{ width: "56%" }} />
            </div>
          </div>

          <div className={styles.illustrationWrap}>
            <HeroIllustration />
          </div>

          <div className={styles.floatingBottom}>
            <p className={styles.miniLabel}>Análise de Desempenho</p>
            <strong>78% de evolução em Direito Civil</strong>
            <div className={styles.progressBar}>
              <span style={{ width: "78%" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}