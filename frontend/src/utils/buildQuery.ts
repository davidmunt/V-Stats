export function buildQuery(params: Record<string, unknown>): string {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.set(key, String(value));
    }
  });

  const str = urlParams.toString();
  return str ? `?${str}` : "";
}
