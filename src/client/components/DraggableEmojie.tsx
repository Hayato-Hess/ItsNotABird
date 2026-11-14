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
  ghost?: boolean;
  disableDrag?: boolean;
  small?: boolean;
};
export const DraggableEmojie = (props: DraggableEmojieProps) => {
  const { ref, isDragging } = useDraggable({
    id: props.id,
    data: {
      id: props.id,
      emojieId: props.emojieId,
    },
    disabled: props.disableDrag,
    sensors,
    plugins: [
      Feedback.configure({
        feedback: props.ghost ? "clone" : "default",
        dropAnimation: null,
      }),
    ],
  });
  return (
    <img
      ref={ref}
      key={props.emojieId}
      src={emojiUrl(props.emojieId)}
      alt={props.emojieId}
      draggable={false}
      className={`${styles.emojie} ${props.small ? styles.small : ""}`}
      style={{ opacity: props.ghost && isDragging ? 0.6 : 1 }}
    />
  );
};
