"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function useSortingParams<T extends string>({
  key,
  defaultValue,
  values,
}: {
  key: string;
  defaultValue?: T;
  values: T[];
}): [T, (param: T) => void] {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const param = params.get(key) as T;

  const value =
    typeof param === "string" && values.includes(param)
      ? param
      : defaultValue ?? values[0];

  const setParam = (param: T) => {
    params.set(key, param);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return [value, setParam];
}
