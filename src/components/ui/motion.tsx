"use client";
import { motion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
export function CardMotion({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="card-motion"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
