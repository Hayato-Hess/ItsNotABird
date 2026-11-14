export type PlayerDisplayProps = {
  name: string;
};

export function PlayerDisplay(props: PlayerDisplayProps) {
  return <div>{props.name}</div>;
}
