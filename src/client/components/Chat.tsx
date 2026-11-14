import { useState } from "react";
import { useClientState } from "../useClientState";
import { Button } from "./Button";
import { Flex } from "./Flex";

export type ChatProps = {
  hideSend?: boolean;
};

export function Chat(props: ChatProps) {
  const { state, gameFunctions, lobbyFunctions } = useClientState();
  const [msg, setMsg] = useState("");

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
      style={{ background: "red", padding: "10px" }}
    >
      <div>TODO CHAT</div>
      <div style={{ flex: 1, overflowY: "auto" }}></div>
      {!props.hideSend && (
        <>
          <input
            type="text"
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
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
