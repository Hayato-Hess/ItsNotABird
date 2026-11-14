export const Emojis = ["1", "2"];

export function emojiUrl(id: string) {
  return new URL(`./${id}.png`, import.meta.url).href;
}
