import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Editorial.module.css";

export function Editorial() {
  return (
    <section className={styles.section} id="estilo">
      <div className="container">
        <div className={styles.band}>
          <div className={styles.copyWrap}>
            <Eyebrow>Direção visual</Eyebrow>
            <h2 className={styles.title}>
              Editorial minimalista com linguagem jurídica contemporânea.
            </h2>
            <p className={styles.copy}>
              Em vez de usar mockups clichês ou grids de ícones genéricos, a
              landing ganha personalidade com traço fino, elementos jurídicos e
              detalhes roxos pontuais. Isso aproxima o visual do app e melhora a
              sensação de produto premium.
            </p>
          </div>

          <div className={styles.visual} aria-hidden="true">
            <svg viewBox="0 0 460 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g stroke="white" strokeOpacity="0.88" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="44" y="52" width="156" height="198" rx="18"/>
                <path d="M74 94h93"/>
                <path d="M74 124h81"/>
                <path d="M74 154h98"/>
                <path d="M74 184h66"/>
                <path d="M102 52V28"/>
                <path d="M142 52V28"/>
                <path d="M274 102c18-22 53-22 71 0 12 15 14 39 5 56-10 20-41 45-41 45s-32-25-42-45c-8-17-7-41 7-56Z" stroke="#9a67ff"/>
                <path d="M309 102v44" stroke="#9a67ff"/>
                <path d="M286 125h46" stroke="#9a67ff"/>
                <path d="M242 229h133"/>
                <path d="M250 255h98"/>
                <circle cx="375" cy="70" r="18" stroke="#9a67ff"/>
                <path d="M375 60v10l7 5" stroke="#9a67ff"/>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
