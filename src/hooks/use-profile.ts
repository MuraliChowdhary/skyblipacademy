import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, ApiRequestError } from "@/src/lib/api-client";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  createdAt: string;
};

function errorMessage(err: unknown): string {
  return err instanceof ApiRequestError ? err.message : "Something went wrong.";
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.get<Profile>("/api/me"),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => apiClient.patch<Profile>("/api/me", { name }),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      toast.success("Profile updated.");
    },
    onError: (err) => toast.error(errorMessage(err)),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      apiClient.post<{ success: true }>("/api/me/change-password", input),
    onSuccess: () => toast.success("Password changed."),
    onError: (err) => toast.error(errorMessage(err)),
  });
}
