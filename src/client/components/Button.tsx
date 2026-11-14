import styles from "./Button.module.css";

export function Button({
  onClick,
  children,
  width,
}: {
  onClick: () => void;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <button className={styles.gameButton} onClick={onClick} style={{ width }}>
      {children}
    </button>
  );
}
