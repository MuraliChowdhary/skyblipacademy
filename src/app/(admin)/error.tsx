"use client";

import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    console.error("[ADMIN_ERROR]", error);

    toast.error("Unable to connect to the server", {
      description: "Please try again in a moment.",
    });
  }, [error]);

  const handleRetry = () => {
    setIsReloading(true);

    // Give the loading state a moment to render,
    // then perform a full page reload.
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <h2 className="text-lg font-semibold">
        Unable to load this page
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        We couldn&apos;t connect to the server.
      </p>

      <Button
        onClick={handleRetry}
        disabled={isReloading}
        className="mt-4 min-w-[120px]"
      >
        {isReloading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Retrying...
          </>
        ) : (
          "Try again"
        )}
      </Button>
    </div>
  );
}