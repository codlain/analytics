import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number) => Intl.NumberFormat().format(+num);

export function kFormatter(value: number): string {
  return value > 999 ? `${(value / 1000).toFixed(1)}K` : String(value);
}

export function formatMinSec(totalSeconds: number) {
  if (isNaN(totalSeconds)) return "0s";

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const padTo2Digits = (value: number) => value.toString().padStart(2, "0");
  return `${minutes ? `${minutes}m` : ""} ${padTo2Digits(seconds)}s`;
}

export function formatPercentage(value: number) {
  return `${value ? (value * 100).toFixed(2) : "0"}%`;
}

export const arrayHasCurrentDate = (
  dates: string[],
  isHourlyGranularity: boolean
) => {
  const now = moment()
    .utc()
    .format(isHourlyGranularity ? "HH:00" : "MMM DD, YYYY");
  return dates[dates.length - 1] === now;
};
