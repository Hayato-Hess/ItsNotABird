export const EmojiCategories = {
  reactions: [
    "checkYes",
    "checkNo",
    "thumbs_up",
    "thumbs_down",
    "heart",
    "mood1",
    "mood2",
    "mood3",
    "mood4",
    "mood5",
  ],
  animals: ["dog", "mouse", "goose", "chonkyPidgeon"],
  fruits: [
    "fruitApple",
    "fruitBanana",
    "fruitCherry",
    "fruitLemon",
    "fruitMelon",
    "fruitOrange",
  ],
  weather: ["sun", "cloud", "rain", "storm", "snow", "rainbow", "moon", "star"],
  places: ["house", "factory", "skyline"],
  objects: ["crown", "crown2", "chesterhat", "gear", "slider"],
  colors: ["dropred", "dropyellow", "dropgreen", "dropblue"],
  shapes: [
    "geoCircle",
    "geoSquare",
    "geoRectangleH",
    "geoRectangleV",
    "geoTriangleUP",
    "geoTriangleDown",
    "geoTriangleLeft",
    "geoTriangleRight",
    "geoBlock",
    "geoCube",
    "geoPyramid",
    "geoCone",
  ],
} as const;

export const Emojis: string[] = Object.values(EmojiCategories).flat();

export function emojiUrl(id: string) {
  return new URL(`./${id}.png`, import.meta.url).href;
}
