import { useState } from "react";
import { InputField } from "../components/InputField";
import { useClientState } from "../useClientState";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import { Rules } from "../components/Rules";

export function RoomSelection() {
  const { mainMenuFunctions } = useClientState();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  return (
    <>
      <div
        className="box"
        style={{
          width: "100%",
          padding: "var(--padding-md)",
        }}
      >
        <Flex
          direction="row"
          gap="20px"
          justify="center"
          style={{ width: "100%", marginBottom: "20px" }}
        >
          <InputField
            label="Name"
            value={name}
            onChange={setName}
            width="200px"
          />
          <Button
            onClick={() => mainMenuFunctions.createRoom(name)}
            width="250px"
          >
            Create Room
          </Button>
        </Flex>
        <Flex
          direction="row"
          gap="20px"
          justify="center"
          style={{ width: "100%" }}
        >
          <InputField
            label="Room Code"
            value={roomCode}
            onChange={setRoomCode}
            width="200px"
          />
          <Button
            onClick={() => mainMenuFunctions.joinRoom(name, roomCode)}
            width="250px"
          >
            Join Room
          </Button>
        </Flex>
      </div>
      <Rules />
    </>
  );
}
