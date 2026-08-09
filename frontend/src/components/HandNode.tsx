import { useState } from "react";

interface HandNodeProps {
  letter: string;
  x: number;
  y: number;
  size?: number;
}

export default function HandNode({
  letter,
  x,
  y,
  size = 60,
}: HandNodeProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      style={{
        position: "absolute",

        left: x,
        top: y,

        width: size,
        height: size,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        pointerEvents: "none",

        zIndex: 2,
      }}
    >
      {!failed ? (
        <img
          src={`/hands/${letter}.svg`}
          alt={letter}
          draggable={false}
          onError={() => setFailed(true)}
          style={{
            width: "100%",
            height: "100%",

            objectFit: "contain",

            opacity: 0.62,

            userSelect: "none",
            pointerEvents: "none",

            filter:
              "drop-shadow(0 5px 10px rgba(15,23,42,0.12))",
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,

            borderRadius: "50%",

            background: "rgba(255,255,255,0.9)",

            border: "2px solid #CBD5E1",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "#475569",

            fontWeight: 700,
            fontSize: 20,

            boxShadow:
              "0 6px 14px rgba(15,23,42,0.10)",
          }}
        >
          {letter}
        </div>
      )}
    </div>
  );
}