import { motion } from "framer-motion";

interface ConnectionProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default function Connection({
  x1,
  y1,
  x2,
  y2,
}: ConnectionProps) {
  const padding = 30;

  const minX = Math.min(x1, x2) - padding;
  const minY = Math.min(y1, y2) - padding;

  const width =
    Math.abs(x2 - x1) + padding * 2;

  const height =
    Math.abs(y2 - y1) + padding * 2;

  const startX = x1 - minX;
  const startY = y1 - minY;

  const endX = x2 - minX;
  const endY = y2 - minY;

  const midX =
    (startX + endX) / 2;

  /*
   * Slight curve instead of a straight line.
   */
  const curveDirection =
    startY < endY ? -1 : 1;

  const controlY =
    (startY + endY) / 2 +
    curveDirection * 14;

  const path = `
    M ${startX} ${startY}
    Q ${midX} ${controlY}
      ${endX} ${endY}
  `;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "absolute",
        left: minX,
        top: minY,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Static faint line */}
      <path
        d={path}
        fill="none"
        stroke="#FDBA74"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.2"
      />
      {/* Animated glowing energy pulse */}
      <motion.path
        d={path}
        fill="none"
        stroke="#F97316"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="15 35"
        animate={{
          strokeDashoffset: [50, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ filter: "drop-shadow(0 0 4px #F97316)" }}
        opacity="0.8"
      />
    </svg>
  );
}