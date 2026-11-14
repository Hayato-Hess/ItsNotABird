import styles from "./Button.module.css";

export function Button({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button className={styles.gameButton} onClick={onClick}>
      {children}
    </button>
  );
}
