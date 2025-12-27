import { useCallback, useEffect, useRef, useState } from "react";
import type { BackendError, HookOptions } from "../types";
import { useApiClient } from "../provider";


export function useGet<TResponse>(
  path: string,
  options: HookOptions<TResponse> = {}
) {
  const {
    skip = false,
    manual = false,
    urlRefetch = false,
    onSuccess,
    onError,
  } = options;

  const apiClient = useApiClient();

  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(!manual && !skip);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (skip) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<TResponse>(path);
      setData(response);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";

      setError(errorMessage);
      onError?.(err as BackendError);
    } finally {
      setLoading(false);
    }
  }, [path, skip, onError]);

  const resetData = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (!skip) return;
    
    isMountedRef.current = false;
  }, [path, skip]);

  useEffect(() => {
    if (manual || skip) return;

    const shouldFetch = !isMountedRef.current || urlRefetch;
    
    if (shouldFetch) {
      fetchData();
    }

    return () => {
      isMountedRef.current = true;
    };
  }, [fetchData, urlRefetch, manual, skip]);

  useEffect(() => {
    if (!data) return;
    
    onSuccess?.(data);
  }, [data, onSuccess]);

  return { data, loading, error, refetch: fetchData, resetData };
}
