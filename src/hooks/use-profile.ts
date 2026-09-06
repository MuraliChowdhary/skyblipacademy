import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";
import { toast } from "../components/ui/toast";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  createdAt: string;
};

// function errorMessage(err: unknown): string {
//   return err instanceof ApiRequestError ? err.message : "Something went wrong.";
// }

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.get<Profile>("/api/me"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) =>
      apiClient.patch<Profile>("/api/me", { name }),

    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);

      toast.add({
        title: "Profile updated",
        type: "success",
        description: "Your profile has been updated successfully.",
      });
    },

    onError: () => {
      toast.add({
        title: "Unable to update profile",
        type: "error",
        description:
          "We couldn't update your profile. Please try again.",
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: {
      currentPassword: string;
      newPassword: string;
    }) =>
      apiClient.post<{ success: true }>(
        "/api/me/change-password",
        input
      ),

    onSuccess: () => {
      toast.add({
        title: "Password changed",
        type: "success",
        description: "Your password has been changed successfully.",
      });
    },

    onError: () => {
      toast.add({
        title: "Unable to change password",
        type: "error",
        description:
          "We couldn't change your password. Please check your current password and try again.",
      });
    },
  });
}
