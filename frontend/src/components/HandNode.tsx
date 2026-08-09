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
              "drop-shadow(0 5px 10px rgba(234,88,12,0.15))",
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,

            borderRadius: "50%",

            background: "rgba(255,237,213,0.9)",

            border: "2px solid #FDBA74",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "#9A3412",

            fontWeight: 700,
            fontSize: 20,

            boxShadow:
              "0 6px 14px rgba(234,88,12,0.12)",
          }}
        >
          {letter}
        </div>
      )}
    </div>
  );
}