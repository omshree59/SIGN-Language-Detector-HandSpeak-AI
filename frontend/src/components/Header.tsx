import { motion } from "framer-motion";
import { Cpu, Activity, Sparkles } from "lucide-react";

interface HeaderProps {
  backendStatus: "connecting" | "connected" | "offline";
}

export default function Header({ backendStatus }: HeaderProps) {
  const statusColor =
    backendStatus === "connected"
      ? "#10B981"
      : backendStatus === "connecting"
      ? "#F59E0B"
      : "#EF4444";

  const statusTitle =
    backendStatus === "connected"
      ? "AI ONLINE"
      : backendStatus === "connecting"
      ? "CONNECTING..."
      : "AI OFFLINE";

  const statusSubtitle =
    backendStatus === "connected"
      ? "Backend Connected"
      : backendStatus === "connecting"
      ? "Connecting to Backend..."
      : "Model Not Connected";

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 28,
        padding: "4px 4px",
        color: "#0F172A",
      }}
    >
      {/* LEFT */}
      <div>
        <h1
          style={{
            fontSize: "3.2rem",
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            margin: "-10px 0 0 0", // Move it up slightly
            letterSpacing: "-1.5px",
          }}
        >
          <span style={{ color: "#431407" }}>
            Le
            <span style={{ position: "relative" }}>
              x
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.95rem",
                  textShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
              >
                🖐️
              </span>
            </span>
            i
          </span>
          <span style={{ position: "relative" }}>
            <span
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0px 2px 4px rgba(234,88,12,0.3))",
              }}
            >
              Cue
            </span>
            <span
              style={{
                position: "absolute",
                top: -8,
                left: "50%", // Centers it over the 'u' perfectly
                transform: "translateX(-50%)",
                fontSize: "0.95rem",
                textShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
            >
              🩺
            </span>
          </span>
        </h1>

        <p
          style={{
            margin: "7px 0 0",
            color: "#78350F",
            fontSize: 16,
          }}
        >
          Sign Language Translation Platform
        </p>

      </div>

      {/* RIGHT */}
      <div
        style={{
          textAlign: "right",
          marginTop: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 9,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: statusColor,
              boxShadow: `0 0 12px ${statusColor}`,
            }}
          />

          <span
            style={{
              color: "#431407",
              fontWeight: 800,
              fontSize: "1.45rem",
              letterSpacing: "-0.4px",
            }}
          >
            {statusTitle}
          </span>
        </div>

        <p
          style={{
            color: "#78350F",
            margin: "6px 0 0",
            fontSize: 13,
          }}
        >
          {statusSubtitle}
        </p>
      </div>
    </motion.header>
  );
}

function TechBadge({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "#78350F",
        fontSize: 14,
        fontWeight: 650,
      }}
    >
      {icon}
      {text}
    </div>
  );
}