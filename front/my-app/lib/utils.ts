import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 型定義
type ClassValue = string | null | undefined | { [key: string]: boolean } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
