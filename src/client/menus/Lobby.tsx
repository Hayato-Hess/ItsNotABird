import { useClientState } from "../useClientState";
import { Button } from "../components/Button";
import { PlayerDisplay } from "../components/PlayerDisplay";

export interface LobbyProps {}

export function Lobby(props: LobbyProps) {
  const { state, ownPlayerId, toggleReadyness } = useClientState();
  return (
    <div>
      <div>Room Code: {state.room?.id}</div>
      {state.room?.players.map((player) => (
        <PlayerDisplay
          key={player.Id}
          player={player}
          isSelf={player.Id === ownPlayerId}
        />
      ))}
      <Button onClick={toggleReadyness}>Ready</Button>
    </div>
  );
}
