import { Button } from "./Button";
import { Flex } from "./Flex";

export function Chat() {
  return (
    <Flex
      direction="column"
      gap="10px"
      style={{ background: "red", padding: "10px" }}
    >
      <div>TODO CHAT</div>
      <div style={{ flex: 1, overflowY: "auto" }}></div>
      <input type="text" placeholder="Type a message..." />
      <Button
        onClick={() => {
          console.log("Send button clicked");
        }}
      >
        Send
      </Button>
    </Flex>
  );
}
