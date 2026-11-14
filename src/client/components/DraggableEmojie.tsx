import { emojiUrl } from "../emojies/emojies";
import { useDraggable } from "@dnd-kit/react";

export type DraggableEmojieProps = {
  id: string;
  emojieId: string;
};
export const DraggableEmojie = ({ id, emojieId }: DraggableEmojieProps) => {
  const { ref } = useDraggable({
    id,
    data: {
      id,
      emojieId,
    },
  });
  return (
    <img ref={ref} key={emojieId} src={emojiUrl(emojieId)} alt={emojieId} />
  );
};
