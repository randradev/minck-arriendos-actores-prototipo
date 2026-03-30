import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeRut(rut: string) {
  return rut.replace(/[.-]/g, '').toLowerCase();
}
