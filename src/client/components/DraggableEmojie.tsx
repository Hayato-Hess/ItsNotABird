import styles from "./DraggableEmojie.module.css";
import { emojiUrl } from "../emojies/emojies";
import { useDraggable } from "@dnd-kit/react";
import {
  Feedback,
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
} from "@dnd-kit/dom";

const sensors = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({ value: 5 }),
    ],
  }),
  KeyboardSensor,
];

export type DraggableEmojieProps = {
  id: string;
  emojieId: string;
  /** Original bleibt liegen, gezogen wird eine Kopie */
  ghost?: boolean;
};
export const DraggableEmojie = ({
  id,
  emojieId,
  ghost = false,
}: DraggableEmojieProps) => {
  const { ref, isDragging } = useDraggable({
    id,
    data: {
      id,
      emojieId,
    },
    sensors,
    plugins: [
      Feedback.configure({
        feedback: ghost ? "clone" : "default",
        dropAnimation: null,
      }),
    ],
  });
  return (
    <img
      ref={ref}
      key={emojieId}
      src={emojiUrl(emojieId)}
      alt={emojieId}
      draggable={false}
      className={styles.emojie}
      style={{ opacity: ghost && isDragging ? 0.6 : 1 }}
    />
  );
};
