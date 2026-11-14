import { Lobby } from "./menus/Lobby";
import { useClientState as useClientState } from "./useClientState";
import { RoomSelection } from "./menus/RoomSelection";
import { Game } from "./menus/Game";

export function App() {
  const { state } = useClientState();

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <div style={{ maxWidth: "40rem", height: "100%" }}>
        <h1>It's not a Bird?!</h1>
        {state.state === "main" && <RoomSelection />}
        {state.state === "lobby" && <Lobby />}
        {state.state === "game" && <Game />}
      </div>
    </div>
  );
}
