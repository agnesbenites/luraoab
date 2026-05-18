import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Pricing.module.css";

const benefits = [
  "Acesso ilimitado à Inteligência Artificial",
  "Vade Mecum inteligente com marcações preditivas",
  "Banco de questões estratégico (1ª e 2ª fase)",
  "Correção e estruturação de peças por IA",
  "Simulados focados em retenção (sem excessos)",
  "Plataforma limpa e livre de distrações",
];

export default function Pricing() {
  const checkoutUrl = "https://mpago.la/1pcSsGH";

  return (
    <section className={styles.section} id="preço">
      <div className={`container ${styles.wrapper}`}>
        <div className={styles.header}>
          <Eyebrow>Investimento inteligente</Eyebrow>
          <h2 className={styles.title}>
            Preparação de elite por uma fração do custo.
          </h2>
          <p className={styles.description}>
            Sem contratos de fidelidade, sem pegadinhas e sem o preço abusivo dos cursinhos tradicionais. O ecossistema completo para a sua aprovação.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.planBadge}>Plano Mensal</span>

            <div className={styles.priceContainer}>
              <span className={styles.currency}>R$</span>
              <strong className={styles.price}>15,90</strong>
              <span className={styles.period}>/mês</span>
            </div>

            <p className={styles.priceSub}>
              Cancele quando quiser, sem burocracia.
            </p>
          </div>

          <div className={styles.divider} />

          <ul
            className={styles.benefitsList}
            aria-label="Benefícios do plano"
          >
            {benefits.map((benefit, index) => (
              <li key={index} className={styles.benefitItem}>
                <span className={styles.checkWrap}>
                  <Check size={16} strokeWidth={2.5} />
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className={styles.actionWrap}>
            <Button
              variant="primary"
              size="lg"
              as="a"
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              Quero ser aprovado
            </Button>

            <p className={styles.secureText}>
              🔒 Pagamento 100% seguro. Você será redirecionado para o checkout para concluir sua assinatura.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}