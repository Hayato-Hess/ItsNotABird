import { createContext, useContext, useEffect, useState } from "react";
import { ClientToServerEvents, ServerToClientEvents } from "../shared/message";
import { type Socket } from "socket.io-client";
import { PlayerId } from "../shared/Data/PlayerId";
import { type Canvas } from "../shared/Data/Canvas/Canvas";
import { SharedRoom } from "../shared/Data/SharedRoom";
import { toast } from "react-toastify";
import { WordToGuess } from "../shared/Data/WordToGuess";
import { MessagePayload } from "../shared/Data/Messages/MessagePayload";

export interface ClientState {
  state: "main" | "lobby" | "game";
  room?: SharedRoom;
  canvas: Canvas;
  messages: MessagePayload[];
  wordToGuess?: WordToGuess;
}

export const INITIAL_GAME_STATE: ClientState = {
  state: "main",
  room: undefined,
  canvas: { Emojis: [] },
  messages: [],
};

const ClientStateContext = createContext<{
  state: ClientState;
  ownPlayerId: PlayerId;
  mainMenuFunctions: {
    joinRoom: (name: string, roomId: string) => void;
    createRoom: (name: string, rounds: number) => void;
  };
  lobbyFunctions: {
    toggleReadyness: () => void;
    sendMessage: (string: string) => void;
    leaveRoom: () => void;
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
    socket.emit("JoinRoom", name, roomId, (response) => {
      if (name.trim() == "") {
        toast.error("Name cannot be empty");
        return;
      }
      if (response.success) {
        updateState({ state: "lobby", room: response.data });
      } else {
        toast.error(response.error);
      }
    });
  };
  const createRoom = (name: string, rounds: number) => {
    if (name.trim() == "") {
      toast.error("Name cannot be empty");
      return;
    }
    socket.emit(
      "CreateRoom",
      name,
      Math.min(Math.max(rounds, 1), 9),
      (response) => {
        if (response.success) {
          updateState({ state: "lobby", room: response.data });
        } else {
          toast.error(response.error);
        }
      },
    );
  };

  const leaveRoom = () => {
    console.log("leave room client");
    socket.emit("LeaveRoom", (response) => {
      console.log("leave room client callback received");
      if (!response.success) {
        toast.error(response.error);
        return;
      }
      updateState({
        state: "main",
        room: undefined,
        canvas: { Emojis: [] },
        messages: [],
        wordToGuess: undefined,
      });
    });
  };

  const toggleReadyness = () => {
    socket.emit("ToggleReady", (response) => {
      if (!response.success) toast.error(response.error);
    });
  };

  const sendMessage = (msg: string) => {
    socket.emit("Message", msg, (response) => {
      if (!response.success) toast.error(response.error);
    });
  };

  const updateCanvas = (canvas: Canvas) => {
    socket.emit("UpdateCanvas", canvas, (response) => {
      if (!response.success) toast.error(response.error);
    });
    updateState({ canvas });
  };

  useEffect(() => {
    socket.on("RoomUpdate", (room) => {
      updateState({ room });
    });
    socket.on("GameStart", (newActivePlayer: PlayerId, category: string) => {
      updateState({
        state: "game",
        canvas: { Emojis: [] },
        wordToGuess: { word: "???", category: category },
      });
    });
    socket.on("UpdateCanvas", (canvas) => {
      updateState({ canvas });
    });
    socket.on("GameEnd", () => {
      updateState({
        canvas: { Emojis: [] },
        wordToGuess: { category: "Game Finished!", word: "???" },
      });
    });
    socket.on("Message", (msg) => {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, msg],
      }));
    });
    socket.on("WordToGuess", (word) => {
      updateState({ wordToGuess: word });
    });
    return () => {
      socket.off("RoomUpdate");
      socket.off("GameStart");
      socket.off("UpdateCanvas");
      socket.off("GameEnd");
      socket.off("Message");
      socket.off("WordToGuess");
    };
  }, [socket]);

  return (
    <ClientStateContext.Provider
      value={{
        state,
        ownPlayerId: socket.id as PlayerId,
        mainMenuFunctions: { joinRoom, createRoom },
        lobbyFunctions: { toggleReadyness, sendMessage, leaveRoom },
        gameFunctions: { guess: sendMessage, updateCanvas },
        toggleReadyness,
      }}
    >
      {children}
    </ClientStateContext.Provider>
  );
}
