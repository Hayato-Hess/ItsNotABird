import { useClientState } from "../useClientState";
import { Button } from "../components/Button";
import { PlayerDisplay } from "../components/PlayerDisplay";
import { Flex } from "../components/Flex";

export interface LobbyProps {}

export function Lobby(props: LobbyProps) {
  const {
    state,
    ownPlayerId,
    toggleReadyness,
    lobbyFunctions: { leaveRoom },
  } = useClientState();
  return (
    <Flex
      className="box"
      direction="column"
      gap="1rem"
      style={{ padding: "2rem", height: "100%" }}
    >
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
      <div style={{ flex: 1 }} />
      <Flex justify="center" style={{ gap: "1rem", width: "100%" }}>
        {" "}
        <Button
          negative
          onClick={leaveRoom}
          style={{ height: "5rem", width: "15rem" }}
        >
          Leave
        </Button>
        <Button
          onClick={toggleReadyness}
          style={{ height: "5rem", width: "15rem" }}
        >
          Ready
        </Button>
      </Flex>
    </Flex>
  );
}
