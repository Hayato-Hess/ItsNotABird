export const Emojis = [
  "chesterhat",
  "cloud",
  "crown",
  "crown2",
  "dropblue",
  "dropred",
  "heart",
  "mood1",
  "mood2",
  "mood3",
];

export function emojiUrl(id: string) {
  return new URL(`./${id}.png`, import.meta.url).href;
}
