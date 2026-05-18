import { Landmark, LibraryBig, Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Editorial.module.css";

const points = [
  {
    title: "Interface cognitiva",
    text: "Design limpo e livre de interrupções, planejado milimetricamente para aumentar o tempo de foco e retenção.",
    icon: LibraryBig, // Invertido para casar melhor com leitura/foco
  },
  {
    title: "Identidade de alto nível",
    text: "Uma estética sóbria e contemporânea que reflete a seriedade e o prestígio da advocacia de elite.",
    icon: Landmark,
  },
  {
    title: "Estudo imersivo",
    text: "Tipografia e hierarquia visual refinadas para tornar as leituras de leis e justificativas de IA muito menos cansativas.",
    icon: Sparkles,
  },
];

export default function Editorial() {
  return (
    <section className={styles.section} id="estilo">
      <div className="container">
        <div className={styles.band}>
          <div className={styles.copyWrap}>
            <Eyebrow>Ambiente de Performance</Eyebrow>
            <h2 className={styles.title}>
              Uma experiência imersiva, desenhada para quem leva a aprovação a sério.
            </h2>
            <p className={styles.copy}>
              O Lura OAB substitui o visual infantilizado de aplicativos comuns de quiz por um ecossistema rigorosamente estruturado. O resultado é um ambiente profissional, maduro e focado no que realmente importa: o seu avanço prático rumo à carteira da Ordem.
            </p>

            <div className={styles.points}>
              {points.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className={styles.point}>
                    <span className={styles.pointIcon}>
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.visual} aria-hidden="true">
            <svg viewBox="0 0 460 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g stroke="white" strokeOpacity="0.88" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="44" y="52" width="156" height="198" rx="18" />
                <path d="M74 94h93" />
                <path d="M74 124h81" />
                <path d="M74 154h98" />
                <path d="M74 184h66" />
                <path d="M102 52V28" />
                <path d="M142 52V28" />
                <path d="M274 102c18-22 53-22 71 0 12 15 14 39 5 56-10 20-41 45-41 45s-32-25-42-45c-8-17-7-41 7-56Z" stroke="#b794ff" />
                <path d="M309 102v44" stroke="#b794ff" />
                <path d="M286 125h46" stroke="#b794ff" />
                <path d="M242 229h133" />
                <path d="M250 255h98" />
                <path d="M375 70" r="18" stroke="#b794ff" />
                <circle cx="375" cy="70" r="18" stroke="#b794ff" />
                <path d="M375 60v10l7 5" stroke="#b794ff" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}