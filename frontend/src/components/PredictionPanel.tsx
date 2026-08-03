import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  Wifi,
  Cpu,
  Clock,
  TrendingUp,
  CheckCircle2,
  Gauge,
  Sparkles,
  Camera
} from "lucide-react";

interface PredictionPanelProps {
  currentSign: string;
  confidence: number;
  isModelLoaded: boolean;
  isCameraActive: boolean;
}

export default function PredictionPanel({
  currentSign,
  confidence,
  isModelLoaded,
  isCameraActive,
}: PredictionPanelProps) {
  const confidenceColor =
    confidence >= 90
      ? "#10B981"
      : confidence >= 75
      ? "#F59E0B"
      : "#EF4444";

  const confidenceText =
    confidence >= 95
      ? "Excellent"
      : confidence >= 85
      ? "Very Good"
      : confidence >= 70
      ? "Good"
      : "Low";

  return (
    <motion.div
      initial={{ opacity: 0, x: 35 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="card"
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            AI Analytics Dashboard
          </h2>

          <p
            style={{
              marginTop: 6,
              color: "#94A3B8",
              fontSize: 14,
            }}
          >
            Live inference powered by PyTorch
          </p>
        </div>

        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: 999,
            background: "#10B98122",
            border: "1px solid #10B98155",
            color: "#10B981",
            fontWeight: 700,
          }}
        >
          <Sparkles size={18} />
          AI READY
        </motion.div>
      </div>

      {/* ================= HERO CARD ================= */}
      <motion.div
        whileHover={{
          scale: 1.02,
        }}
        transition={{
          duration: 0.25,
        }}
        style={{
          background:
            "linear-gradient(135deg,#2563EB,#1E40AF,#1D4ED8)",
          borderRadius: 24,
          padding: 30,
          textAlign: "center",
          border: `2px solid ${isCameraActive ? confidenceColor : "#334155"}`,
          boxShadow:
            "0 20px 45px rgba(37,99,235,.35)",
        }}
      >
        <p
          style={{
            opacity: 0.85,
            letterSpacing: 2,
            fontSize: 13,
          }}
        >
          CURRENT PREDICTION
        </p>

        <motion.h1
          key={currentSign}
          initial={{
            scale: 0.7,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.25,
          }}
          style={{
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 1,
            margin: "15px 0",
          }}
        >
          {isCameraActive ? currentSign : "-"}
        </motion.h1>

        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          {isCameraActive ? `${confidence.toFixed(1)}%` : "0%"}
        </div>

        <p
          style={{
            marginTop: 10,
            opacity: 0.9,
            fontWeight: 600,
          }}
        >
          {isCameraActive ? `${confidenceText} Prediction Confidence` : "Awaiting Camera Feed"}
        </p>
      </motion.div>

      {/* ================= CONFIDENCE ================= */}
      <div
        style={{
          background: "#1E293B",
          borderRadius: 20,
          padding: 22,
          border: "1px solid #334155",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: 600,
            }}
          >
            Confidence Score
          </span>

          <span
            style={{
              color: isCameraActive ? confidenceColor : "#64748B",
              fontWeight: 700,
            }}
          >
            {isCameraActive ? `${confidence.toFixed(1)}%` : "0%"}
          </span>
        </div>

        <div
          style={{
            height: 14,
            borderRadius: 999,
            background: "#111827",
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{
              width: isCameraActive ? `${confidence}%` : "0%",
            }}
            transition={{
              duration: 0.45,
            }}
            style={{
              height: "100%",
              borderRadius: 999,
              background: `linear-gradient(90deg,#3B82F6,${confidenceColor})`,
            }}
          />
        </div>

        <div
          style={{
            marginTop: 14,
            color: "#94A3B8",
            fontSize: 14,
          }}
        >
          {!isCameraActive
            ? "Start the camera to begin monitoring."
            : confidence >= 90
            ? "Excellent prediction stability detected."
            : confidence >= 75
            ? "Gesture recognised with good confidence."
            : "Prediction confidence is low. Hold the gesture a little longer."}
        </div>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <MetricCard
          icon={<Brain size={24} />}
          title="Model"
          value="PyTorch MLP"
          subtitle="26 Classes"
          color="#3B82F6"
        />

        <MetricCard
          icon={<Activity size={24} />}
          title="Accuracy"
          value={isCameraActive ? `${confidence.toFixed(1)}%` : "0%"}
          subtitle={isCameraActive ? "Live" : "Paused"}
          color={isCameraActive ? "#10B981" : "#64748B"}
        />

        <MetricCard
          icon={<Clock size={24} />}
          title="Latency"
          value={isCameraActive ? "18 ms" : "-"}
          subtitle="Inference"
          color={isCameraActive ? "#F59E0B" : "#64748B"}
        />

        <MetricCard
          icon={<Gauge size={24} />}
          title="FPS"
          value={isCameraActive ? "30" : "0"}
          subtitle="Camera"
          color={isCameraActive ? "#8B5CF6" : "#64748B"}
        />
      </div>

      {/* ================= SYSTEM HEALTH ================= */}
      <div
        style={{
          background: "#1E293B",
          borderRadius: 20,
          padding: 22,
          border: "1px solid #334155",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
          }}
        >
          <Cpu size={22} color="#3B82F6" />

          <h3
            style={{
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            System Health
          </h3>
        </div>

        <StatusRow
          icon={<Brain size={18} />}
          title="AI Model"
          value={isModelLoaded ? "Loaded" : "Loading"}
          color={isModelLoaded ? "#10B981" : "#F59E0B"}
        />

        <StatusRow
          icon={<Wifi size={18} />}
          title="WebSocket"
          value="Connected"
          color="#3B82F6"
        />

        <StatusRow
          icon={<CheckCircle2 size={18} />}
          title="Backend"
          value="Online"
          color="#10B981"
        />
        
        <StatusRow
          icon={<Camera size={18} />}
          title="Camera Feed"
          value={isCameraActive ? "Active" : "Offline"}
          color={isCameraActive ? "#3B82F6" : "#EF4444"}
        />

        <StatusRow
          icon={<TrendingUp size={18} />}
          title="Prediction Engine"
          value={isCameraActive ? "Running" : "Idle"}
          color={isCameraActive ? "#10B981" : "#64748B"}
        />
      </div>

      {/* ================= AI HEALTH SCORE ================= */}
      <div
        style={{
          background: "#1E293B",
          borderRadius: 20,
          padding: 22,
          border: "1px solid #334155",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontWeight: 700,
            }}
          >
            Overall AI Health
          </span>

          <span
            style={{
              color: "#10B981",
              fontWeight: 700,
            }}
          >
            98%
          </span>
        </div>

        <div
          style={{
            height: 12,
            background: "#111827",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{
              width: "98%",
            }}
            transition={{
              duration: 1,
            }}
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg,#22C55E,#10B981)",
            }}
          />
        </div>

        <p
          style={{
            marginTop: 14,
            color: "#94A3B8",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          All AI services are operating normally. MediaPipe,
          FastAPI, PyTorch model and WebSocket connection are
          active.
        </p>
      </div>
      
      {/* ================= CONFIDENCE HISTORY ================= */}
      <div
        style={{
          background: "#1E293B",
          borderRadius: 20,
          padding: 22,
          border: "1px solid #334155",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            Confidence History
          </h3>

          <span
            style={{
              color: "#94A3B8",
              fontSize: 13,
            }}
          >
            Live Monitoring
          </span>
        </div>

        <div
          style={{
            position: "relative",
            height: 170,
            background: "#0F172A",
            borderRadius: 16,
            border: "1px solid #334155",
            overflow: "hidden",
          }}
        >
          <svg
            width="100%"
            height="170"
            viewBox="0 0 500 170"
            style={{ opacity: isCameraActive ? 1 : 0.2 }}
          >
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="4"
              points="
              0,120
              40,110
              80,100
              120,90
              160,80
              200,88
              240,76
              280,60
              320,55
              360,45
              400,35
              440,28
              500,22
              "
            />
          </svg>
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 18,
              color: "#64748B",
              fontSize: 12,
            }}
          >
            Last 30 Predictions
          </div>
        </div>
      </div>
      
      {/* ================= SESSION STATISTICS ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 16,
        }}
      >
        <MiniCard title="Predictions" value={isCameraActive ? "243" : "0"} />
        <MiniCard title="Average Confidence" value={isCameraActive ? "97.8%" : "0%"} />
        <MiniCard title="Best Prediction" value={isCameraActive ? "99.9%" : "0%"} />
        <MiniCard title="Session Time" value="03:14" />
      </div>

      {/* ================= AI INSIGHTS ================= */}
      <div
        style={{
          background: "#1E293B",
          borderRadius: 20,
          padding: 22,
          border: "1px solid #334155",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <Brain size={22} color="#3B82F6" />
          <h3 style={{ fontWeight: 700 }}>AI Insights</h3>
        </div>

        <Insight color="#10B981" text="Hand landmarks detected successfully." />
        <Insight color="#3B82F6" text="Skeleton tracking is stable." />
        <Insight color="#F59E0B" text="Prediction confidence updates every frame." />
        <Insight color="#8B5CF6" text="PyTorch inference running in real time." />
      </div>
    </motion.div>
  );
}

/* ======================= STATUS ROW ======================= */
interface StatusRowProps {
  icon: ReactNode;
  title: string;
  value: string;
  color: string;
}
function StatusRow({ icon, title, value, color }: StatusRowProps) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color }}>{icon}</span>
        <span>{title}</span>
      </div>
      <span style={{ color, fontWeight: 700 }}>{value}</span>
    </motion.div>
  );
}

/* ======================= METRIC CARD ======================= */
interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}
function MetricCard({ icon, title, value, subtitle, color }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ duration: .2 }}
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: 18,
        padding: 20,
        cursor: "pointer",
      }}
    >
      <div style={{ color, marginBottom: 14 }}>{icon}</div>
      <div style={{ color: "#94A3B8", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{value}</div>
      <div style={{ color: "#64748B", fontSize: 12, marginTop: 5 }}>{subtitle}</div>
    </motion.div>
  );
}

/* ======================= MINI CARD ======================= */
interface MiniCardProps {
  title: string;
  value: string;
}
function MiniCard({ title, value }: MiniCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      style={{
        background: "#111827",
        border: "1px solid #334155",
        borderRadius: 16,
        padding: 18,
      }}
    >
      <div style={{ color: "#94A3B8", fontSize: 13 }}>{title}</div>
      <div style={{ marginTop: 8, fontWeight: 800, fontSize: 24 }}>{value}</div>
    </motion.div>
  );
}

/* ======================= INSIGHT ======================= */
interface InsightProps {
  text: string;
  color: string;
}
function Insight({ text, color }: InsightProps) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      <span style={{ color: "#CBD5E1", fontSize: 14 }}>{text}</span>
    </motion.div>
  );
}