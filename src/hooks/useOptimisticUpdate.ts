import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface OptimisticState<T> {
  data: T;
  isPending: boolean;
  error: Error | null;
}

export function useOptimisticUpdate<T>(initialData: T) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isPending: false,
    error: null,
  });
  const [previousData, setPreviousData] = useState<T>(initialData);

  const update = useCallback(
    async (
      optimisticData: T,
      asyncOperation: () => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
        successMessage?: string;
        errorMessage?: string;
      }
    ) => {
      // Store previous state for rollback
      setPreviousData(state.data);
      
      // Apply optimistic update immediately
      setState((prev) => ({
        ...prev,
        data: optimisticData,
        isPending: true,
        error: null,
      }));

      try {
        // Perform the actual async operation
        const result = await asyncOperation();
        
        // Update with actual server response
        setState({
          data: result,
          isPending: false,
          error: null,
        });

        if (options?.successMessage) {
          toast({
            title: "Success",
            description: options.successMessage,
          });
        }

        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error("An error occurred");
        
        // Rollback to previous state
        setState({
          data: previousData,
          isPending: false,
          error: err,
        });

        toast({
          title: "Error",
          description: options?.errorMessage || err.message,
          variant: "destructive",
        });

        options?.onError?.(err);
        throw err;
      }
    },
    [state.data, previousData]
  );

  const setData = useCallback((data: T) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isPending: false,
      error: null,
    });
  }, [initialData]);

  return {
    data: state.data,
    isPending: state.isPending,
    error: state.error,
    update,
    setData,
    reset,
  };
}
