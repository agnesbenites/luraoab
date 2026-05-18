import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Features.module.css";

const mainFeatures = [
  {
    title: "Vade Mecum inteligente",
    text: "Pesquise artigos, institutos e termos jurídicos com mais velocidade, sem perder a lógica de estudo da prova.",
  },
  {
    title: "Questões com contexto",
    text: "Não é só responder. A proposta é aprender com comentários, padrões de cobrança e revisão do erro.",
  },
  {
    title: "Simulados e acompanhamento",
    text: "Veja evolução por disciplina, acertos por assunto e sinais claros do que precisa entrar na sua revisão.",
  },
];

const sideFeatures = [
  {
    title: "1ª fase com clareza",
    text: "Trilhas enxutas, revisão objetiva e navegação feita para estudar sem fricção.",
  },
  {
    title: "2ª fase com profundidade",
    text: "Peças, fundamentos, repertório e apoio técnico para quem precisa escrever melhor e com segurança.",
  },
];

export function Features() {
  return (
    <section className={styles.section} id="recursos">
      <div className="container">
        <Eyebrow>Recursos do produto</Eyebrow>

        <div className={styles.grid}>
          <article className={styles.panel}>
            <div>
              <h2 className={styles.title}>
                Uma landing que comunica o valor do app sem parecer genérica.
              </h2>
              <p className={styles.copy}>
                A ideia aqui é vender um produto digital sério: mais organização,
                mais confiança e menos poluição visual. A estrutura já está pronta
                para apresentar o essencial com hierarquia clara.
              </p>
            </div>

            <div className={styles.list}>
              {mainFeatures.map((item) => (
                <div key={item.title} className={styles.featureItem}>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </article>

          <div className={styles.stack}>
            {sideFeatures.map((item) => (
              <article key={item.title} className={styles.sideCard}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
