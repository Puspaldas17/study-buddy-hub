import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, memo, useMemo } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};

export const PageTransition = memo(function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const key = useMemo(() => location.pathname, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});
