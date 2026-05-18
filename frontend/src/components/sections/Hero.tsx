import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroIllustration } from "@/components/ui/HeroIllustration";
import styles from "./Hero.module.css";

const proofItems = [
  { stat: "1ª e 2ª", label: "fases cobertas com trilhas adaptadas" },
  { stat: "Vade", label: "Mecum integrado e pesquisável" },
  { stat: "IA", label: "que corrige e explica suas peças" },
];

export function Hero() {
  return (
    <section className={styles.hero} id="topo">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <Eyebrow>Preparatório OAB</Eyebrow>
          <h1 className={styles.headline}>
            Passe na OAB
            <br />
            <em className={styles.accentText}>sem enrolar</em>
          </h1>
          <p className={styles.sub}>
            O Lura OAB une Vade Mecum inteligente, questões comentadas, simulados
            por fase e correção de peças com IA — tudo em um app pensado para
            quem quer aprovação, não só conteúdo.
          </p>
          <div className={styles.cta}>
            <Button variant="primary" size="lg" as="a" href="#espera">
              Entrar na lista de espera
            </Button>
            <Button variant="secondary" size="lg" as="a" href="#recursos">
              Ver recursos
            </Button>
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
            <p className={styles.miniLabel}>Vade Mecum</p>
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
            <p className={styles.miniLabel}>Desempenho</p>
            <strong>78% de aproveitamento em Civil</strong>
            <div className={styles.progressBar}>
              <span style={{ width: "78%" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
