import { useState } from "react";
import { InputField } from "../components/InputField";
import { useClientState } from "../useClientState";

export function RoomSelection() {
  const { mainMenuFunctions } = useClientState();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  return (
    <div>
      <InputField label="Name" value={name} onChange={setName} />
      <InputField label="Room Code" value={roomCode} onChange={setRoomCode} />
      <button onClick={() => mainMenuFunctions.joinRoom(name, roomCode)}>
        Join Room
      </button>
      <button onClick={() => mainMenuFunctions.createRoom(name)}>
        Create Room
      </button>
    </div>
  );
}
