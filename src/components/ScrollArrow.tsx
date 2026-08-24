"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

type ScrollArrowProps = {
  onClick: () => void;
  label?: string;
  className?: string;
};

export default function ScrollArrow({
  onClick,
  label = "Scroll to next section",
  className = "",
}: ScrollArrowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 3.2, ease: "easeOut" }}
      className={`flex justify-center ${className}`}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="group flex flex-col items-center gap-2 text-white/30 hover:text-white/80 transition-colors cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
        </motion.div>
      </button>
    </motion.div>
  );
}
