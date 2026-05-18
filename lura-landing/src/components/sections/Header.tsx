"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./Header.module.css";
import { BrandMark } from "@/components/ui/BrandMark";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = document.documentElement.getAttribute("data-theme");
    if (stored === "dark" || stored === "light") setTheme(stored);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }

  const navLinks = [
    { href: "#recursos", label: "Recursos" },
    { href: "#estilo", label: "Metodologia" },
    { href: "#publico", label: "Para quem é" },
    { href: "#preço", label: "Planos" },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.nav}`}>
        {/* LOGO */}
        <a href="#topo" className={styles.brand} aria-label="Lura OAB">
          <BrandMark />
          <span className={styles.brandName}>Lura OAB</span>
        </a>

        {/* MENU DE LINKS (DESKTOP ONLY) */}
        <nav className={styles.links} aria-label="Navegação principal">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className={styles.navLink}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* AÇÕES (BOTÕES E THEME TOGGLE) */}
        <div className={styles.actions}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
          >
            {theme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          
          <Button variant="secondary" size="sm" as="a" href="#recursos" className={styles.desktopOnly}>
            Estude sem excessos
          </Button>
          
          <Button variant="primary" size="sm" as="a" href="#preço" className={styles.ctaButton}>
            <span className={styles.desktopOnly}>Assinar por R$ 15,90</span>
            <span className={styles.mobileOnly}>Assinar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}