export function HeroIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 520 650"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: "min(100%, 520px)", filter: "drop-shadow(0 18px 34px rgba(124,58,237,0.10))", color: "var(--color-text)" }}
    >
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Livro/Documento principal */}
        <rect x="132" y="160" width="248" height="316" rx="26" />
        {/* Espiral do caderno */}
        <path d="M174 120v56" />
        <path d="M218 120v56" />
        <path d="M262 120v56" />
        <path d="M306 120v56" />
        <path d="M162 122h160" />
        {/* Linhas de texto */}
        <path d="M170 220h172" />
        <path d="M170 252h136" />
        <path d="M170 284h152" />
        <path d="M170 316h118" />
        <path d="M170 348h158" />
        <path d="M170 380h104" />
        <path d="M170 412h140" />
        {/* Balança da justiça */}
        <path d="M234 446c50-36 100-16 114 0" stroke="var(--color-primary)" strokeOpacity="0.7" />
        <path d="M290 446v54" stroke="var(--color-primary)" strokeOpacity="0.7" />
        <path d="M256 500h68" stroke="var(--color-primary)" strokeOpacity="0.7" />
        <path d="M248 470l-22 32h46z" stroke="var(--color-primary)" strokeOpacity="0.7" />
        <path d="M330 462l-22 40h46z" stroke="var(--color-primary)" strokeOpacity="0.7" />
        {/* Badge de aprovação */}
        <circle cx="90" cy="186" r="26" stroke="var(--color-primary)" />
        <path d="M82 186l6 6 11-13" stroke="var(--color-primary)" strokeWidth="2.4" />
        {/* Documento lateral direito */}
        <rect x="384" y="380" width="84" height="116" rx="16" />
        <path d="M400 410h52" />
        <path d="M400 434h42" />
        <path d="M400 458h48" />
        <path d="M400 482h34" />
        {/* Tick aprovação lateral */}
        <path d="M398 344l18 22 42-52" stroke="var(--color-primary)" strokeWidth="2.3" />
        {/* Curvas decorativas */}
        <path d="M60 468h62l22-42h56" />
        <path d="M84 432c14-18 35-28 56-28" />
        <path d="M55 564c28-14 52-18 80-17" stroke="currentColor" strokeOpacity="0.35" />
        {/* Estrelas decorativas */}
        <path d="M432 148l17 19 26-32" stroke="var(--color-primary)" strokeWidth="2" />
        <path d="M412 135c18-9 40-8 58 4" />
        {/* Linhas de conexão suaves */}
        <path d="M396 224l15-13 22 10 24-17" stroke="currentColor" strokeOpacity="0.4" />
        <path d="M98 108l18-20 17 20" />
        <path d="M368 94l16 16 16-16 15 16 16-16" stroke="currentColor" strokeOpacity="0.5" />
        {/* Globo/clock */}
        <circle cx="256" cy="562" r="42" />
        <path d="M256 532v30" />
        <path d="M256 562l18 10" stroke="var(--color-primary)" />
        <path d="M218 563h-22" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M316 563h22" stroke="currentColor" strokeOpacity="0.5" />
      </g>
    </svg>
  );
}
