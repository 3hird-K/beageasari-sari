"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { TransactionActions } from "./transaction-actions";
import { TablePagination } from "@/components/dashboard/table-pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Transaction {
  id: string;
  rawId: string;
  date: string;
  customer: string;
  cashier: string;
  items: number;
  total: number;
  status: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  isAdmin: boolean;
}

export function TransactionsTable({ transactions, isAdmin }: TransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [columns, setColumns] = useState({
    date: true,
    customer: true,
    cashier: true,
    items: true,
    total: true,
    status: true,
  });

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <Settings2 className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {Object.keys(columns).map((key) => {
              return (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize"
                  checked={columns[key as keyof typeof columns]}
                  onCheckedChange={(value) =>
                    setColumns((prev) => ({ ...prev, [key]: !!value }))
                  }
                >
                  {key}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border border-border/50">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[140px] pl-6">Transaction ID</TableHead>
              {columns.date && <TableHead>Date</TableHead>}
              {columns.customer && <TableHead>Customer</TableHead>}
              {columns.cashier && <TableHead>Cashier</TableHead>}
              {columns.items && <TableHead className="text-right">Items</TableHead>}
              {columns.total && <TableHead className="text-right">Total</TableHead>}
              {columns.status && <TableHead className="text-right pr-6">Status</TableHead>}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((trx) => (
                <TableRow key={trx.rawId} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground pl-6">
                    {trx.id}
                  </TableCell>
                  {columns.date && <TableCell className="text-sm">{trx.date}</TableCell>}
                  {columns.customer && <TableCell>{trx.customer}</TableCell>}
                  {columns.cashier && <TableCell className="text-muted-foreground">{trx.cashier}</TableCell>}
                  {columns.items && <TableCell className="text-right font-medium">{trx.items}</TableCell>}
                  {columns.total && <TableCell className="text-right font-mono">₱{trx.total.toFixed(2)}</TableCell>}
                  {columns.status && (
                    <TableCell className="text-right pr-6">
                      <Badge 
                        variant={trx.status === "Completed" ? "default" : "secondary"}
                        className={
                          trx.status === "Completed" 
                            ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20" 
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {trx.status}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="pr-6">
                    <TransactionActions orderId={trx.rawId} currentStatus={trx.status.toLowerCase()} isAdmin={isAdmin} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={currentPage}
        totalPages={totalPages}
        pageSize={itemsPerPage}
        totalItems={transactions.length}
        itemLabel="transactions"
        onPageChange={setCurrentPage}
        onPageSizeChange={(s) => {
          setItemsPerPage(s);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
