import styles from "./Button.module.css";

export function Button({
  onClick,
  children,
  width,
  keepFocus,
}: {
  onClick: () => void;
  children: React.ReactNode;
  width?: string;
  keepFocus?: boolean;
}) {
  return (
    <button
      className={styles.gameButton}
      onClick={onClick}
      onMouseDown={keepFocus ? (e) => e.preventDefault() : undefined}
      style={{ width }}
    >
      {children}
    </button>
  );
}
