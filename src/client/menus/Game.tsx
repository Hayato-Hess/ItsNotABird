import { useEffect, useMemo, useState } from "react";
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
  const [selectedEmojiId, setSelectedEmojiId] = useState<string | undefined>(
    undefined,
  );

  const spawnEmoji = (emoji: string) => {
    const id = uuidv4();
    const all = [...state.canvas.Emojis];
    all.push({
      id,
      emojieId: emoji,
      PlacementX: 50,
      PlacementY: 50,
      Scale: 1,
      Rotation: 0,
    });
    updateCanvas({ Emojis: all });
    setSelectedEmojiId(id);
  };

  useEffect(() => {
    setSelectedEmojiId(undefined);
  }, [isActivePlayer]);

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
              const id = uuidv4();
              all.push({
                id: id,
                emojieId: event.operation.source?.data?.emojieId || "",
                PlacementX: positionX,
                PlacementY: positionY,
                Scale: 1,
                Rotation: 0,
              });
            } else {
              all.splice(prevIndex, 1);
              all.push({
                ...emj,
                PlacementX: positionX,
                PlacementY: positionY,
                Scale: emj.Scale,
                Rotation: emj.Rotation,
              });
            }

            updateCanvas({ Emojis: all });
            setSelectedEmojiId(all[all.length - 1].id);
          }
        }}
      >
        <div
          className={`${styles.layout} ${isActivePlayer ? "" : styles.guessing}`}
        >
          <div
            className={`${styles.board} ${isActivePlayer ? "" : styles.noToolbar}`}
          >
            <div className={`box ${styles.header}`}>
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
            <div className={styles.stage}>
              <div className={styles.canvasSlot}>
                <Canvas
                  id="canvas"
                  data={state.canvas.Emojis}
                  disableInteraction={!isActivePlayer}
                  selectedId={selectedEmojiId}
                  onSelect={setSelectedEmojiId}
                  onEmojyChange={(id, newScale, newRotation) => {
                    const emojiIndex = state.canvas.Emojis.findIndex(
                      (e) => e.id === id,
                    );
                    if (emojiIndex !== -1) {
                      const updatedEmojis = [...state.canvas.Emojis];
                      updatedEmojis[emojiIndex] = {
                        ...updatedEmojis[emojiIndex],
                        Scale: newScale,
                        Rotation: newRotation,
                      };
                      updateCanvas({ Emojis: updatedEmojis });
                    }
                  }}
                />
              </div>
              {isActivePlayer && (
                <div className={styles.toolbarSlot}>
                  <EmojiToolbar onClick={spawnEmoji} />
                </div>
              )}
            </div>
          </div>
          <div className={styles.chat}>
            <Chat hideSend={isActivePlayer} />
          </div>
        </div>
      </DragDropProvider>
    </div>
  );
}
