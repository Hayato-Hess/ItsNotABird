import { useState } from "react";
import { useClientState } from "../useClientState";
import { Button } from "./Button";
import { Flex } from "./Flex";

export type ChatProps = {
  hideSend?: boolean;
};

export function Chat(props: ChatProps) {
  const { state, gameFunctions, lobbyFunctions, ownPlayerId } =
    useClientState();
  const [msg, setMsg] = useState("");

  const players = state.room?.players ?? [];
  const isYou = (playerId: string) => playerId === ownPlayerId;
  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.Id === playerId);
    return player?.Name ?? playerId;
  };

  const sendMessage = () => {
    if (msg == "") {
      return;
    }
    if (state.state === "game") {
      gameFunctions.guess(msg);
    } else if (state.state === "lobby") {
      lobbyFunctions.sendMessage(msg);
    }
    setMsg("");
  };

  return (
    <Flex
      direction="column"
      gap="10px"
      style={{ border: "1px solid white", padding: "10px" }}
    >
      <div style={{ flex: 1, overflowY: "auto" }}>
        {state.messages.map((msg, index) => (
          <div key={index}>
            {msg.sender && (
              <span
                style={{
                  color: isYou(msg.sender) ? "var(--color-primary)" : "#999",
                }}
              >
                {getPlayerName(msg.sender)}:{" "}
              </span>
            )}
            {msg.message}
          </div>
        ))}
      </div>
      {!props.hideSend && (
        <>
          <input
            type="text"
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            autoFocus
          />
          <Button
            onClick={() => {
              sendMessage();
            }}
          >
            Send
          </Button>
        </>
      )}
    </Flex>
  );
}
