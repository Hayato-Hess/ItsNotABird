import styles from "./Button.module.css";

export function Button({
  onClick,
  children,
  width,
  keepFocus,
  negative,
  style,
}: {
  onClick: () => void;
  children: React.ReactNode;
  width?: string;
  style?: React.CSSProperties;
  keepFocus?: boolean;
  negative?: boolean;
}) {
  return (
    <button
      className={`${styles.gameButton} ${negative ? styles.negative : ""}`}
      onClick={onClick}
      onMouseDown={keepFocus ? (e) => e.preventDefault() : undefined}
      style={{ width, ...style }}
    >
      {children}
    </button>
  );
}
