import { createContext, useContext, ReactNode } from "react";
import type { ApiClient } from "../client";

const ApiClientContext = createContext<ApiClient | null>(null);

export function useApiClient() {
  const client = useContext(ApiClientContext);

  if (!client) {
    throw new Error("useApiClient must be used within an ApiClientProvider");
  }

  return client;
}

interface ApiClientProviderProps {
  apiClient: ApiClient;
  children: ReactNode;
}

/**
 * Provides a singleton ApiClient instance to the React tree.
 */
export function ApiClientProvider({
  apiClient,
  children,
}: ApiClientProviderProps) {
  return (
    <ApiClientContext.Provider value={apiClient}>
      {children}
    </ApiClientContext.Provider>
  );
}
