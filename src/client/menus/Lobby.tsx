import { useClientState } from "../useClientState";
import { Button } from "../components/Button";
import { PlayerDisplay } from "../components/PlayerDisplay";

export interface LobbyProps {}

export function Lobby(props: LobbyProps) {
  const { state, ownPlayerId, toggleReadyness } = useClientState();
  return (
    <div>
      {state.players.map((player) => (
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
