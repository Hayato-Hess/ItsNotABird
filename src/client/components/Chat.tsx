import { useEffect, useRef, useState } from "react";
import { useClientState } from "../useClientState";
import { Button } from "./Button";
import { Flex } from "./Flex";
import { MessageSource } from "../../shared/Data/Messages/MessageSource";

export type ChatProps = {
  hideSend?: boolean;
};

export function Chat(props: ChatProps) {
  const { state, gameFunctions, lobbyFunctions, ownPlayerId } =
    useClientState();
  const [msg, setMsg] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  useEffect(() => {
    const el = messagesRef.current;
    if (el && stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [state.messages.length]);

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
      className="box"
      style={{ padding: "20px" }}
    >
      <div
        ref={messagesRef}
        style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickToBottom.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < 30;
        }}
      >
        {state.messages.map((msg, index) => (
          <div key={index}>
            {msg.image && (
              <img
                src={msg.image}
                onLoad={() => {
                  const el = messagesRef.current;
                  if (el && stickToBottom.current) {
                    el.scrollTop = el.scrollHeight;
                  }
                }}
                style={{
                  display: "block",
                  maxWidth: "min(240px, 100%)",
                  borderRadius: "6px",
                  margin: "4px 0",
                  border: "1px solid #fff",
                }}
              />
            )}
            {msg.sender && (
              <span
                style={{
                  color: isYou(msg.sender) ? "var(--color-primary)" : "#999",
                }}
              >
                {getPlayerName(msg.sender)}:{" "}
              </span>
            )}
            <span
              style={{
                color:
                  msg.source === MessageSource.Server
                    ? "rgb(101, 193, 229)"
                    : undefined,
                fontSize:
                  msg.source === MessageSource.Server ? "0.7rem" : undefined,
              }}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      {!props.hideSend && (
        <Flex gap="10px" align="center">
          <input
            type="text"
            enterKeyHint="send"
            style={{ flex: 1, minWidth: 0 }}
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
            keepFocus
            onClick={() => {
              sendMessage();
            }}
          >
            Send
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
