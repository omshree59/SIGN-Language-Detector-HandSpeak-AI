import { motion } from "framer-motion";

import type {
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import {
  Type,
  Copy,
  Delete,
  Trash2,
  Volume2,
  FileText,
  Sparkles,
  Wand2,
} from "lucide-react";

interface SentencePanelProps {
  sentence: string;
 setSentence: Dispatch<SetStateAction<string>>;
  uiHoldCount: number;
  HOLD_THRESHOLD: number;
  confidence: number;
}

export default function SentencePanel({
  sentence,
  setSentence,
  uiHoldCount,
  HOLD_THRESHOLD,
  confidence,
}: SentencePanelProps) {
  const characters = sentence.length;

  const words =
    sentence.trim() === ""
      ? 0
      : sentence.trim().split(/\s+/).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .45 }}
      className="glass-panel"
      style={{
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        flex: 1,
        justifyContent: "space-between",
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
              fontSize: 28,
              fontWeight: 800,
              color: "#431407",
            }}
          >
            Sentence Builder
          </h2>

          <p
            style={{
              marginTop: 6,
              color: "#78350F",
            }}
          >
            Real-time ASL Translation Output
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
            gap: 8,
            alignItems: "center",
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(249,115,22,0.15)",
            border: "1px solid rgba(249,115,22,0.4)",
            color: "#FB923C",
            fontWeight: 700,
          }}
        >
          <Sparkles size={18} />
          LIVE
        </motion.div>
      </div>

      {/* ================= EDITOR ================= */}

      <motion.div
        whileHover={{
          scale: 1.01,
        }}
        style={{
  background: "rgba(255,255,255,0.4)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(251,146,60,0.2)",
  boxShadow: "0 8px 22px rgba(0,0,0,0.2)",
  borderRadius: 22,
  padding: 25,
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}}
      >
        <div
          style={{
            fontSize: 26,
            lineHeight: 1.8,
            fontWeight: 600,
            wordBreak: "break-word",
            color: sentence ? "#431407" : "#78350F",
          }}
        >
          {sentence || "Start signing to build your sentence..."}
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
            color: "#78350F",
            fontSize: 13
          }}
        >
          <span>{characters} Characters</span>

          <span>{words} Words</span>
        </div>
      </motion.div>
            {/* ================= ACTION BUTTONS ================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6,1fr)",
          gap: 16,
        }}
      >
        <ActionButton
          icon={<Wand2 size={20} />}
          title="Convert AI"
          color="#EC4899"
          onClick={async () => {
            if (!sentence.trim()) return;
            try {
              const res = await fetch("http://127.0.0.1:8000/api/convert-sentence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ raw_sentence: sentence }),
              });
              const data = await res.json();
              if (data.converted_sentence) {
                setSentence(data.converted_sentence);
              }
            } catch (err) {
              console.error("Failed to convert sentence:", err);
            }
          }}
        />
        <ActionButton
          icon={<Volume2 size={20} />}
          title="Speak"
          color="#2563EB"
          onClick={() => {
            if (!sentence) return;

            const utterance = new SpeechSynthesisUtterance(sentence);
            utterance.rate = 0.95;
            utterance.pitch = 1;
            speechSynthesis.cancel();
speechSynthesis.speak(utterance);
          }}
        />

        <ActionButton
  icon={<Copy size={20} />}
  title="Copy"
  color="#10B981"
  onClick={() => {
    if (!sentence.trim()) return;

    navigator.clipboard.writeText(sentence);
  }}
/>

        <ActionButton
          icon={<Delete size={20} />}
          title="Backspace"
          color="#F59E0B"
          onClick={() =>
            setSentence((prev) => prev.slice(0, -1))
          }
        />

        <ActionButton
          icon={<Trash2 size={20} />}
          title="Clear"
          color="#EF4444"
          onClick={() => setSentence("")}
        />

       <ActionButton
  icon={<FileText size={20} />}
  title="Export"
  color="#8B5CF6"
  onClick={() => {
    if (!sentence.trim()) return;

    const blob = new Blob([sentence], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "translation.txt";
    a.click();

    URL.revokeObjectURL(url);
  }}
/>

      </div>

      {/* ================= QUICK INFO ================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 18,
        }}
      >
        <MiniInfoCard
          title="Characters"
          value={characters.toString()}
          color="#3B82F6"
        />

        <MiniInfoCard
          title="Words"
          value={words.toString()}
          color="#10B981"
        />

        <MiniInfoCard
          title="Confidence"
          value={`${confidence.toFixed(1)}%`}
          color="#F59E0B"
        />

        <MiniInfoCard
          title="Status"
          value="LIVE"
          color="#22C55E"
        />
      </div>
            {/* ================= HOLD PROGRESS ================= */}

      <div
        style={{
          background: "rgba(255,255,255,0.4)",
backdropFilter: "blur(16px)",
WebkitBackdropFilter: "blur(16px)",
border: "1px solid rgba(251,146,60,.2)",
borderRadius: 18,
padding: 20,
boxShadow: "0 7px 20px rgba(0,0,0,.2)",
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
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#431407",
            }}
          >
            Gesture Hold Progress
          </h3>

          <span
            style={{
              color: "#F97316",
              fontWeight: 700,
            }}
          >
            {uiHoldCount} / {HOLD_THRESHOLD}
          </span>
        </div>

        <div
          style={{
            height: 14,
            borderRadius: 999,
            overflow: "hidden",
            background: "rgba(255,255,255,0.1)",
          }}
        >
          <motion.div
            animate={{
              width: `${(uiHoldCount / HOLD_THRESHOLD) * 100}%`,
            }}
            transition={{
              duration: .2,
            }}
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg,#F97316,#22C55E)",
            }}
          />
        </div>

        <p
          style={{
            marginTop: 15,
            color: "#78350F",
            fontSize: 13
          }}
        >
          Hold the same gesture until the bar reaches 100%.
          Then the predicted character will automatically be
          added to your sentence.
        </p>
      </div>

      {/* ================= TRANSLATION STATUS ================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
        }}
      >
        <StatusCard
          title="Translation"
          value="Running"
          color="#22C55E"
        />

        <StatusCard
          title="Gesture"
          value="Detected"
          color="#3B82F6"
        />

        <StatusCard
          title="Sentence"
          value={
            sentence.length > 0
              ? "Building"
              : "Waiting"
          }
          color="#F59E0B"
        />
      </div>

      {/* ================= SMART AI TIPS ================= */}

      <div
        style={{
          background: "rgba(255,255,255,0.4)",
backdropFilter: "blur(16px)",
WebkitBackdropFilter: "blur(16px)",
border: "1px solid rgba(251,146,60,.2)",
borderRadius: 18,
padding: 20,
boxShadow: "0 7px 20px rgba(0,0,0,.2)",
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
          <Sparkles
            size={22}
            color="#F97316"
          />

          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#431407",
            }}
          >
            Smart AI Tips
          </h3>
        </div>

        <Tip
          text="Keep your entire hand visible inside the camera."
          color="#22C55E"
        />

        <Tip
          text="Hold each gesture steady for better accuracy."
          color="#3B82F6"
        />

        <Tip
          text="Maintain good lighting conditions."
          color="#F59E0B"
        />

        <Tip
          text="Use one hand while signing."
          color="#8B5CF6"
        />
      </div>
          </motion.div>
  );
}

/* =======================================================
   ACTION BUTTON
======================================================= */

interface ActionButtonProps {
  icon: ReactNode;
  title: string;
  color: string;
  onClick: () => void;
}

function ActionButton({
  icon,
  title,
  color,
  onClick,
}: ActionButtonProps) {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -3,
      }}
      whileTap={{
        scale: 0.96,
      }}
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.4)",
backdropFilter: "blur(14px)",
WebkitBackdropFilter: "blur(14px)",
border: `1px solid ${color}45`,
borderRadius: 15,
padding: 15,
color: "#431407",
boxShadow:
  "0 7px 18px rgba(0,0,0,.2)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {icon}
      </span>

      <span
        style={{
          fontWeight: 700,
          fontSize: 13
        }}
      >
        {title}
      </span>
    </motion.button>
  );
}

/* =======================================================
   MINI INFO CARD
======================================================= */

interface MiniInfoCardProps {
  title: string;
  value: string;
  color: string;
}

function MiniInfoCard({
  title,
  value,
  color,
}: MiniInfoCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      style={{
        background: "rgba(255,255,255,0.4)",
backdropFilter: "blur(14px)",
WebkitBackdropFilter: "blur(14px)",
border: "1px solid rgba(251,146,60,.18)",
borderRadius: 15,
padding: 16,
boxShadow: "0 6px 18px rgba(0,0,0,.2)",
      }}
    >
      <div
        style={{
          color: "#78350F",
          fontSize: 13,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,
          fontSize: 28,
          fontWeight: 800,
          marginTop: 8,
        }}
      >
        {value}
      </div>
    </motion.div>
  );
}

/* =======================================================
   STATUS CARD
======================================================= */

interface StatusCardProps {
  title: string;
  value: string;
  color: string;
}

function StatusCard({
  title,
  value,
  color,
}: StatusCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      style={{
        background: "rgba(255,255,255,0.4)",
        border: "1px solid rgba(251,146,60,.2)",
        borderRadius: 15,
        padding: 16,
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,.2)",
      }}
    >
      <div
        style={{
          color: "#78350F",
          fontSize: 13,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 10,
          color,
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </motion.div>
  );
}

/* =======================================================
   TIP
======================================================= */

interface TipProps {
  text: string;
  color: string;
}

function Tip({
  text,
  color,
}: TipProps) {
  return (
    <motion.div
      whileHover={{
        x: 5,
      }}
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      />

      <span
        style={{
          color: "#78350F",
fontSize: 14
        }}
      >
        {text}
      </span>
    </motion.div>
  );
}