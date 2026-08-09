import FloatingWord from "./FloatingWord";
import { backgroundWords } from "../data/backgroundWords";

export default function Background() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,

        width: "100vw",
        height: "100vh",

        overflow: "hidden",

        pointerEvents: "none",

        zIndex: 1,
      }}
    >
      {backgroundWords.map((item, index) => (
        <FloatingWord
          key={`${item.word}-${index}`}
          word={item.word}
          top={item.top}
          left={item.left}
          scale={item.scale}
          duration={item.duration}
        />
      ))}
    </div>
  );
}