"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function NetworkStatus() {
  useEffect(() => {
    const handleOffline = () => {
      toast.error("You're offline", {
        description: "Check your internet connection.",
        duration: Infinity,
      });
    };

    const handleOnline = () => {
      toast.success("You're back online", {
        description: "Your internet connection has been restored.",
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}