import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadProgressProps {
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  fileName?: string;
  fileSize?: string;
  onCancel?: () => void;
}

export function UploadProgress({
  progress,
  status,
  fileName,
  fileSize,
  onCancel,
}: UploadProgressProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "uploading":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Upload className="h-5 w-5 text-primary" />
          </motion.div>
        );
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "success":
        return "Upload complete";
      case "error":
        return "Upload failed";
      case "uploading":
        return `Uploading... ${progress}%`;
      default:
        return "Ready to upload";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{fileName || "File"}</p>
            {fileSize && (
              <span className="shrink-0 text-xs text-muted-foreground">{fileSize}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{getStatusText()}</p>
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
      
      {/* Progress bar */}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors",
            status === "success" && "bg-success",
            status === "error" && "bg-destructive",
            status === "uploading" && "bg-primary",
            status === "idle" && "bg-muted-foreground/30"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
