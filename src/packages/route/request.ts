export const requestRouteData = async <T>(url: string, method: string, params: unknown): Promise<T> => {
  const normalizedMethod = method.toUpperCase();
  const response = await fetch(normalizedMethod === "GET" ? `${url}?${params}` : url, {
    method: normalizedMethod,
    body: normalizedMethod === "GET" ? undefined : JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Route request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};
