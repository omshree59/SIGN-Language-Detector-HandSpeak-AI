import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  Cpu,
  ShieldCheck,
  Heart,
} from "lucide-react";

const GithubIcon = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        marginTop: 50,
        borderTop: "1px solid rgba(251,146,60,.3)",
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
              color: "#431407",
              margin: 0,
            }}
          >
            LexiCue
          </h3>

          <p
            style={{
              marginTop: 8,
              fontSize: 18,
              color: "#78350F",
            }}
          >



            Real-Time Sign Language Translator

            
          </p>

          <p
            style={{
              marginTop: 6,
              fontSize: 15,
              color: "#9A3412",
            }}
          >
          
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
            color: "#431407",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 22,
            paddingBottom: 6,
          }}
        >
          <GithubIcon size={28} />
          GitHub
        </motion.a>
      </div>

      <div
        style={{
          marginTop: 28,
          textAlign: "center",
          color: "#9A3412",
          fontSize: 15,
        }}
      >
        © {new Date().getFullYear()} LexiCue • Built with ❤️ for
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
        color: "#431407",
        fontWeight: 600,
        fontSize: 22,
      }}
    >
      <span style={{ color: "#EA580C" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}