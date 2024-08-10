import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ClassValue = string | null | undefined | { [key: string]: boolean } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
