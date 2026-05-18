import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white font-sans selection:bg-[#7C3AED] selection:text-white overflow-hidden">
      
      {/* ══ CABEÇALHO ══ */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Lura OAB</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://app.luraoab.com.br" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Já sou aluno
            </a>
            <a href="/planos" className="bg-[#7C3AED] hover:bg-[#6d28d9] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              Assinar agora
            </a>
          </div>
        </div>
      </header>

      {/* ══ HERO SECTION ══ */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C3AED]/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* Texto Hero */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
              A revolução no seu estudo
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              A sua aprovação na <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#a78bfa]">OAB começa aqui.</span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Estudo estratégico, simulados completos baseados em exames reais e correção de peças discursivas por Inteligência Artificial.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a href="/planos" className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6d28d9] text-white text-base font-bold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2">
                Começar minha preparação
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </a>
              <span className="text-sm text-gray-500">Cancele quando quiser.</span>
            </div>
          </div>

          {/* Mockup do App (Desenhado em CSS) */}
          <div className="relative w-full max-w-[320px] flex-shrink-0">
            {/* Grafismos Line-art Flutuantes ao redor do celular */}
            <svg className="absolute -left-12 top-10 w-16 h-16 animate-[bounce_4s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <svg className="absolute -right-8 bottom-20 w-12 h-12 animate-[bounce_5s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <svg className="absolute -right-16 top-32 w-20 h-20 opacity-50 animate-[pulse_4s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>

            {/* O Celular */}
            <div className="relative mx-auto w-[280px] h-[580px] bg-[#0f0f1a] border-[6px] border-[#1e1e30] rounded-[40px] shadow-[0_20px_70px_rgba(124,58,237,0.25)] overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-[#1e1e30] rounded-b-2xl w-32 mx-auto z-20"></div>

              {/* Header do Mockup */}
              <div className="pt-10 px-5 pb-4 bg-[#151525]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm">L</div>
                    <div>
                      <div className="text-white text-sm font-bold">Lura OAB</div>
                      <div className="text-gray-400 text-xs">2ª Fase - Constitucional</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body do Mockup */}
              <div className="p-4 flex flex-col gap-4">
                {/* Card Desempenho */}
                <div className="bg-[#1a1a2e] rounded-2xl p-4 border border-[#2a2a40]">
                  <div className="text-gray-400 text-xs mb-1">Taxa de Acertos</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-white">82%</span>
                    <span className="text-[10px] text-[#10b981] font-bold uppercase tracking-wider">↑ Excelente</span>
                  </div>
                  <div className="w-full bg-[#0f0f1a] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#7C3AED] w-[82%] h-full rounded-full"></div>
                  </div>
                </div>

                {/* Botoes de Ação */}
                <div className="flex gap-3">
                  <div className="bg-[#7C3AED] flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div className="text-white font-bold text-[11px]">Simulados</div>
                  </div>
                  <div className="bg-[#1a1a2e] flex-1 py-3 px-2 rounded-xl border border-[#2a2a40] flex flex-col items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <div className="text-white font-bold text-[11px]">IA Correção</div>
                  </div>
                </div>

                {/* Lista */}
                <div className="flex flex-col gap-2 mt-2">
                  <div className="text-white text-xs font-bold mb-1">Próximos passos</div>
                  <div className="h-12 bg-[#1a1a2e] rounded-xl border border-[#2a2a40] flex items-center px-3 gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                      <span className="text-[#7C3AED] text-xs font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-20 h-1.5 bg-gray-500 rounded-full mb-2"></div>
                      <div className="w-12 h-1.5 bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-12 bg-[#1a1a2e] rounded-xl border border-[#2a2a40] flex items-center px-3 gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500 text-xs font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-24 h-1.5 bg-gray-700 rounded-full mb-2"></div>
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES (ESTÉTICA LINE-ART) ══ */}
      <section className="py-24 bg-[#151525] relative border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Tudo que você precisa para a carteirinha</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Abandonamos os métodos ultrapassados. O Lura une estratégia, prática real e inteligência artificial para otimizar seu tempo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#0f0f1a] border border-[#2a2a40] rounded-2xl p-8 hover:border-[#7C3AED] transition-colors">
              <svg className="mb-6" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              <h3 className="text-xl font-bold mb-3">Vade Mecum Integrado</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Consulte a legislação de forma rápida e focada enquanto resolve as peças. Esqueça os livros pesados durante o treino.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0f0f1a] border border-[#2a2a40] rounded-2xl p-8 hover:border-[#7C3AED] transition-colors">
              <svg className="mb-6" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M12 11v.01"></path></svg>
              <h3 className="text-xl font-bold mb-3">Correção por IA</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Faça sua peça discursiva e receba feedback imediato baseado nos espelhos da FGV. Saiba exatamente onde perdeu pontos.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0f0f1a] border border-[#2a2a40] rounded-2xl p-8 hover:border-[#7C3AED] transition-colors">
              <svg className="mb-6" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              <h3 className="text-xl font-bold mb-3">Métricas e Progresso</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Acompanhe sua taxa de acertos e descubra quais matérias precisam de mais foco estratégico antes da prova.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DEPOIMENTOS E CTA ══ */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">Quem estuda com o Lura, aprova.</h2>
          
          <div className="grid sm:grid-cols-2 gap-6 text-left mb-12">
            {/* Depoimento Placeholder 1 */}
            <div className="bg-[#151525] border border-[#2a2a40] p-6 rounded-2xl">
              <div className="flex text-[#7C3AED] mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <p className="text-gray-300 text-sm mb-4">"A correção de peças pela Inteligência Artificial foi o divisor de águas. Me mostrou exatamente o que o espelho da FGV estava exigindo."</p>
              <div className="font-bold text-sm">Aluno Aprovado</div>
              <div className="text-xs text-gray-500">2ª Fase Direito Penal</div>
            </div>

            {/* Depoimento Placeholder 2 */}
            <div className="bg-[#151525] border border-[#2a2a40] p-6 rounded-2xl">
              <div className="flex text-[#7C3AED] mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <p className="text-gray-300 text-sm mb-4">"O app não trava, a interface é linda (escura, o que ajuda a estudar de noite) e os simulados são muito reais. Recomendo muito!"</p>
              <div className="font-bold text-sm">Aluna Aprovada</div>
              <div className="text-xs text-gray-500">2ª Fase Direito Administrativo</div>
            </div>
          </div>

          {/* CTA para alunos atuais */}
          <div className="inline-block bg-[#1a1a2e] border border-[#2a2a40] p-6 rounded-2xl text-center w-full max-w-2xl">
            <h4 className="font-bold mb-2">Já é aluno do Lura OAB?</h4>
            <p className="text-sm text-gray-400 mb-4">Sua história pode inspirar o próximo aprovado. Compartilhe sua experiência conosco.</p>
            <button className="bg-transparent border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10 text-sm font-bold px-6 py-2.5 rounded-full transition-colors">
              Enviar meu depoimento
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-white/5 py-12 text-center bg-[#0a0a10]">
        <div className="w-10 h-10 rounded-lg bg-[#7C3AED] flex items-center justify-center mx-auto mb-4 opacity-50">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Lura OAB. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}