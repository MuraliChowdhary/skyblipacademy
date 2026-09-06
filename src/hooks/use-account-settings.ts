"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "@/src/components/ui/toast";
import { apiClient } from "@/src/lib/api-client";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type BillingProfile = {
  id: string;
  fullName: string | null;
  country: string;
  state: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  taxId: string | null;
};

export type BillingUpdateInput = {
  fullName?: string;
  country: string;
  state?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  taxId?: string;
};

export type Session = {
  id: string;
  expires: string;
};

export type ConnectedAccount = {
  id: string;
  provider: string;
  type: string;
};

/* -------------------------------------------------------------------------- */
/* Error helper                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Extract a useful error message from different error shapes.
 *
 * This is particularly useful when apiClient throws an Error whose message
 * contains the backend response.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null
  ) {
    const value = error as {
      message?: unknown;
      error?: unknown;
    };

    if (typeof value.message === "string") {
      return value.message;
    }

    if (typeof value.error === "string") {
      return value.error;
    }
  }

  return "Something went wrong. Please try again.";
}

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export function useAccountProfile() {
  return useQuery({
    queryKey: ["profile"],

    queryFn: () =>
      apiClient.get<Profile>("/api/me"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const trimmedName = name.trim();

      if (trimmedName.length < 2) {
        throw new Error(
          "Name must be at least 2 characters long.",
        );
      }

      return apiClient.patch<Profile>(
        "/api/me",
        {
          name: trimmedName,
        },
      );
    },

    onSuccess: (profile) => {
      /*
       * Update the cached profile immediately.
       */
      queryClient.setQueryData(
        ["profile"],
        profile,
      );

      /*
       * Make sure the server remains the source of truth.
       */
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      toast.add({
        title: "Profile updated",
        type: "success",
        description:
          "Your profile has been updated successfully.",
      });
    },

    onError: (error) => {
      /*
       * Keep the real error visible during development.
       */
      console.error(
        "Failed to update profile:",
        error,
      );

      toast.add({
        title: "Unable to update profile",
        type: "error",
        description: getErrorMessage(error),
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Billing                                                                    */
/* -------------------------------------------------------------------------- */

export function useBilling() {
  return useQuery({
    queryKey: ["billing"],

    queryFn: () =>
      apiClient.get<BillingProfile | null>(
        "/api/me/billing",
      ),
  });
}

export function useUpdateBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      input: BillingUpdateInput,
    ) => {
      /*
       * Normalize the values one more time at the hook boundary.
       *
       * This prevents accidental undefined/null/whitespace values from
       * reaching the API.
       */
      const payload: BillingUpdateInput = {
        country: input.country.trim(),

        fullName:
          input.fullName?.trim() || undefined,

        state:
          input.state?.trim() || undefined,

        address:
          input.address?.trim() || undefined,

        city:
          input.city?.trim() || undefined,

        postalCode:
          input.postalCode?.trim() || undefined,

        taxId:
          input.taxId?.trim() || undefined,
      };

      /*
       * Country is required by the current API contract.
       */
      if (!payload.country) {
        throw new Error(
          "Country is required.",
        );
      }

      return apiClient.patch<BillingProfile>(
        "/api/me/billing",
        payload,
      );
    },

    onSuccess: (billing) => {
      /*
       * Update the billing cache immediately.
       */
      queryClient.setQueryData(
        ["billing"],
        billing,
      );

      /*
       * Refetch from the server so the UI reflects the actual persisted
       * database record.
       */
      queryClient.invalidateQueries({
        queryKey: ["billing"],
      });

      toast.add({
        title: "Billing details updated",
        type: "success",
        description:
          "Your billing information has been saved.",
      });
    },

    onError: (error) => {
      /*
       * IMPORTANT:
       *
       * Previously this error was completely hidden behind:
       *
       * "We couldn't save your billing information."
       *
       * That made backend/API problems impossible to diagnose.
       */
      console.error(
        "Failed to update billing details:",
        error,
      );

      toast.add({
        title: "Unable to update billing details",
        type: "error",
        description: getErrorMessage(error),
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Change email                                                               */
/* -------------------------------------------------------------------------- */

export function useChangeEmail() {
  return useMutation({
    mutationFn: async (newEmail: string) => {
      const email = newEmail.trim();

      if (!email) {
        throw new Error(
          "Email address is required.",
        );
      }

      return apiClient.post(
        "/api/me/change-email",
        {
          newEmail: email,
        },
      );
    },

    onSuccess: () => {
      toast.add({
        title: "Verification email sent",
        type: "success",
        description:
          "Check your new email address to complete the change.",
      });
    },

    onError: (error) => {
      console.error(
        "Failed to change email:",
        error,
      );

      toast.add({
        title: "Unable to change email",
        type: "error",
        description: getErrorMessage(error),
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Phone                                                                      */
/* -------------------------------------------------------------------------- */

export function useUpdatePhone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (phone: string) => {
      const trimmedPhone = phone.trim();

      if (!trimmedPhone) {
        throw new Error(
          "Phone number is required.",
        );
      }

      return apiClient.patch<Profile>(
        "/api/me/phone",
        {
          phone: trimmedPhone,
        },
      );
    },

    onSuccess: (profile) => {
      queryClient.setQueryData(
        ["profile"],
        profile,
      );

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      toast.add({
        title: "Phone number updated",
        type: "success",
        description:
          "Your phone number has been updated successfully.",
      });
    },

    onError: (error) => {
      console.error(
        "Failed to update phone number:",
        error,
      );

      toast.add({
        title: "Unable to update phone number",
        type: "error",
        description: getErrorMessage(error),
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Sessions                                                                   */
/* -------------------------------------------------------------------------- */

export function useSessions() {
  return useQuery({
    queryKey: ["account-sessions"],

    queryFn: () =>
      apiClient.get<Session[]>(
        "/api/me/sessions",
      ),
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      apiClient.delete(
        `/api/me/sessions/${sessionId}`,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account-sessions"],
      });

      toast.add({
        title: "Session revoked",
        type: "success",
        description:
          "The selected session has been signed out.",
      });
    },

    onError: (error) => {
      console.error(
        "Failed to revoke session:",
        error,
      );

      toast.add({
        title: "Unable to revoke session",
        type: "error",
        description: getErrorMessage(error),
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Connected accounts                                                         */
/* -------------------------------------------------------------------------- */

export function useConnectedAccounts() {
  return useQuery({
    queryKey: ["connected-accounts"],

    queryFn: () =>
      apiClient.get<ConnectedAccount[]>(
        "/api/me/accounts",
      ),
  });
}

export function useDisconnectAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) =>
      apiClient.delete(
        `/api/me/accounts/${accountId}`,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connected-accounts"],
      });

      toast.add({
        title: "Account disconnected",
        type: "success",
        description:
          "The connected account has been removed.",
      });
    },

    onError: (error) => {
      console.error(
        "Failed to disconnect account:",
        error,
      );

      toast.add({
        title: "Unable to disconnect account",
        type: "error",
        description: getErrorMessage(error),
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Export account data                                                        */
/* -------------------------------------------------------------------------- */

export function useExportAccountData() {
  return useMutation({
    mutationFn: () =>
      apiClient.get("/api/me/export"),

    onSuccess: () => {
      toast.add({
        title: "Data export ready",
        type: "success",
        description:
          "Your account data has been prepared.",
      });
    },

    onError: (error) => {
      console.error(
        "Failed to export account data:",
        error,
      );

      toast.add({
        title: "Unable to export data",
        type: "error",
        description: getErrorMessage(error),
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Delete account                                                             */
/* -------------------------------------------------------------------------- */

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (input: {
      confirmation: "DELETE";
      password?: string;
    }) =>
      apiClient.delete("/api/me", {
        body: input,
      }),

    onSuccess: () => {
      toast.add({
        title: "Account deleted",
        type: "success",
        description:
          "Your account has been permanently deleted.",
      });
    },

    onError: (error) => {
      console.error(
        "Failed to delete account:",
        error,
      );

      toast.add({
        title: "Unable to delete account",
        type: "error",
        description: getErrorMessage(error),
      });
    },
  });
}