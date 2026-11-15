import styles from "./Canvas.module.css";
import { CanvasEmoji } from "../../shared/Data/Canvas/CanvasEmoji";
import { useDroppable } from "@dnd-kit/react";
import { DraggableEmojie } from "./DraggableEmojie";
import { useEffect } from "react";

export type CanvasProps = {
  id: string;
  data: CanvasEmoji[];
  disableInteraction?: boolean;
  selectedId?: string;
  onSelect?: (id: string | undefined) => void;
  onEmojyChange?: (id: string, newScale: number, newRotation: number) => void;
  onDelete?: (id: string) => void;
};

export function Canvas(props: CanvasProps) {
  const { ref } = useDroppable({
    id: props.id,
    disabled: props.disableInteraction,
  });

  const { selectedId, onSelect } = props;
  useEffect(() => {
    if (!selectedId) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        !(
          e.target instanceof Element && e.target.closest("[data-canvas-emoji]")
        )
      ) {
        onSelect?.(undefined);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [selectedId, onSelect]);

  return (
    <div className={`${styles.canvas} box`} ref={ref} data-canvas-id={props.id}>
      {props.data.map((emoji) => (
        <div
          key={emoji.id}
          data-canvas-emoji
          style={{
            position: "absolute",
            left: `${emoji.PlacementX}%`,
            top: `${emoji.PlacementY}%`,
          }}
        >
          <DraggableEmojie
            id={emoji.id}
            emojieId={emoji.emojieId}
            scale={emoji.Scale}
            rotation={emoji.Rotation}
            disableDrag={props.disableInteraction}
            onSelect={() => {
              if (props.disableInteraction) return;
              props.onSelect?.(emoji.id);
            }}
            selected={props.selectedId === emoji.id}
            onResize={(v) => {
              props.onEmojyChange?.(emoji.id, v, emoji.Rotation);
            }}
            onRotate={(v) => {
              props.onEmojyChange?.(emoji.id, emoji.Scale, v);
            }}
            onDelete={() => props.onDelete?.(emoji.id)}
          />
        </div>
      ))}
    </div>
  );
}
