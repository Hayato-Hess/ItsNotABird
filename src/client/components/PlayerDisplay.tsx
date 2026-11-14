import { SharedPlayer } from "../../shared/Data/SharedPlayer";
import { Flex } from "./Flex";
export type PlayerDisplayProps = {
  player: SharedPlayer;
  isSelf?: boolean;
};

export function PlayerDisplay({ player, isSelf }: PlayerDisplayProps) {
  return (
    <Flex>
      <div style={{ flexGrow: 1 }}>{player.Name}</div>
      {player.IsReady && (
        <div style={{ color: "var(--color-primary)" }}>[Ready]</div>
      )}
    </Flex>
  );
}
