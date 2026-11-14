import { emojiUrl } from "../emojies/emojies";
import { useDraggable } from "@dnd-kit/react";
import { Feedback } from "@dnd-kit/dom";

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
      style={{ opacity: ghost && isDragging ? 0.6 : 1 }}
    />
  );
};
