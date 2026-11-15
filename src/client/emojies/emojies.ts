export const Emojis = [
  // Hinweise & Zahlen
  "1",
  "2",
  "3",
  "plus",
  "minus",
  "equal",
  "checkYes",
  "checkNo",
  "thumbs_up",
  "thumbs_down",
  "slider",

  // Stimmungen
  "mood1",
  "mood2",
  "mood3",
  "mood4",
  "mood5",
  "heart",
  "skull",

  // Menschen
  "male",
  "female",
  "malefemale",

  // Tiere
  "bunny",
  "cat",
  "dog",
  "mouse",
  "chonkyPidgeon",
  "goose",
  "fish",
  "turtle",
  "snake",

  // Obst
  "fruitApple",
  "fruitBanana",
  "fruitCherry",
  "fruitLemon",
  "fruitMelon",
  "fruitOrange",

  // Natur & Wetter
  "sun",
  "moon",
  "star",
  "earth",
  "cloud",
  "rain",
  "storm",
  "snow",
  "snowflake",
  "rainbow",
  "waves",
  "flame",
  "clover",

  // Orte & Gebäude
  "house",
  "factory",
  "skyline",

  // Gegenstände
  "crown",
  "crown2",
  "chesterhat",
  "shild",
  "gear",
  "lamp",
  "coin",
  "feather",
  "cigarette",

  // Farben
  "colorwheel",
  "dropred",
  "dropyellow",
  "dropgreen",
  "dropblue",

  // Formen
  "geoCircle",
  "geoSquare",
  "geoRectangleH",
  "geoRectangleV",
  "geoTriangleUP",
  "geoTriangleDown",
  "geoTriangleLeft",
  "geoTriangleRight",
  "geoCube",
  "geoBlock",
  "geoPyramid",
  "geoCone",
  "spiral",
];

export function emojiUrl(id: string) {
  return new URL(`./${id}.png`, import.meta.url).href;
}
