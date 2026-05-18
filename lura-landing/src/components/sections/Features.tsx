import { BookOpen, FileSearch, LineChart, PenTool, Scale, Sparkles, Brain } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Features.module.css";

const mainFeatures = [
  {
    title: "Vade Mecum contextualizado por IA",
    text: "Localize artigos, jurisprudências e fundamentos instantaneamente. A IA faz o cruzamento de dados para apontar os artigos com maior probabilidade de cobrança.",
    icon: Scale,
  },
  {
    title: "Enunciados e justificativas com IA",
    text: "Treine com questões que simulam o padrão rigoroso da FGV e receba mentorias detalhadas que explicam exatamente a linha de raciocínio da banca.",
    icon: Sparkles, // Ícone que remete a recursos de Inteligência Artificial
  },
  {
    title: "Diagnóstico e evolução preditiva",
    text: "Acompanhe sua curva de retenção por assunto. O ecossistema identifica suas fraquezas e prioriza revisões cirúrgicas antes que você erre na prova.",
    icon: LineChart,
  },
];

const sideFeatures = [
  {
    title: "Engenharia reversa na 1ª fase",
    text: "Foco total na retenção e no treino constante. Uma metodologia projetada para eliminar o excesso inútil de matérias teóricas de cursinhos tradicionais.",
    icon: BookOpen,
  },
  {
    title: "Segurança cirúrgica na 2ª fase",
    text: "Esqueleto de peças, fundamentos validados e treino orientado para você estruturar teses com a precisão exigida pelo espelho de correção.",
    icon: PenTool,
  },
  {
    title: "Pesquisa jurídica orientada",
    text: "Uma experiência livre de fricção e sem poluição visual. Tecnologia robusta integrada à rotina de quem estuda de forma autônoma e estratégica.",
    icon: FileSearch,
  },
];

export default function Features() {
  return (
    <section className={styles.section} id="recursos">
      <div className="container">
        <Eyebrow>Engenharia Tecnológica</Eyebrow>

        <div className={styles.grid}>
          <article className={styles.panel}>
            <div>
              <h2 className={styles.title}>
                A eficiência da Inteligência Artificial combinada com a estratégia de quem viveu a prova.
              </h2>
              <p className={styles.copy}>
                O Lura OAB foi desenvolvido por quem cansou de cronogramas inflados e métodos tradicionais ineficientes. Unimos tecnologia proprietária de IA a uma arquitetura limpa, gerando um ambiente focado em eliminar excessos e acelerar sua aprovação sem desperdiçar seu tempo.
              </p>
            </div>

            <div className={styles.list}>
              {mainFeatures.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className={styles.featureItem}>
                    <div className={styles.featureHead}>
                      <span className={styles.iconWrap}>
                        <Icon size={18} strokeWidth={1.8} />
                      </span>
                      <strong>{item.title}</strong>
                    </div>
                    <p>{item.text}</p>
                  </div>
                );
              })}
            </div>
          </article>

          <div className={styles.stack}>
            {sideFeatures.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className={styles.sideCard}>
                  <span className={styles.sideIcon}>
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}