import { useEffect, useState, type FormEvent } from "react";
import { io } from "socket.io-client";

const socket = io();

export function App() {
  useEffect(() => {
    socket.emit("test", "blub");
  });

  return (
    <>
      <div>Hello World</div>
    </>
  );
}
