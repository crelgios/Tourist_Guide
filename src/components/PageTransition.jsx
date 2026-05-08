"use client";

import { motion } from "framer-motion";

const smoothEase = [0.22, 1, 0.36, 1];

export default function PageTransition({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <motion.div
        aria-hidden="true"
        className="page-glass-wipe"
        initial={{ opacity: 0.78, scale: 1.02 }}
        animate={{ opacity: 0, scale: 1 }}
        exit={{ opacity: 0.72, scale: 1.015 }}
        transition={{ duration: 0.48, ease: smoothEase }}
      />

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.985, filter: "blur(14px) saturate(120%)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px) saturate(100%)" }}
        exit={{ opacity: 0, y: -18, scale: 0.992, filter: "blur(10px) saturate(120%)" }}
        transition={{ duration: 0.46, ease: smoothEase }}
        className="min-h-screen will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
