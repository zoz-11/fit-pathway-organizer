import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ApiError =
  | {
      code?: string | number;
      message?: string;
      status?: number;
      error?: string;
    }
  | Error
  | unknown;

export function handleApiError(
  error: ApiError,
  message: string = "An unexpected error occurred.",
) {
  console.error("API Error:", error);

  // Check for Edge Function specific errors
  if (
    error instanceof Error &&
    (error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError"))
  ) {
    toast.error("Edge Function Error", {
      description:
        "Unable to connect to backend services. Please check your network connection, ensure Supabase Edge Functions are deployed correctly, and that CORS settings are configured properly.",
    });
    return;
  }

  // Handle Supabase specific errors
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  ) {
    toast.error(`Error ${error.code}`, {
      description: error.message as string,
    });
    return;
  }

  // Default error handling
  toast.error(message, {
    description: error instanceof Error ? error.message : JSON.stringify(error),
  });
}
