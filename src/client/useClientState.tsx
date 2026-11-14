import { createContext, useContext, useEffect, useState } from "react";
import { ClientToServerEvents, ServerToClientEvents } from "../shared/message";
import { type Socket } from "socket.io-client";
import { PlayerId } from "../shared/Data/PlayerId";
import { type Canvas } from "../shared/Data/Canvas/Canvas";
import { SharedRoom } from "../shared/Data/SharedRoom";

export interface ClientState {
  state: "main" | "lobby" | "game";
  room?: SharedRoom;
  canvas: Canvas;
}

export const INITIAL_GAME_STATE: ClientState = {
  state: "main",
  room: undefined,
  canvas: { Emojis: [] },
};

const ClientStateContext = createContext<{
  state: ClientState;
  ownPlayerId: PlayerId;
  mainMenuFunctions: {
    joinRoom: (name: string, roomId: string) => void;
    createRoom: (name: string) => void;
  };
  lobbyFunctions: {
    toggleReadyness: () => void;
    sendMessage: (string: string) => void;
  };
  gameFunctions: {
    guess: (string: string) => void;
    updateCanvas: (canvas: Canvas) => void;
  };
  toggleReadyness: () => void;
}>(null as never);

export function useClientState() {
  return useContext(ClientStateContext);
}

export function ClientStateProvider({
  socket,
  children,
}: {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ClientState>(INITIAL_GAME_STATE);

  const updateState = (update: Partial<ClientState>) => {
    setState((prev) => ({ ...prev, ...update }));
  };

  const joinRoom = (name: string, roomId: string) => {
    socket.emit("JoinRoom", name, roomId, (room) => {
      updateState({ state: "lobby", room });
    });
  };
  const createRoom = (name: string) => {
    console.log("Creating room with name:", name);
    socket.emit("CreateRoom", name, (room) => {
      updateState({ state: "lobby", room });
    });
  };

  const toggleReadyness = () => {
    socket.emit("SetReady", true);
    updateState({ state: "game" });
  };

  const sendMessage = (msg: string) => {
    socket.emit("Message", msg);
  };

  const updateCanvas = (canvas: Canvas) => {
    socket.emit("UpdateCanvas", canvas);
    updateState({ canvas });
  };

  useEffect(() => {
    socket.on("RoomUpdate", (room) => {
      updateState({ room });
    });
    socket.on("GameStart", () => {
      updateState({ state: "game", canvas: { Emojis: [] } });
    });
    socket.on("UpdateCanvas", (canvas) => {
      updateState({ canvas });
    });
    socket.on("GameEnd", () => {
      updateState({ state: "lobby" });
    });
    return () => {
      socket.off("RoomUpdate");
      socket.off("GameStart");
      socket.off("UpdateCanvas");
      socket.off("GameEnd");
    };
  }, [socket]);

  return (
    <ClientStateContext.Provider
      value={{
        state,
        ownPlayerId: socket.id as PlayerId,
        mainMenuFunctions: { joinRoom, createRoom },
        lobbyFunctions: { toggleReadyness, sendMessage },
        gameFunctions: { guess: sendMessage, updateCanvas },
        toggleReadyness,
      }}
    >
      {children}
    </ClientStateContext.Provider>
  );
}
