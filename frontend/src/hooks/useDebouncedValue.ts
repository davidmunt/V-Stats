import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value as T);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value as T);
    }, delay);

    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
