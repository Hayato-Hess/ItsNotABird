import { useClientState } from "../useClientState";
import { Button } from "../components/Button";
import { PlayerDisplay } from "../components/PlayerDisplay";

export interface LobbyProps {}

export function Lobby(props: LobbyProps) {
  const { state, ownPlayerId, toggleReadyness } = useClientState();
  return (
    <div style={{ border: "1px solid #fff", padding: "2rem", height: "100%" }}>
      <div>Room Code:</div>
      <strong style={{ color: "var(--color-primary)", fontSize: 20 }}>
        {state.room?.id}
      </strong>
      <br />
      <br />
      <div>Players:</div>
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
