"use client";

import { useState } from "react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import styles from "./Legal.module.css";

type Tab = "termos" | "privacidade";

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<Tab>("termos");
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className={styles.tabsNav} role="tablist">
            <button
              className={`${styles.tabButton} ${activeTab === "termos" ? styles.active : ""}`}
              onClick={() => setActiveTab("termos")}
            >
              Termos de Uso
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "privacidade" ? styles.active : ""}`}
              onClick={() => setActiveTab("privacidade")}
            >
              Política de Privacidade
            </button>
          </div>

          <article className={styles.contentBox}>
            {activeTab === "termos" ? (
              <div className={styles.legalText}>
                <h1>Termos e Condições Gerais de Uso</h1>
                <p className={styles.meta}>Última atualização: Maio de {currentYear}</p>
                
                <div className={styles.contractAlert}>
                  <strong>TERMO DE ADESÃO ELETRÔNICO:</strong> Ao clicar em "Li e aceito os Termos de Uso" ou ao efetuar o faturamento via Mercado Pago, você adere eletronicamente a este instrumento, aceitando todas as suas cláusulas e condições contratuais, ciente de sua validade jurídica sob o Art. 422 do Código Civil.
                </div>

                <p>
                  Bem-vindo ao <strong>Lura OAB</strong>. Os presentes Termos regulam a utilização da licença de uso de software por assinatura (SaaS), em estrita conformidade com o Código de Defesa do Consumidor (Lei nº 8.078/90), Lei do E-commerce (Decreto nº 7.962/13) e o Marco Civil da Internet.
                </p>

                <h2>1. Objeto e Cláusula de Meio</h2>
                <p>
                  O Lura OAB fornece suporte tecnológico avançado baseado em Inteligência Artificial para otimização do estudo autônomo. O software configura estritamente atividade de meio, não garantindo a aprovação do usuário no certame da OAB.
                </p>

                <h2>2. Pagamento via Mercado Pago e Dados Financeiros</h2>
                <p>
                  A modalidade premium do ecossistema é disponibilizada mediante faturamento mensal recorrente de <strong>R$ 15,90</strong>. Todas as transações financeiras e inserções de cartões ocorrem de forma criptografada fora dos servidores do app, operadas pelo gateway integrado <strong>Mercado Pago</strong> (Padrões PCI-DSS).
                </p>

                <h2>3. Direito de Arrependimento (Art. 49, CDC)</h2>
                <p>
                  É garantido o prazo de <strong>7 (sete) dias corridos</strong> para o exercício do direito de arrependimento com devolução integral dos valores pagos. O cancelamento da assinatura é livre e pode ser realizado a qualquer momento pelo painel, sem taxas de fidelidade.
                </p>
              </div>
            ) : (
              <div className={styles.legalText}>
                <h1>Política de Privacidade e Proteção de Dados</h1>
                <p className={styles.meta}>Última atualização: Maio de {currentYear}</p>

                <p>
                  Esta Política descreve as práticas de tratamento de dados realizadas pelo Lura OAB sob as diretrizes da LGPD (Lei nº 13.709/18).
                </p>

                <h2>1. Coleta e Finalidade dos Dados</h2>
                <p>
                  Tratamos nome e e-mail para sincronização de progresso e autenticação de conta. Os dados críticos de faturamento são geridos via token seguro pelo Mercado Pago, não sendo armazenados em nossa base.
                </p>

                <h2>2. Sigilo no Processamento por Inteligência Artificial</h2>
                <p>
                  Os dados textuais de peças submetidas para correção da IA são transmitidos de forma segura e criptografada para nossos provedores de infraestrutura (como Groq). Contratualmente, <strong>nenhum conteúdo inserido é utilizado para fins de treinamento de modelos públicos</strong>.
                </p>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
