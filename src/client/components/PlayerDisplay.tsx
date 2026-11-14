import { SharedPlayer } from "../../shared/Data/SharedPlayer";
export type PlayerDisplayProps = {
  player: SharedPlayer;
  isSelf?: boolean;
};

export function PlayerDisplay({ player, isSelf }: PlayerDisplayProps) {
  return (
    <div>
      {player.Name}
      {player.IsReady && " [Ready]"}
    </div>
  );
}
