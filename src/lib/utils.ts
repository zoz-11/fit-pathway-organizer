import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleApiError(error: unknown, message: string = "An unexpected error occurred.") {
  console.error("API Error:", error);
  toast.error(message, {
    description: error instanceof Error ? error.message : JSON.stringify(error),
  });
}
