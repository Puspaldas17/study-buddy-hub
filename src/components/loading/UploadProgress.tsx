import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadProgressProps {
  progress: number;
  status: UploadStatus;
  fileName?: string;
  fileSize?: string;
  onCancel?: () => void;
}

const spinTransition = { duration: 2, repeat: Infinity, ease: "linear" as const };

const STATUS_CONFIG = {
  success: { icon: CheckCircle2, iconClass: "text-success", text: "Upload complete", barClass: "bg-success" },
  error: { icon: XCircle, iconClass: "text-destructive", text: "Upload failed", barClass: "bg-destructive" },
  uploading: { icon: Upload, iconClass: "text-primary", text: "Uploading...", barClass: "bg-primary", spin: true },
  idle: { icon: FileText, iconClass: "text-muted-foreground", text: "Ready to upload", barClass: "bg-muted-foreground/30" },
} as const;

export const UploadProgress = memo(function UploadProgress({
  progress,
  status,
  fileName,
  fileSize,
  onCancel,
}: UploadProgressProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  
  const statusText = useMemo(() => 
    status === "uploading" ? `${config.text} ${progress}%` : config.text,
    [status, config.text, progress]
  );

  const iconElement = useMemo(() => {
    if ('spin' in config && config.spin) {
      return (
        <motion.div animate={{ rotate: 360 }} transition={spinTransition}>
          <Icon className={cn("h-5 w-5", config.iconClass)} />
        </motion.div>
      );
    }
    return <Icon className={cn("h-5 w-5", config.iconClass)} />;
  }, [config, Icon]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {iconElement}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{fileName || "File"}</p>
            {fileSize && (
              <span className="shrink-0 text-xs text-muted-foreground">{fileSize}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{statusText}</p>
        </div>
        {status === "uploading" && onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full transition-colors", config.barClass)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
});
