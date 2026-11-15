import { Lobby } from "./menus/Lobby";
import { useClientState as useClientState } from "./useClientState";
import { RoomSelection } from "./menus/RoomSelection";
import { Game } from "./menus/Game";
import { Flex } from "./components/Flex";
import { useEffect, useState } from "react";
import { emojiUrl } from "./emojies/emojies";

/** Pixel scale of the header background (top-bg.png). */
const TOP_BG_SCALE = 2;

const titleEmojiStyle = {
  height: "1.2em",
  verticalAlign: "-0.1em",
  marginInline: "0.25em",
  imageRendering: "pixelated",
} as const;

/**
 * Height of the actually visible area. Shrinks when the on-screen keyboard
 * opens (also on iOS, where dvh does not react to the keyboard).
 */
function useVisibleHeight() {
  const [height, setHeight] = useState<number | undefined>(
    () => window.visualViewport?.height,
  );

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      // * scale so pinch-zooming doesn't shrink the layout, only the keyboard does
      setHeight(vv.height * vv.scale);
      // iOS pans the page to the focused input, undo that – our layout already fits
      if (vv.scale === 1 && window.scrollY !== 0) window.scrollTo(0, 0);
    };
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return height;
}

export function App() {
  const { state } = useClientState();
  const visibleHeight = useVisibleHeight();
  const hideTitle =
    state.state === "game" &&
    visibleHeight !== undefined &&
    visibleHeight < 600;

  return (
    <Flex
      direction="column"
      style={{
        width: "100%",
        height: visibleHeight ? `${visibleHeight}px` : "100dvh",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          borderStyle: "solid",
          borderWidth: `0 ${13 * TOP_BG_SCALE}px ${6 * TOP_BG_SCALE}px`,
          borderImageSource: "url(/top-bg.png)",
          borderImageSlice: "0 13 6 fill",
          borderImageRepeat: "stretch",
          imageRendering: "pixelated",
          flex: "none",
          fontSize: "clamp(1rem, 4dvh, 2rem)",
          // Shift text 4px down so it looks centered including the decorative edge.
          paddingInline: "clamp(0.25rem, 2dvh, 1rem)",
          paddingTop: "calc(clamp(0.25rem, 2dvh, 1rem) + 4px)",
          paddingBottom: "calc(clamp(0.25rem, 2dvh, 1rem) - 4px)",
          margin: "0 0 clamp(0.25rem, 2dvh, 1rem) 0",
          display: hideTitle ? "none" : undefined,
        }}
      >
        <img src={emojiUrl("think")} alt="" style={titleEmojiStyle} />
        It's not a Bird?!
        <img src={emojiUrl("birdplane")} alt="" style={titleEmojiStyle} />
      </h1>
      <Flex flex={1} justify="center" style={{ width: "100%", minHeight: 0 }}>
        <div
          style={{
            maxWidth: "60rem",
            width: "100%",
            minHeight: 0,
            overflowY: "auto",
            padding: "clamp(0.5rem, 2dvh, 1rem)",
          }}
        >
          {state.state === "main" && <RoomSelection />}
          {state.state === "lobby" && <Lobby />}
          {state.state === "game" && <Game />}
        </div>
      </Flex>
    </Flex>
  );
}
