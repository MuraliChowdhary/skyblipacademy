"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Verbs chosen to work in the sentence "Where ambition and skill ___
// together" — kept inside one blue family throughout, not a rainbow
// of colors, since the point is one calm, trustworthy accent repeated
// consistently, not novelty per word.
const WORDS = ["Build", "Learn", "Debug", "Ship", "Grow"];
const INTERVAL_MS = 2400;

export function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="relative mx-1 inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-soft px-4 align-middle sm:mx-1.5 sm:px-5"
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-brand sm:h-2.5 sm:w-2.5" />
      <span className="relative inline-grid overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={WORDS[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="col-start-1 row-start-1 inline-block"
          >
            {WORDS[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.span>
  );
}
