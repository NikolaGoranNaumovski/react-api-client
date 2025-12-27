import { useCallback, useState } from "react";
import type { BackendError, HookOptions } from "../types";
import { useApiClient } from "../provider";

type Method = "post" | "put" | "patch";

export function useMutation<TRequest, TResponse>(
  method: Method,
  options: HookOptions<TResponse> = {}
) {
  const { onSuccess, onError } = options;

  const apiClient = useApiClient();

  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = useCallback(
    async (path: string, requestData: TRequest) => {
      setLoading(true);
      try {
        const response = await apiClient[method]<TRequest, TResponse>(
          path,
          requestData,
        );
        setData(response);
        onSuccess?.(response);
        setError(null);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        onError?.(err as BackendError);
      } finally {
        setLoading(false);
      }
    },
    [method, onSuccess, onError]
  );

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(true);
  }

  return { data, loading, error, trigger: sendRequest, reset };
}