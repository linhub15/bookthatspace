import { ClassValue, clsx } from "clsx";

export function cn(...classNames: ClassValue[]) {
  return clsx(classNames);
}
