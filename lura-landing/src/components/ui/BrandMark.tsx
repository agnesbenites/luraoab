import styles from "./BrandMark.module.css";

export function BrandMark() {
  return (
    <span className={styles.mark} aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4.5h7.2c2 0 3.3 1.1 3.3 3v9.3c0 1.7-1.1 2.7-3 2.7H9.4c-1.7 0-2.8-.9-2.8-2.5V6.6L7 4.5Z"/>
        <path d="M7 4.5V7h2.7"/>
        <path d="M9.5 11.1h4.9"/>
        <path d="M9.5 14.6h4.9"/>
      </svg>
    </span>
  );
}
