import { isDatabaseError } from "./db-error";
import { DatabaseUnavailableError } from "./app-error";

export async function safeDb<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isDatabaseError(error)) {
      console.error("Database unavailable:", error);

      throw new DatabaseUnavailableError();
    }

    throw error;
  }
}