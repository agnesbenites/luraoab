import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

export default function PrivacyPage() {
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
              <h1 style={{ fontSize: "2rem", lineHeight: 1.1 }}>Política de Privacidade e Proteção de Dados</h1>
              <p style={{ color: "rgba(255,255,255,0.64)" }}>
                Última atualização: Maio de {currentYear}
              </p>

              <p>
                Esta Política descreve as práticas de tratamento de dados realizadas pelo <strong>Lura OAB</strong>, em conformidade com a LGPD.
              </p>

              <h2>1. Coleta e Finalidade dos Dados</h2>
              <p>
                Tratamos dados como nome e e-mail para autenticação, sincronização de progresso e funcionamento da plataforma.
              </p>

              <h2>2. Dados de Pagamento</h2>
              <p>
                Os dados financeiros críticos são processados por provedor externo seguro, o Mercado Pago, e não são armazenados diretamente em nossa base.
              </p>

              <h2>3. Dados enviados para IA</h2>
              <p>
                Conteúdos textuais submetidos para correção e análise são transmitidos de forma segura aos provedores de infraestrutura utilizados pelo serviço.
              </p>

              <h2>4. Direitos do Titular</h2>
              <p>
                O usuário pode solicitar informações, correção ou exclusão de dados pessoais, respeitadas as obrigações legais e regulatórias aplicáveis.
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
