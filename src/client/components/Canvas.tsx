import { useEffect, useRef } from "react";
import { CanvasEmoji } from "../../shared/Data/Canvas/CanvasEmoji";
import { emojiUrl } from "../emojies/emojies";
import styles from "./Canvas.module.css";
import { useDroppable } from "@dnd-kit/react";
import { DraggableEmojie } from "./DraggableEmojie";

export type CanvasProps = {
  id: string;
  data: CanvasEmoji[];
};

export function Canvas(props: CanvasProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  const { ref } = useDroppable({
    id: props.id,
  });

  return (
    <div className={styles.canvas} ref={ref}>
      {props.data.map((emoji) => (
        <div
          key={emoji.id}
          style={{
            position: "absolute",
            left: emoji.PlacementX,
            top: emoji.PlacementY,
          }}
        >
          <DraggableEmojie
            id={emoji.id}
            emojieId={emoji.emojieId}
          />
        </div>
      ))}
    </div>
  );
}
