import { motion } from "framer-motion";
import { useMemo } from "react";

import HandNode from "./HandNode";
import Connection from "./Connection";

interface FloatingWordProps {
  word: string;
  top: string;
  left: string;
  scale: number;
  duration: number;
}

interface LetterPosition {
  letter: string;
  x: number;
  y: number;
}

/*
 * Generates a deterministic organic shape.
 *
 * Important:
 * We DON'T use Math.random() here.
 * That would cause the letters to jump whenever React re-renders.
 */
function createPositions(word: string): LetterPosition[] {
  const patterns = [
    [0, 18, -8, 20, 2, -14, 10],
    [0, -14, 12, -6, 18, 0, -12],
    [0, 10, -16, 8, -10, 16, -4],
    [0, -8, 18, 2, -16, 10, -6],
    [0, 16, 4, -14, 12, -4, 16],
  ];

  /*
   * Pick a stable pattern based on the word.
   */
  let hash = 0;

  for (let i = 0; i < word.length; i++) {
    hash = word.charCodeAt(i) + ((hash << 5) - hash);
  }

  const pattern =
    patterns[Math.abs(hash) % patterns.length];

  let x = 0;

  return word.split("").map((letter, index) => {
    const point: LetterPosition = {
      letter,
      x,
      y: pattern[index % pattern.length],
    };

    /*
     * Slightly varied spacing.
     */
    x += index % 2 === 0 ? 76 : 82;

    return point;
  });
}

export default function FloatingWord({
  word,
  top,
  left,
  scale,
  duration,
}: FloatingWordProps) {
  const positions = useMemo(
    () => createPositions(word),
    [word]
  );

  return (
    <motion.div
      animate={{
        x: [0, 18, -14, 10, 0],
        y: [0, -14, 10, -8, 0],
        rotate: [0, 0.8, -0.7, 0.5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        position: "fixed",

        top,
        left,

        width: "max-content",
        height: "max-content",

        transform: `scale(${scale})`,

        pointerEvents: "none",

        zIndex: 0,
      }}
    >
      {/* Connections */}

      {positions.slice(0, -1).map((point, index) => {
        const next = positions[index + 1];

        return (
          <Connection
            key={`connection-${index}`}
            x1={point.x + 30}
            y1={point.y + 30}
            x2={next.x + 30}
            y2={next.y + 30}
          />
        );
      })}

      {/* Letter nodes */}

      {positions.map((point, index) => (
        <HandNode
          key={`${point.letter}-${index}`}
          letter={point.letter}
          x={point.x}
          y={point.y}
          size={58}
        />
      ))}
    </motion.div>
  );
}