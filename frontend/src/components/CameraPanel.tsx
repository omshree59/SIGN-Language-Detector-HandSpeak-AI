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
  currentSign,
  confidence,
  isCameraActive,
  toggleCamera,
}: CameraPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="card"
      style={{
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 22px",
          borderBottom: "1px solid #273549",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Camera color={isCameraActive ? "#3B82F6" : "#64748B"} size={22} />

          <h2
            style={{
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Live Camera
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={toggleCamera}
            style={{
              background: isCameraActive ? "#10B981" : "#EF4444",
              color: "#fff",
              borderRadius: 999,
              padding: "6px 14px",
              fontWeight: 700,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Power size={14} />
            {isCameraActive ? "LIVE" : "OFFLINE"}
          </button>
        </div>
      </div>

      {/* Camera */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          background: "#000",
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
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            color: "#64748B",
            flexDirection: "column",
            gap: "12px"
          }}>
            <Camera size={48} opacity={0.5} />
            <p>Camera is currently offline</p>
          </div>
        )}

        {/* Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,.75), transparent 45%)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />

        {/* Bottom Left Status */}
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            zIndex: 25,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <GlassTag
            title="Camera"
            value={isCameraActive ? "Active" : "Offline"}
            color={isCameraActive ? "#3B82F6" : "#EF4444"}
          />

          <GlassTag
            title="Model"
            value={isModelLoaded ? "Ready" : "Loading"}
            color={isModelLoaded ? "#10B981" : "#F59E0B"}
          />

          <GlassTag
            title="FPS"
            value={isCameraActive ? "30" : "0"}
            color={isCameraActive ? "#F59E0B" : "#64748B"}
          />
        </div>

        {/* Top Right */}
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
              background: "rgba(17,24,39,.75)",
              backdropFilter: "blur(18px)",
              border: "1px solid #334155",
              borderRadius: 14,
              padding: "12px 18px",
              color: isCameraActive ? "#10B981" : "#64748B",
              fontWeight: 700,
            }}
          >
            {isCameraActive ? "🟢 AI Vision Running" : "⚪ Vision Paused"}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          padding: 20,
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
        background: "rgba(17,24,39,.75)",
        backdropFilter: "blur(18px)",
        border: "1px solid #334155",
        borderRadius: 14,
        padding: "12px 18px",
        minWidth: 140,
      }}
    >
      <div
        style={{
          color: "#94A3B8",
          fontSize: 12,
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
      style={{
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: 16,
        padding: 18,
      }}
    >
      <div
        style={{
          color: "#60A5FA",
          marginBottom: 12,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#94A3B8",
          fontSize: 13,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontWeight: 700,
          marginTop: 5,
        }}
      >
        {value}
      </div>
    </div>
  );
}