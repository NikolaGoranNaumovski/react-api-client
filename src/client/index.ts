// Generates a random hex string of a specific byte length (length * 2 characters)
function getRandomHex(byteLength: number): string {
  const arr = new Uint8Array(byteLength);
  window.crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generates W3C Trace Context headers for correlation.
 * The Trace-ID is the Operation ID.
 * The Span-ID is the Parent ID for the server's first span.
 */
function generateTraceHeaders() {
  const traceId = getRandomHex(16); // 32 hex chars
  const spanId = getRandomHex(8); // 16 hex chars
  const traceparent = `00-${traceId}-${spanId}-01`;

  return {
    traceparent: traceparent,
  };
}

interface GetOptions {
  responseType?: "json" | "blob";
}

export class ApiClient {
  constructor(public baseUrl: string) {}

  // Centralized function to handle all API calls
  private async request<TRequest, TResponse>(
    method: string,
    path: string,
    data?: TRequest,
    options?: GetOptions
  ): Promise<TResponse> {
    const fullPath = `${this.baseUrl}${path}`;
    const responseType = options?.responseType || "json";
    const isFormData = data instanceof FormData;

    let res = await fetch(fullPath, {
      method,
      credentials: "include",
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...generateTraceHeaders(),
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    if (res.status === 401) {
      res = await this.retryRequest(method, fullPath, isFormData, data);
    }

    if (res.status === 403) {
      throw new Error(
        "Access denied: You do not have permission to access ProductFinder"
      );
    }

    if (!res.ok) {
      throw await this.handleError(res, isFormData);
    }

    return this.processResponse(res, responseType, isFormData);
  }

  private async retryRequest<TRequest>(
    method: string,
    fullPath: string,
    isFormData: boolean,
    data?: TRequest
  ): Promise<Response> {
    const res = await fetch(fullPath, {
      method,
      credentials: "include",
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...generateTraceHeaders(),
      },
      body: isFormData ? (data as TRequest & FormData) : JSON.stringify(data),
    });

    return res;
  }

  private async processResponse<TResponse>(
    res: Response,
    responseType: "json" | "blob",
    isFormData: boolean
  ): Promise<TResponse> {
    if (responseType === "blob" && isFormData) {
      return { data: await res.blob(), headers: res.headers } as TResponse;
    }
    return res.json() as Promise<TResponse>;
  }

  private async handleError(
    res: Response,
    isFormData: boolean
  ): Promise<Error> {
    if (isFormData) {
      const responseError = await res.blob();
      return new Error(
        responseError instanceof Blob
          ? responseError.toString()
          : "Unknown error"
      );
    } else {
      const responseError = await res.json();
      const message =
        typeof responseError.message === "string"
          ? responseError.message
          : responseError.message?.[0];
      return new Error(message);
    }
  }

  public async get<TResponse>(
    path: string,
    options?: GetOptions
  ): Promise<TResponse> {
    return this.request("GET", path, undefined, options);
  }

  public async post<TRequest, TResponse>(
    path: string,
    data: TRequest
  ): Promise<TResponse> {
    return this.request("POST", path, data, undefined);
  }

  public async put<TRequest, TResponse>(
    path: string,
    data: TRequest
  ): Promise<TResponse> {
    return this.request("PUT", path, data, undefined);
  }

  public async patch<TRequest, TResponse>(
    path: string,
    data: TRequest
  ): Promise<TResponse> {
    return this.request("PATCH", path, data, undefined);
  }

  public async delete(path: string): Promise<void> {
    const fullPath = `${this.baseUrl}${path}`;
    console.log("Calling ProductFinder API on route: ", fullPath);

    await this.request("DELETE", path, undefined);

    console.log("Successful call to ProductFinder API on route: ", fullPath);
  }
}
