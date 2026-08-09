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
            fontSize: "2.7rem",
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: 0,
            letterSpacing: "-1.5px",
            color: "#0F172A",
          }}
        >
          🤟 LexiCue
        </h1>

        <p
          style={{
            margin: "7px 0 0",
            color: "#475569",
            fontSize: 16,
          }}
        >
          Real-Time Sign Language Translation Platform
        </p>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          <TechBadge
            icon={<Cpu size={16} color="#2563EB" />}
            text="PyTorch"
          />

          <TechBadge
            icon={<Sparkles size={16} color="#10B981" />}
            text="MediaPipe"
          />

          <TechBadge
            icon={<Activity size={16} color="#8B5CF6" />}
            text="FastAPI"
          />
        </div>
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
              color: "#0F172A",
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
            color: "#64748B",
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
        color: "#334155",
        fontSize: 14,
        fontWeight: 650,
      }}
    >
      {icon}
      {text}
    </div>
  );
}