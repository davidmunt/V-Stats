import { useSearchParams, type NavigateOptions } from "react-router-dom";

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key: string, defaultValue: string = ""): string => searchParams.get(key) ?? defaultValue;

  const set = (key: string, value: string | number | null | undefined, options: NavigateOptions = { replace: false }) => {
    const next = new URLSearchParams(searchParams);

    if (value === "" || value == null) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }

    setSearchParams(next, options);
  };

  const setMany = (values: Record<string, string | number | null | undefined>, options: NavigateOptions = { replace: false }) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(values).forEach(([key, value]) => {
      if (value === "" || value == null) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });

    setSearchParams(next, options);
  };

  return { get, set, setMany };
}
