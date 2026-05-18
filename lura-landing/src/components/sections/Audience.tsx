import { GraduationCap, Scale, RotateCcw, Target } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Audience.module.css";

const audience = [
  {
    title: "Quem está na 1ª fase",
    text: "Para quem precisa vencer o volume absurdo do edital com simulados inteligentes e revisões cirúrgicas, focando apenas no que realmente pontua.",
    icon: GraduationCap,
  },
  {
    title: "Quem vai para a 2ª fase",
    text: "Para quem busca profundidade jurídica e segurança prática para estruturar peças impecáveis e encontrar a fundamentação exata da banca.",
    icon: Scale,
  },
  {
    title: "Quem caiu na repescagem",
    text: "O ponto de virada estratégico. Para quem precisa recalcular a rota com precisão, eliminar os excessos e transformar a bagagem atual em aprovação.",
    icon: RotateCcw,
  },
  {
    title: "Quem exige metodologia",
    text: "Desenvolvido de ponta a ponta com base na experiência real de quem superou cada etapa. Um ecossistema livre de matérias inúteis e focado em evolução real.",
    icon: Target,
  },
];

export default function Audience() {
  return (
    <section className={styles.section} id="publico">
      <div className="container">
        <Eyebrow>Para quem é</Eyebrow>
        <div className={styles.grid}>
          {audience.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className={styles.card}>
                <span className={styles.iconWrap}>
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}