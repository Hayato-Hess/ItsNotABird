import { Player } from "../../shared/Data/Player";

export type PlayerDisplayProps = {
  player: Player;
  isSelf?: boolean;
};

export function PlayerDisplay({ player, isSelf }: PlayerDisplayProps) {
  return (
    <div>
      {player.Id}
      {player.IsReady && " [Ready]"}
    </div>
  );
}
