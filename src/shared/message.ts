export interface ServerToClientEvents {}

export interface ClientToServerEvents {
  test: (msg: string) => void;
}
