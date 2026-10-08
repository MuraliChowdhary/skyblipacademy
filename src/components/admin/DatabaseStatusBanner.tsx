"use client";

import { useState } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function DatabaseStatusBanner() {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);

    window.location.reload();
  };

  return (
    <div className="border-b bg-destructive/10 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />

          <div>
            <p className="text-sm font-medium">
              Server connection unavailable
            </p>

            <p className="text-xs text-muted-foreground">
              Some data may not be available. Please try again.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleRetry}
          disabled={retrying}
        >
          {retrying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </>
          )}
        </Button>
      </div>
    </div>
  );
}