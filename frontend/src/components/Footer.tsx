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
        marginTop: 50,
        borderTop: "1px solid rgba(148,163,184,.25)",
        padding: "32px 0 20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr auto",
          alignItems: "end",
          gap: 40,
        }}
      >
        {/* LEFT */}

        <div>
          <h3
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#111827",
              margin: 0,
            }}
          >
            HandSpeak AI
          </h3>

          <p
            style={{
              marginTop: 8,
              fontSize: 18,
              color: "#475569",
            }}
          >
            Real-Time Sign Language Translator
          </p>

          <p
            style={{
              marginTop: 6,
              fontSize: 15,
              color: "#64748B",
            }}
          >
            Built using React • FastAPI • MediaPipe • PyTorch
          </p>
        </div>

        {/* CENTER */}

       <div
  style={{
    display: "flex",
    justifyContent: "flex-start",
    gap: 32,
    alignItems: "center",
    paddingBottom: 6,
    marginLeft: "-270px", // move left
  }}
>
        
          <FooterItem
            icon={<Cpu size={20} />}
            text="AI Powered"
          />

          <FooterItem
            icon={<ShieldCheck size={20} />}
            text="100% Offline"
          />

          <FooterItem
            icon={<Heart size={20} />}
            text="Open Source"
          />
        </div>

        {/* RIGHT */}

        <motion.a
          whileHover={{ scale: 1.08 }}
          href="https://github.com/omshree59"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#111827",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 22,
            paddingBottom: 6,
          }}
        >
          <span style={{ fontSize: 30 }}>👾</span>
          GitHub
        </motion.a>
      </div>

      <div
        style={{
          marginTop: 28,
          textAlign: "center",
          color: "#64748B",
          fontSize: 15,
        }}
      >
        © {new Date().getFullYear()} HandSpeak AI • Built with ❤️ for
        accessible communication.
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
        alignItems: "center",
        gap: 10,
        color: "#111827",
        fontWeight: 600,
        fontSize: 22,
      }}
    >
      <span style={{ color: "#2563EB" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}