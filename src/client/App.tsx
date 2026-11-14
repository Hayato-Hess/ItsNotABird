import { Lobby } from "./menus/Lobby";
import { useClientState as useClientState } from "./useClientState";
import { RoomSelection } from "./menus/RoomSelection";
import { Game } from "./menus/Game";
import { Flex } from "./components/Flex";

export function App() {
  const { state } = useClientState();

  return (
    <Flex
      direction="column"
      style={{ width: "100%", height: "100dvh", overflow: "hidden" }}
    >
      <h1
        style={{
          textAlign: "center",
          background: "#ad4545",
          flex: "none",
          fontSize: "clamp(1rem, 4dvh, 2rem)",
          padding: "clamp(0.25rem, 2dvh, 1rem)",
          margin: "0 0 clamp(0.25rem, 2dvh, 1rem) 0",
        }}
      >
        It's not a Bird?!
      </h1>
      <Flex flex={1} justify="center" style={{ width: "100%", minHeight: 0 }}>
        <div
          style={{
            maxWidth: "60rem",
            width: "100%",
            minHeight: 0,
            overflowY: "auto",
            padding: "clamp(0.5rem, 2dvh, 1rem)",
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
