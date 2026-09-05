"use client";

import { Receipt } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { EmptyState } from "@/src/components/dashboard/empty-state";
import { useOrders, type Order } from "@/src/hooks/use-orders";
import { formatCurrency, formatDate } from "@/src/lib/format";

const STATUS_VARIANT: Record<Order["status"], "default" | "secondary" | "destructive" | "outline"> = {
  PAID: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
};

export default function PurchasesPage() {
  const { data, isLoading } = useOrders();

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No purchases yet"
        description="Your order history and receipts show up here once you buy a program."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              {order.course?.title ?? "Unknown course"}
            </TableCell>
            <TableCell className="tabular-nums">
              {formatCurrency(order.amountCents, order.currency)}
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {formatDate(order.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
