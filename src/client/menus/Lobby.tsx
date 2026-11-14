import { useClientState } from "../useClientState";

export interface LobbyProps {}

export function Lobby(props: LobbyProps) {
  const { toggleReadyness } = useClientState();
  return (
    <div>
      <button onClick={toggleReadyness}>Ready</button>
    </div>
  );
}
