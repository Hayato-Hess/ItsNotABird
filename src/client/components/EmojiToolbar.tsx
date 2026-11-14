import styles from "./EmojiToolbar.module.css";
import { Emojis } from "../emojies/emojies";
import { DraggableEmojie } from "./DraggableEmojie";
import { Flex } from "./Flex";

export function EmojiToolbar() {
  return (
    <Flex
      wrap
      gap="10px"
      justify="start"
      align="start"
      className={styles.toolbar}
    >
      {Emojis.map((emoji) => (
        <DraggableEmojie
          key={emoji}
          id={"new_" + emoji}
          emojieId={emoji}
          ghost
          small
        />
      ))}
    </Flex>
  );
}
