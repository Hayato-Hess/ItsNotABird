import { createContext, useContext, useEffect, useState } from "react";
import { ClientToServerEvents, ServerToClientEvents } from "../shared/message";
import { type Socket } from "socket.io-client";
import { Player } from "../shared/Data/Player";
import { PlayerId } from "../shared/Data/PlayerId";

export interface ClientState {
  state: "main" | "lobby" | "game";
  players: Player[];
}

export const INITIAL_GAME_STATE: ClientState = {
  state: "main",
  players: [],
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
    socket.emit("JoinRoom", name, (roomId) => {});
    updateState({ state: "lobby" });
  };
  const createRoom = (name: string) => {
    socket.emit("CreateRoom", name, (room) => {
      console.log("Created room with ID:", room);
      updateState({ state: "lobby" });
    });
  };

  const toggleReadyness = () => {
    socket.emit("SetReady", true);
    //TODO websocket stuff
    updateState({ state: "game" });
  };

  useEffect(() => {
    //socket.on("test", (message) => {
    //  console.log(message);
    //});
    return () => {
      //socket.off("test");
    };
  }, [socket]);

  return (
    <ClientStateContext.Provider
      value={{
        state,
        ownPlayerId: socket.id as PlayerId,
        mainMenuFunctions: { joinRoom, createRoom },
        lobbyFunctions: { toggleReadyness },
        toggleReadyness,
      }}
    >
      {children}
    </ClientStateContext.Provider>
  );
}
