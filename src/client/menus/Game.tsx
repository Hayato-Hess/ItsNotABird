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

  const overlap = (
    a: { pX: number; pY: number; scale: number; rotaion: number },
    b: { pX: number; pY: number; scale: number; rotaion: number },
  ): boolean => {
    const DEFAULT_SIZE = 10;

    const scaledPaddingA = (DEFAULT_SIZE * a.scale) / 2;
    const scaledPaddingB = (DEFAULT_SIZE * b.scale) / 2;

    const aLeft = a.pX - scaledPaddingA;
    const aRight = a.pX + scaledPaddingA;
    const aTop = a.pY - scaledPaddingA;
    const aBottom = a.pY + scaledPaddingA;

    const bLeft = b.pX - scaledPaddingB;
    const bRight = b.pX + scaledPaddingB;
    const bTop = b.pY - scaledPaddingB;
    const bBottom = b.pY + scaledPaddingB;

    if (aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom) {
      return false;
    }

    return true;
  };

  const isFreePositoin = (pos: {
    pX: number;
    pY: number;
    scale: number;
    rotaion: number;
  }): boolean => {
    return !state.canvas.Emojis.some((v) =>
      overlap(pos, {
        pX: v.PlacementX,
        pY: v.PlacementY,
        rotaion: v.Rotation,
        scale: v.Scale,
      }),
    );
  };

  const spawnEmoji = (emoji: string) => {
    const id = uuidv4();
    const all = [...state.canvas.Emojis];
    for (let y = 0; y < 90; y++) {
      for (let x = 0; x < 90; x++) {
        if (isFreePositoin({ pX: x, pY: y, scale: 1, rotaion: 0 })) {
          all.push({
            id,
            emojieId: emoji,
            PlacementX: x,
            PlacementY: y,
            Scale: 1,
            Rotation: 0,
          });
          updateCanvas({ Emojis: all });
          setSelectedEmojiId(id);
          return;
        }
      }
    }
    //fallback to center
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

  const updateEmoji = (id: string, newScale: number, newRotation: number) => {
    const emojiIndex = state.canvas.Emojis.findIndex((e) => e.id === id);
    if (emojiIndex !== -1) {
      const updatedEmojis = [...state.canvas.Emojis];
      updatedEmojis[emojiIndex] = {
        ...updatedEmojis[emojiIndex],
        Scale: newScale,
        Rotation: newRotation,
      };
      updateCanvas({ Emojis: updatedEmojis });
    }
  };

  const deleteEmoji = (id: string) => {
    const emojiIndex = state.canvas.Emojis.findIndex((e) => e.id === id);
    if (emojiIndex !== -1) {
      const updatedEmojis = [...state.canvas.Emojis];
      updatedEmojis.splice(emojiIndex, 1);
      updateCanvas({ Emojis: updatedEmojis });
    }
  };

  const giveUp = () => {
    gameFunctions.giveUp();
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
                  onEmojyChange={updateEmoji}
                  onDelete={deleteEmoji}
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
            <Chat
              hideSend={isActivePlayer}
              showGiveUp={isActivePlayer}
              onGiveUp={giveUp}
            />
          </div>
        </div>
      </DragDropProvider>
    </div>
  );
}
