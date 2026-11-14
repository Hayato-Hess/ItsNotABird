import styles from "./Canvas.module.css";
import { CanvasEmoji } from "../../shared/Data/Canvas/CanvasEmoji";
import { useDroppable } from "@dnd-kit/react";
import { DraggableEmojie } from "./DraggableEmojie";

export type CanvasProps = {
  id: string;
  data: CanvasEmoji[];
  disableInteraction?: boolean;
  selectedId?: string;
  onSelect?: (id: string | undefined) => void;
};

export function Canvas(props: CanvasProps) {
  const { ref } = useDroppable({
    id: props.id,
    disabled: props.disableInteraction,
  });

  return (
    <div className={styles.canvas} ref={ref}>
      {props.data.map((emoji) => (
        <div
          key={emoji.id}
          style={{
            position: "absolute",
            left: `${emoji.PlacementX}%`,
            top: `${emoji.PlacementY}%`,
          }}
        >
          <DraggableEmojie
            id={emoji.id}
            emojieId={emoji.emojieId}
            disableDrag={props.disableInteraction}
            onSelect={() => {
              props.onSelect?.(emoji.id);
            }}
            selected={props.selectedId === emoji.id}
          />
        </div>
      ))}
    </div>
  );
}
