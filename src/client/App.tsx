import { Lobby } from "./menus/Lobby";
import { useClientState as useClientState } from "./useClientState";
import { RoomSelection } from "./menus/RoomSelection";
import { Game } from "./menus/Game";

export function App() {
  const { state } = useClientState();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          background: "#ad4545",
          padding: "1rem",
          margin: "0 0 1rem 0",
        }}
      >
        It's not a Bird?!
      </h1>
      <div
        style={{
          flex: 1,
          display: "flex",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "40rem", height: "100%" }}>
          {state.state === "main" && <RoomSelection />}
          {state.state === "lobby" && <Lobby />}
          {state.state === "game" && <Game />}
        </div>
      </div>
    </div>
  );
}
