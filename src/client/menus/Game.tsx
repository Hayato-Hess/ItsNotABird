import { useMemo } from "react";
import { Button } from "../components/Button";
import { Canvas } from "../components/Canvas";
import { Chat } from "../components/Chat";
import { EmojiToolbar } from "../components/EmojiToolbar";
import { useClientState } from "../useClientState";
import styles from "./Game.module.css";
import { DragDropProvider } from "@dnd-kit/react";
import { AutoScroller } from "@dnd-kit/dom";
import { v4 as uuidv4 } from "uuid";

export function Game() {
  const { state, gameFunctions, ownPlayerId } = useClientState();

  const isActivePlayer = useMemo(() => {
    return state.room?.gameState.currentActivePlayer === ownPlayerId;
  }, [state, ownPlayerId]);

  const { updateCanvas, guess } = gameFunctions;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DragDropProvider
        plugins={(defaults) => defaults.filter((p) => p !== AutoScroller)}
        onDragEnd={(event) => {
          if (event.canceled) return;

          const { target } = event.operation;

          let all = [...state.canvas.Emojis];
          const prevIndex = all.findIndex(
            (e) => e.id === event.operation.source?.data?.id,
          );
          const emj = prevIndex !== -1 ? all[prevIndex] : undefined;

          const dragged = event.operation.shape?.current.boundingRectangle;

          if (target === null && emj) {
            const index = all.findIndex((e) => e.id === emj.id);
            if (index !== -1) {
              all.splice(index, 1);
              updateCanvas({ Emojis: all });
            }
          }

          if (target?.id === "canvas") {
            const canvas = target.element;
            const canvasRect = canvas?.getBoundingClientRect();
            const positionX =
              dragged && canvas && canvasRect
                ? ((dragged.left - canvasRect.left - canvas.clientLeft) /
                    canvasRect.width) *
                  100
                : 0;
            const positionY =
              dragged && canvas && canvasRect
                ? ((dragged.top - canvasRect.top - canvas.clientTop) /
                    canvasRect.height) *
                  100
                : 0;

            if (!emj) {
              console.log("Emoji not found, adding new one");
              all.push({
                id: uuidv4(),
                emojieId: event.operation.source?.data?.emojieId || "",
                PlacementX: positionX,
                PlacementY: positionY,
              });
            } else {
              all.splice(prevIndex, 1);
              all.push({
                ...emj,
                PlacementX: positionX,
                PlacementY: positionY,
              });
            }

            updateCanvas({ Emojis: all });
          }
        }}
      >
        <div className={styles.layout}>
          <div className={styles.board}>
            <div className="box" style={{ padding: "0.5rem" }}>
              {isActivePlayer ? (
                <div>
                  {state.wordToGuess?.category || "???"}:{" "}
                  <span style={{ color: "var(--color-primary)" }}>
                    {state.wordToGuess?.word || "???"}{" "}
                  </span>
                </div>
              ) : (
                <div>
                  Category:{" "}
                  <span style={{ color: "var(--color-primary)" }}>
                    {state.wordToGuess?.category || "???"}
                  </span>
                </div>
              )}
            </div>

            <Canvas
              id="canvas"
              data={state.canvas.Emojis}
              disableInteraction={!isActivePlayer}
            />
            {isActivePlayer && <EmojiToolbar />}
          </div>
          <div className={styles.chat}>
            <Chat hideSend={isActivePlayer} />
          </div>
        </div>
      </DragDropProvider>
    </div>
  );
}
