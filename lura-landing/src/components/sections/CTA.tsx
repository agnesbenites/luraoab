"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./CTA.module.css";

export default function CTA() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className={styles.section} id="espera">
      <div className="container">
        <div className={styles.card}>
          <div>
            <Eyebrow>Lista de espera</Eyebrow>
            <h2 className={styles.title}>
              Receba em primeira mão as novidades da Lura OAB.
            </h2>
            <p className={styles.copy}>
              Entre na lista para acompanhar lançamento, atualizações do produto
              e próximos passos da plataforma.
            </p>

            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className={styles.inputWrap}>
                <Mail size={18} strokeWidth={1.8} />
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  aria-label="Seu melhor e-mail"
                />
              </div>

              <Button type="submit" variant="primary" size="md">
                <span className={styles.buttonInner}>
                  Entrar na lista
                  <ArrowRight size={16} strokeWidth={1.8} />
                </span>
              </Button>
            </form>

            {submitted ? (
              <p className={styles.feedback}>
                Cadastro recebido. Agora é só seguir com a integração real da sua captura.
              </p>
            ) : null}
          </div>

          <aside className={styles.note}>
            <h3>O que você encontra na Lura OAB</h3>
            <ul>
              <li>
                <CheckCircle2 size={16} strokeWidth={1.8} />
                <span>Estudo orientado para 1ª e 2ª fase.</span>
              </li>
              <li>
                <CheckCircle2 size={16} strokeWidth={1.8} />
                <span>Pesquisa, prática e revisão em uma só experiência.</span>
              </li>
              <li>
                <CheckCircle2 size={16} strokeWidth={1.8} />
                <span>Interface clara, moderna e pensada para foco.</span>
              </li>
              <li>
                <CheckCircle2 size={16} strokeWidth={1.8} />
                <span>Base pronta para crescer com captação real.</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}