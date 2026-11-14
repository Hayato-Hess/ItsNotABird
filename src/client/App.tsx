import { Lobby } from "./menus/Lobby";
import { useClientState as useClientState } from "./useClientState";
import { RoomSelection } from "./menus/RoomSelection";
import { Game } from "./menus/Game";
import { Flex } from "./components/Flex";

export function App() {
  const { state } = useClientState();

  return (
    <Flex direction="column" style={{ width: "100%", height: "100%" }}>
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
      <Flex flex={1} justify="center" style={{ width: "100%" }}>
        <div
          style={{
            maxWidth: "40rem",
            width: "100%",
            height: "100%",
            padding: "1rem",
          }}
        >
          {state.state === "main" && <RoomSelection />}
          {state.state === "lobby" && <Lobby />}
          {state.state === "game" && <Game />}
        </div>
      </Flex>
    </Flex>
  );
}
