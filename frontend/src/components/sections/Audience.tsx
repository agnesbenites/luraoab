import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Audience.module.css";

const audience = [
  {
    title: "Quem está na 1ª fase",
    text: "Precisa entender rápido o valor do app: revisão, organização, Vade e prática com menos ruído.",
  },
  {
    title: "Quem vai para a 2ª fase",
    text: "Quer profundidade, segurança técnica e mais contexto para construir peças melhores.",
  },
  {
    title: "Quem compara ferramentas",
    text: "Vai julgar clareza de proposta, sensação de produto bem construído e confiança na marca.",
  },
];

export function Audience() {
  return (
    <section className={styles.section} id="publico">
      <div className="container">
        <Eyebrow>Para quem</Eyebrow>
        <div className={styles.grid}>
          {audience.map((item) => (
            <article key={item.title} className={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
