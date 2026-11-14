import type { CSSProperties, HTMLAttributes } from "react";

type FlexProps = HTMLAttributes<HTMLDivElement> & {
  direction?: CSSProperties["flexDirection"];
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  gap?: CSSProperties["gap"];
  wrap?: boolean;
  flex?: CSSProperties["flex"];
};

export function Flex({
  direction = "row",
  justify,
  align,
  gap,
  wrap,
  flex,
  style,
  ...rest
}: FlexProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        gap,
        flexWrap: wrap ? "wrap" : undefined,
        flex,
        ...style,
      }}
      {...rest}
    />
  );
}
