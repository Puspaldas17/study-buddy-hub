import { useEffect, useState, useRef, useCallback, memo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PROGRESS_STEPS = [
  { delay: 50, value: 30 },
  { delay: 150, value: 60 },
  { delay: 300, value: 80 },
  { delay: 400, value: 100 },
] as const;

export const TopProgressBar = memo(function TopProgressBar() {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    clearTimers();
    setIsNavigating(true);
    setProgress(0);

    PROGRESS_STEPS.forEach(({ delay, value }) => {
      const timer = setTimeout(() => {
        setProgress(value);
        if (value === 100) {
          const hideTimer = setTimeout(() => setIsNavigating(false), 200);
          timersRef.current.push(hideTimer);
        }
      }, delay);
      timersRef.current.push(timer);
    });

    return clearTimers;
  }, [location.pathname, clearTimers]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] h-1"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              boxShadow: "0 0 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});
