"use client";

import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const inventoryData = [
  { id: "INV-001", name: "Pancit Canton", category: "Groceries", sku: "GRO-PAN-01", stock: 145, status: "In Stock", price: 18.00 },
  { id: "INV-002", name: "Corned Beef", category: "Groceries", sku: "GRO-COR-01", stock: 12, status: "Low Stock", price: 45.00 },
  { id: "INV-003", name: "Sardines", category: "Groceries", sku: "GRO-SAR-01", stock: 0, status: "Out of Stock", price: 22.00 },
  { id: "INV-004", name: "Chicharon", category: "Snacks", sku: "SNA-CHI-01", stock: 340, status: "In Stock", price: 35.00 },
  { id: "INV-005", name: "SkyFlakes", category: "Snacks", sku: "SNA-SKY-01", stock: 85, status: "In Stock", price: 6.50 },
  { id: "INV-006", name: "Boy Bawang", category: "Snacks", sku: "SNA-BOY-01", stock: 120, status: "In Stock", price: 15.00 },
  { id: "INV-007", name: "Soy Sauce", category: "Condiments", sku: "CON-SOY-01", stock: 45, status: "In Stock", price: 20.00 },
  { id: "INV-008", name: "Banana Ketchup", category: "Condiments", sku: "CON-BAN-01", stock: 5, status: "Low Stock", price: 30.00 },
  { id: "INV-009", name: "3-in-1 Coffee", category: "Drinks", sku: "DRI-COF-01", stock: 200, status: "In Stock", price: 12.00 },
  { id: "INV-010", name: "Coke Kasalo", category: "Drinks", sku: "DRI-COK-01", stock: 150, status: "In Stock", price: 40.00 },
  { id: "INV-011", name: "Bigas (1kg)", category: "Essentials", sku: "ESS-BIG-01", stock: 50, status: "In Stock", price: 55.00 },
  { id: "INV-012", name: "Eggs (1 doz)", category: "Essentials", sku: "ESS-EGG-01", stock: 30, status: "In Stock", price: 100.00 },
];

export default function InventoryPage() {
  return (
    <div className="flex-1 space-y-4 p-6 bg-muted/10 h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage your products, stock levels, and pricing.</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="text-lg font-semibold">Products</CardTitle>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, SKUs..."
                  className="pl-8 bg-background"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[100px]">SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.sku}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-xs bg-muted text-muted-foreground hover:bg-muted">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">₱{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">{item.stock}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={
                        item.status === "In Stock" ? "default" 
                        : item.status === "Low Stock" ? "secondary" 
                        : "outline"
                      }
                      className={
                        item.status === "In Stock" ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20" 
                        : item.status === "Low Stock" ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20" 
                        : "bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
