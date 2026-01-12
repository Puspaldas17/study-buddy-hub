import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { memo } from "react";

const spinTransition = { duration: 1, repeat: Infinity, ease: "linear" as const };
const fadeTransition = { delay: 0.2 };

export const PageLoader = memo(function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div animate={{ rotate: 360 }} transition={spinTransition}>
          <Loader2 className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={fadeTransition}
          className="text-sm text-muted-foreground"
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
});
