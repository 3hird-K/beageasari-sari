"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface TopProductData {
  name: string;
  category: string;
  quantity: number;
  revenue: number;
  stock: number;
}

export function TopProductsTable({ data }: { data: TopProductData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center p-6 text-sm text-muted-foreground">
        No data available for top products.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Product</TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Qty Sold</TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Revenue</TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.name} className="border-border/50 hover:bg-white/5 transition-colors">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground/50 w-4">{index + 1}.</span>
                  {product.name}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize text-[10px] bg-primary/5 text-primary border-primary/20">
                  {product.category || "Uncategorized"}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {product.quantity}
              </TableCell>
              <TableCell className="text-right font-bold text-primary">
                ₱{product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-right">
                <span className={cn(
                  "font-medium", 
                  product.stock <= 10 ? "text-amber-500" : "text-muted-foreground"
                )}>
                  {product.stock}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
