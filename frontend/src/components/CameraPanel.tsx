import { motion } from "framer-motion";
import { Camera, Cpu, Activity, Power } from "lucide-react";
import type { RefObject } from "react";

interface CameraPanelProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isModelLoaded: boolean;
  currentSign: string;
  confidence: number;
  isCameraActive: boolean;
  toggleCamera: () => void;
}

export default function CameraPanel({
  videoRef,
  canvasRef,
  isModelLoaded,
  isCameraActive,
  toggleCamera,
}: CameraPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-panel"
      style={{
        overflow: "hidden",
        position: "relative",
        borderRadius: 24,
      }}
    >
      {/* HEADER */}
      <div
        className="glass-divider"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 22px",
          borderBottom: "1px solid",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Camera
            color={isCameraActive ? "#2563EB" : "#94A3B8"}
            size={22}
          />

          <h2
            style={{
              fontWeight: 750,
              fontSize: 18,
              margin: 0,
              color: "#0F172A",
            }}
          >
            Live Camera
          </h2>
        </div>

        <button
          onClick={toggleCamera}
          style={{
            background: isCameraActive ? "#10B981" : "#EF4444",
            color: "#fff",
            borderRadius: 999,
            padding: "7px 15px",
            fontWeight: 700,
            fontSize: 13,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: `0 5px 18px ${
              isCameraActive
                ? "rgba(16,185,129,.25)"
                : "rgba(239,68,68,.25)"
            }`,
          }}
        >
          <Power size={14} />
          {isCameraActive ? "LIVE" : "OFFLINE"}
        </button>
      </div>

      {/* CAMERA */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          background: "#020617",
        }}
      >
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
              }}
            />

            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
                zIndex: 10,
              }}
            />
          </>
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#CBD5E1",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Camera size={48} opacity={0.5} />
            <p>Camera is currently offline</p>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(2,6,23,.78), transparent 45%)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />

        {/* CAMERA STATUS */}
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            zIndex: 25,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <GlassTag
            title="Camera"
            value={isCameraActive ? "Active" : "Offline"}
            color={isCameraActive ? "#60A5FA" : "#EF4444"}
          />

          <GlassTag
            title="Model"
            value={isModelLoaded ? "Ready" : "Loading"}
            color={isModelLoaded ? "#34D399" : "#F59E0B"}
          />

          <GlassTag
            title="FPS"
            value={isCameraActive ? "30" : "0"}
            color={isCameraActive ? "#FBBF24" : "#94A3B8"}
          />
        </div>

        {/* VISION STATUS */}
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            zIndex: 25,
          }}
        >
          <div
            style={{
              background: "rgba(15,23,42,.62)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,.2)",
              borderRadius: 14,
              padding: "11px 16px",
              color: isCameraActive ? "#34D399" : "#CBD5E1",
              fontWeight: 700,
            }}
          >
            {isCameraActive
              ? "🟢 AI Vision Running"
              : "⚪ Vision Paused"}
          </div>
        </div>
      </div>

      {/* BOTTOM INFO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          padding: 18,
        }}
      >
        <InfoCard
          icon={<Cpu size={20} />}
          title="MediaPipe"
          value="Loaded"
        />

        <InfoCard
          icon={<Activity size={20} />}
          title="Latency"
          value={isCameraActive ? "<20 ms" : "-"}
        />

        <InfoCard
          icon={<Camera size={20} />}
          title="Tracking"
          value={isCameraActive ? "1 Hand" : "None"}
        />
      </div>
    </motion.div>
  );
}

function GlassTag({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "rgba(15,23,42,.62)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,.18)",
        borderRadius: 12,
        padding: "9px 15px",
        minWidth: 125,
      }}
    >
      <div
        style={{
          color: "#CBD5E1",
          fontSize: 11,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,
          fontWeight: 700,
          marginTop: 3,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div
        style={{
          color: "#2563EB",
          marginBottom: 9,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#64748B",
          fontSize: 12,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#0F172A",
          fontWeight: 750,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}