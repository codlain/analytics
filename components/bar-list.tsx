"use client";

import { BarList as TremorBarList } from "@tremor/react";

interface BarListProps {
  data: any;
}

export const BarList = ({ data }: BarListProps) => {
  return <TremorBarList data={data} valueFormatter={() => ""} />;
};
