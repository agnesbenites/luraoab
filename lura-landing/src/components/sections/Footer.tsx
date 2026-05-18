import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandBlock}>
          <strong className={styles.brand}>Lura OAB</strong>
          <p className={styles.tagline}>
            Inteligência Artificial e estratégia cirúrgica para a sua aprovação no Exame de Ordem.
          </p>
        </div>

        <div className={styles.metaBlock}>
          <div className={styles.links}>
            <a href="/legal?tab=termos" className={styles.link}>
              Termos de Uso
            </a>
            <a href="/legal?tab=privacidade" className={styles.link}>
              Política de Privacidade
            </a>
          </div>

          <p className={styles.copyright}>
            &copy; {currentYear} Lura OAB. Todos os direitos reservados.
            Desenvolvido de forma autônoma para alta performance jurídica.
          </p>
        </div>
      </div>
    </footer>
  );
}