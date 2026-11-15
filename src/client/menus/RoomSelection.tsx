import { useState } from "react";
import { InputField } from "../components/InputField";
import { useClientState } from "../useClientState";
import { Button } from "../components/Button";
import { Rules } from "../components/Rules";
import { toast } from "react-toastify";
import { Flex } from "../components/Flex";

export function RoomSelection() {
  const [mode, setMode] = useState<"name" | "room">("name");
  const { mainMenuFunctions } = useClientState();
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const onPlay = () => {
    if (name.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }
    setMode("room");
  };

  return (
    <>
      <div
        className="box"
        style={{
          width: "100%",
          padding: "var(--padding-md)",
        }}
      >
        {mode === "name" ? (
          <Flex gap={"20px"} wrap justify="center">
            <InputField
              label="Name"
              value={name}
              onChange={setName}
              width="200px"
            />
            <Button onClick={onPlay} width="250px">
              Play
            </Button>
          </Flex>
        ) : (
          <div>
            <p style={{ textAlign: "center" }}>
              Welcome{" "}
              <span style={{ color: "var(--color-primary)" }}>{name}</span>
            </p>
            <Flex gap="20px" wrap justify="center">
              <Button
                onClick={() => mainMenuFunctions.createRoom(name)}
                width="250px"
              >
                Create Room
              </Button>
              <div style={{ background: "#fff", width: "1px" }} />
              <Flex direction="column">
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
            </Flex>
          </div>
        )}
      </div>
      <Rules />
    </>
  );
}
