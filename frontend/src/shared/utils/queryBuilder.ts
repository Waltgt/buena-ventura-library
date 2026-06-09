export function buildQuery(obj: Record<string, any>) {
  return new URLSearchParams(
    Object.entries(obj).reduce((acc, [key, value]) => {
      if (value != null && value !== "") {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  );
}