import { useCallback, useState } from "react";

import { useApiClient } from "../provider";
import type { BackendError, HookOptions } from "../types";

export function useDelete(options: HookOptions<null> = {}) {
  const { onSuccess, onError } = options;

  const apiClient = useApiClient();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteData = useCallback(
    async (path: string) => {
      setLoading(true);
      try {
        await apiClient.delete(path);
        onSuccess?.(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        onError?.(err as BackendError);
      } finally {
        setLoading(false);
      }
    },
    [onError, onSuccess]
  );

  return { loading, error, deleteData };
}