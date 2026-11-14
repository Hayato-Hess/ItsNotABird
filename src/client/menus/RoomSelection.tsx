import { useState } from "react";
import { InputField } from "../components/InputField";
import { useClientState } from "../useClientState";
import { Button } from "../components/Button";

export function RoomSelection() {
  const { mainMenuFunctions } = useClientState();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #fff",
        padding: "var(--padding-md)",
      }}
    >
      <InputField label="Name" value={name} onChange={setName} />

      <Button onClick={() => mainMenuFunctions.createRoom(name)}>
        Create Room
      </Button>
      <InputField label="Room Code" value={roomCode} onChange={setRoomCode} />
      <Button onClick={() => mainMenuFunctions.joinRoom(name, roomCode)}>
        Join Room
      </Button>
    </div>
  );
}
