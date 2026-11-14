import styles from "./DraggableEmojie.module.css";
import { emojiUrl } from "../emojies/emojies";
import { useDraggable } from "@dnd-kit/react";
import {
  Feedback,
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
} from "@dnd-kit/dom";
import { useEffect, useRef, useState } from "react";

const isHandle = (event: PointerEvent) =>
  event.target instanceof Element && !!event.target.closest("[data-handle]");

const sensors = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({ value: 5 }),
    ],
    preventActivation: isHandle,
  }),
  KeyboardSensor,
];

const mouseOnlySensors = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({ value: 5 }),
    ],
    preventActivation: (event) =>
      event.pointerType !== "mouse" || isHandle(event),
  }),
];

export type DraggableEmojieProps = {
  id: string;
  emojieId: string;
  scale?: number;
  rotation?: number;
  ghost?: boolean;
  disableDrag?: boolean;
  mouseDragOnly?: boolean;
  small?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onResize?: (newScale: number) => void;
  onRotate?: (newRotatin: number) => void;
};
export const DraggableEmojie = (props: DraggableEmojieProps) => {
  const { ref, isDragging } = useDraggable({
    id: props.id,
    data: {
      id: props.id,
      emojieId: props.emojieId,
    },
    disabled: props.disableDrag,
    sensors: props.mouseDragOnly ? mouseOnlySensors : sensors,
    plugins: [
      Feedback.configure({
        feedback: props.ghost ? "clone" : "default",
        dropAnimation: null,
      }),
    ],
  });

  // Lokale Werte während des Ziehens, werden erst beim Loslassen gespeichert
  const [liveScale, setLiveScale] = useState<number | null>(null);
  const [liveRotation, setLiveRotation] = useState<number | null>(null);
  const start = useRef<{
    mode: "scale" | "rotate";
    cx: number;
    cy: number;
    dist: number;
    angle: number;
    scale: number;
    rotation: number;
  } | null>(null);
  const scale = liveScale ?? props.scale ?? 1;
  const rotation = liveRotation ?? props.rotation ?? 0;

  useEffect(() => setLiveScale(null), [props.scale]);
  useEffect(() => setLiveRotation(null), [props.rotation]);

  const handleProps = (mode: "scale" | "rotate") => ({
    "data-handle": true,
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      const box = e.currentTarget.parentElement!.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      start.current = {
        mode,
        cx,
        cy,
        dist: Math.hypot(e.clientX - cx, e.clientY - cy),
        angle: Math.atan2(e.clientY - cy, e.clientX - cx),
        scale,
        rotation,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent) => {
      const s = start.current;
      if (!s) return;
      const dx = e.clientX - s.cx;
      const dy = e.clientY - s.cy;
      if (s.mode === "scale") {
        setLiveScale(Math.min(4, Math.max(0.3, (s.scale * Math.hypot(dx, dy)) / s.dist)));
      } else {
        setLiveRotation(s.rotation + ((Math.atan2(dy, dx) - s.angle) * 180) / Math.PI);
      }
    },
    onPointerUp: () => {
      const mode = start.current?.mode;
      start.current = null;
      if (mode === "scale" && liveScale !== null) props.onResize?.(liveScale);
      if (mode === "rotate" && liveRotation !== null) props.onRotate?.(liveRotation);
    },
  });

  return (
    <div
      ref={ref}
      className={`${styles.emojie} ${props.small ? styles.small : ""} ${props.mouseDragOnly ? styles.mouseDragOnly : ""}`}
    >
      <img
        onClick={props.onSelect}
        key={props.emojieId}
        src={emojiUrl(props.emojieId)}
        alt={props.emojieId}
        draggable={false}
        style={{
          opacity: props.ghost && isDragging ? 0.6 : 1,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          width: "100%",
          height: "100%",
        }}
      />
      {props.selected && (
        <div
          className={styles.frame}
          style={{
            inset: `${(1 - scale) * 50}%`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className={`${styles.handle} ${styles.scaleHandle}`} {...handleProps("scale")} />
          <div className={`${styles.handle} ${styles.rotateHandle}`} {...handleProps("rotate")} />
        </div>
      )}
    </div>
  );
};
