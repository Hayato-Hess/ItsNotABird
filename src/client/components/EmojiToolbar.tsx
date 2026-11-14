import { emojiUrl, Emojis } from "../emojies/emojies";
import { DraggableEmojie } from "./DraggableEmojie";

export function EmojiToolbar() {
  return (
    <div>
      <div>Emoji Toolbar</div>
      <div>
        {Emojis.map((emoji) => (
          <DraggableEmojie key={emoji} id={"new_" + emoji} emojieId={emoji} />
        ))}
      </div>
    </div>
  );
}
