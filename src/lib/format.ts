export function formatCurrency(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    amountCents / 100,
  );
}

export function formatDate(iso: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(iso));
}
