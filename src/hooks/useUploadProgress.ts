import { useState, useCallback, useRef } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadState {
  progress: number;
  status: UploadStatus;
}

export function useUploadProgress() {
  const [state, setState] = useState<UploadState>({
    progress: 0,
    status: "idle",
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const startUpload = useCallback(() => {
    abortControllerRef.current = new AbortController();
    setState({ progress: 0, status: "uploading" });
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress: Math.min(progress, 100) }));
  }, []);

  const completeUpload = useCallback(() => {
    setState({ progress: 100, status: "success" });
  }, []);

  const failUpload = useCallback(() => {
    setState((prev) => ({ ...prev, status: "error" }));
  }, []);

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({ progress: 0, status: "idle" });
  }, []);

  const resetUpload = useCallback(() => {
    setState({ progress: 0, status: "idle" });
  }, []);

  // Simulate upload progress (for demo/testing)
  const simulateUpload = useCallback((duration: number = 2000) => {
    startUpload();
    const startTime = Date.now();
    
    const updateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      updateProgress(progress);
      
      if (progress < 100) {
        requestAnimationFrame(updateFrame);
      } else {
        completeUpload();
      }
    };
    
    requestAnimationFrame(updateFrame);
  }, [startUpload, updateProgress, completeUpload]);

  return {
    ...state,
    startUpload,
    updateProgress,
    completeUpload,
    failUpload,
    cancelUpload,
    resetUpload,
    simulateUpload,
    abortSignal: abortControllerRef.current?.signal,
  };
}
