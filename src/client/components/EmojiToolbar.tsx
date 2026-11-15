import styles from "./EmojiToolbar.module.css";
import { Emojis } from "../emojies/emojies";
import { DraggableEmojie } from "./DraggableEmojie";
import { Flex } from "./Flex";

export type EmojieToolbarProps = {
  onClick: (emoji: string) => void;
};

export function EmojiToolbar(props: EmojieToolbarProps) {
  return (
    <Flex
      wrap
      gap="10px"
      justify="start"
      align="start"
      className={styles.toolbar}
    >
      {Emojis.map((emoji) => (
        <div key={emoji} onClick={() => props.onClick(emoji)}>
          <DraggableEmojie
            id={"new_" + emoji}
            emojieId={emoji}
            ghost
            mouseDragOnly
            small
          />
        </div>
      ))}
    </Flex>
  );
}
