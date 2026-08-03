import { motion } from "framer-motion";
import { Cpu, Activity, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
      style={{
        padding: "28px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
      }}
    >
      {/* Left */}
      <div>
        <h1
          style={{
            fontSize: "2.3rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          🤟 HandSpeak AI
        </h1>

        <p
          style={{
            marginTop: "8px",
            color: "#94A3B8",
            fontSize: "15px",
          }}
        >
          Real-Time Sign Language Translation Platform
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "18px",
            flexWrap: "wrap",
          }}
        >
          <TechBadge
            icon={<Cpu size={16} />}
            text="PyTorch"
          />

          <TechBadge
            icon={<Sparkles size={16} />}
            text="MediaPipe"
          />

          <TechBadge
            icon={<Activity size={16} />}
            text="FastAPI"
          />
        </div>
      </div>

      {/* Right */}
      <div
        className="glass"
        style={{
          padding: "18px 26px",
          borderRadius: "18px",
          border: "1px solid #334155",
          textAlign: "center",
          minWidth: "180px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 12px #10B981",
            }}
          />

          <span
            style={{
              fontWeight: 700,
              color: "#10B981",
            }}
          >
            AI READY
          </span>
        </div>

        <p
          style={{
            color: "#94A3B8",
            marginTop: "8px",
            fontSize: "13px",
          }}
        >
          Model Loaded Successfully
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
        gap: "8px",
        background: "#1E293B",
        padding: "8px 14px",
        borderRadius: "999px",
        border: "1px solid #334155",
        color: "#E2E8F0",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      {icon}
      {text}
    </div>
  );
}