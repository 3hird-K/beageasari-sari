"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  date: string;
  customer: string;
  cashier: string;
  items: number;
  total: number;
  status: string;
}

export function ExportCsvButton({ transactions }: { transactions: Transaction[] }) {
  const handleExport = () => {
    // Define CSV headers
    const headers = ["Transaction ID", "Date", "Customer", "Cashier", "Items", "Total (PHP)", "Status"];
    
    // Map transactions to CSV rows
    const csvRows = transactions.map(t => [
      t.id,
      `"${t.date}"`,
      `"${t.customer}"`,
      `"${t.cashier}"`,
      t.items,
      t.total.toFixed(2),
      t.status
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    // Create a Blob and download it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" className="shrink-0 gap-2" onClick={handleExport}>
      <Download className="size-4" />
      Export CSV
    </Button>
  );
}
