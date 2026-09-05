import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api-client";

export type Order = {
  id: string;
  courseId: string;
  amountCents: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
  course?: { title: string; slug: string } | null;
};

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get<Order[]>("/api/orders"),
  });
}
