import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  Cpu,
  ShieldCheck,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        marginTop: 40,
        borderTop: "1px solid #334155",
        padding: "28px 0",
        color: "#94A3B8",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        {/* Left */}

        <div>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#F8FAFC",
            }}
          >
            HandSpeak AI
          </h3>

          <p
            style={{
              marginTop: 6,
              fontSize: 14,
            }}
          >
            Real-Time Sign Language Translator
          </p>

          <p
            style={{
              marginTop: 4,
              fontSize: 13,
              color: "#64748B",
            }}
          >
            Built using React • FastAPI • MediaPipe • PyTorch
          </p>
        </div>

        {/* Center */}

        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          <FooterItem
            icon={<Cpu size={18} />}
            text="AI Powered"
          />

          <FooterItem
            icon={<ShieldCheck size={18} />}
            text="100% Offline"
          />

          <FooterItem
            icon={<Heart size={18} />}
            text="Open Source"
          />
        </div>

        {/* Right */}

        <motion.a
          whileHover={{
            scale: 1.08,
          }}
          href="https://github.com/omshree59"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#CBD5E1",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          
          <span style={{ fontSize: 22 }}>🐙</span>
          GitHub
        </motion.a>
      </div>

      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          color: "#64748B",
          fontSize: 13,
        }}
      >
        © {new Date().getFullYear()} HandSpeak AI •
        Built with ❤️ for accessible communication.
      </div>
    </motion.footer>
  );
}

interface FooterItemProps {
  icon: ReactNode;
  text: string;
}

function FooterItem({
  icon,
  text,
}: FooterItemProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: "#3B82F6",
        }}
      >
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );
}