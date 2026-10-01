import { motion } from "framer-motion";

/** Fade-and-rise on scroll. Reduced motion is handled globally by <MotionConfig reducedMotion="user">. */
export default function Reveal({
  children, delay = 0, y = 26, className = "",
}: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
