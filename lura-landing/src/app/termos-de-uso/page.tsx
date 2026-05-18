import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

export default function TermsPage() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header />
      <main style={{ padding: "96px 24px" }}>
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <article
            style={{
              background: "#161225",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              padding: "32px",
              color: "#f5f1ff",
            }}
          >
            <div style={{ display: "grid", gap: "20px" }}>
              <h1 style={{ fontSize: "2rem", lineHeight: 1.1 }}>Termos e Condições Gerais de Uso</h1>
              <p style={{ color: "rgba(255,255,255,0.64)" }}>
                Última atualização: Maio de {currentYear}
              </p>

              <div
                style={{
                  background: "rgba(183,148,255,0.12)",
                  border: "1px solid rgba(183,148,255,0.28)",
                  borderRadius: "16px",
                  padding: "16px",
                }}
              >
                <strong>TERMO DE ADESÃO ELETRÔNICO:</strong> Ao clicar em "Li e aceito os Termos de Uso" ou ao efetuar o faturamento via Mercado Pago, você adere eletronicamente a este instrumento, aceitando todas as suas cláusulas e condições contratuais.
              </div>

              <p>
                Bem-vindo ao <strong>Lura OAB</strong>. Os presentes Termos regulam a utilização da licença de uso de software por assinatura (SaaS), em conformidade com a legislação brasileira aplicável.
              </p>

              <h2>1. Objeto e Cláusula de Meio</h2>
              <p>
                O Lura OAB fornece suporte tecnológico baseado em Inteligência Artificial para otimização do estudo autônomo. O software configura atividade de meio, não garantindo aprovação do usuário no Exame da OAB.
              </p>

              <h2>2. Pagamento via Mercado Pago</h2>
              <p>
                A modalidade premium é disponibilizada mediante faturamento mensal recorrente de <strong>R$ 15,90</strong>. As transações financeiras e inserções de cartão ocorrem de forma segura via Mercado Pago.
              </p>

              <h2>3. Direito de Arrependimento</h2>
              <p>
                É garantido o prazo de <strong>7 (sete) dias corridos</strong> para exercício do direito de arrependimento, com devolução integral dos valores pagos, nos termos da legislação aplicável.
              </p>

              <h2>4. Cancelamento</h2>
              <p>
                O cancelamento da assinatura pode ser realizado a qualquer momento, sem fidelidade e sem cobrança de multa.
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
