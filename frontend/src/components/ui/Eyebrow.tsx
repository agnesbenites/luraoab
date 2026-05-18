import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  children: React.ReactNode;
}

export function Eyebrow({ children }: EyebrowProps) {
  return <span className={styles.eyebrow}>{children}</span>;
}
