import { Canvas } from "../components/Canvas";
import { EmojiToolbar } from "../components/EmojiToolbar";
import { useClientState } from "../useClientState";
import { DragDropProvider } from "@dnd-kit/react";
import { v4 as uuidv4 } from "uuid";

export function Game() {
  const { state, gameFunctions, ownPlayerId } = useClientState();

  const { updateCanvas, guess } = gameFunctions;

  return (
    <div>
      <h2>Games</h2>
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;

          const { target } = event.operation;

          const all = [...state.canvas.Emojis];
          const emj = all.find(
            (e) => e.id === event.operation.source?.data?.id,
          );

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
              console.log("Emoji found, updating position");
              emj.PlacementX = positionX;
              emj.PlacementY = positionY;
            }

            updateCanvas({ Emojis: all });
          }
        }}
      >
        <Canvas id="canvas" data={state.canvas.Emojis} />
        <EmojiToolbar />
      </DragDropProvider>
    </div>
  );
}
