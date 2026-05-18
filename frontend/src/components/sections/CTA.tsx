"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./CTA.module.css";

export function CTA() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className={styles.section} id="espera">
      <div className="container">
        <div className={styles.card}>
          <div>
            <Eyebrow>Próximo passo</Eyebrow>
            <h2 className={styles.title}>
              Essa versão já pode virar sua landing real em React.
            </h2>
            <p className={styles.copy}>
              A estrutura foi pensada para evoluir fácil para captação, página de
              espera, anúncios, App Store preview e versões internas do site.
            </p>

            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                aria-label="Seu melhor e-mail"
              />
              <Button type="submit" variant="primary" size="md">
                Entrar na lista
              </Button>
            </form>

            {submitted ? (
              <p className={styles.feedback}>
                Perfeito — aqui depois entra sua integração real com Supabase,
                Resend, ConvertKit ou outro fluxo de captura.
              </p>
            ) : null}
          </div>

          <aside className={styles.note}>
            <h3>O que já está resolvido</h3>
            <ul>
              <li>Hero forte com foco em conversão.</li>
              <li>Identidade visual alinhada ao app.</li>
              <li>Dark mode e estrutura responsiva.</li>
              <li>Base pronta para crescer com novos blocos.</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
