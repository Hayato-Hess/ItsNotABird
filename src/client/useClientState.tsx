import { createContext, useContext, useEffect, useState } from "react";
import { ClientToServerEvents, ServerToClientEvents } from "../shared/message";
import { type Socket } from "socket.io-client";

export interface ClientState {
  state: "main" | "lobby" | "game";
}

export const INITIAL_GAME_STATE: ClientState = {
  state: "main",
};

const ClientStateContext = createContext<{
  state: ClientState;
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
    //TODO websocket stuff
    updateState({ state: "lobby" });
  };
  const createRoom = (name: string) => {
    //TODO websocket stuff
    updateState({ state: "lobby" });
  };

  const toggleReadyness = () => {
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
        mainMenuFunctions: { joinRoom, createRoom },
        lobbyFunctions: { toggleReadyness },
        toggleReadyness,
      }}
    >
      {children}
    </ClientStateContext.Provider>
  );
}
