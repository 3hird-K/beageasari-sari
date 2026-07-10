"use client";

import { useState } from "react";
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  status: string;
  price: number;
};

const initialInventoryData: Product[] = [
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
  const [products, setProducts] = useState<Product[]>(initialInventoryData);
  const [search, setSearch] = useState("");
  
  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sku: "",
    price: "",
    stock: "",
  });

  const getStatus = (stock: number) => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= 20) return "Low Stock";
    return "In Stock";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ name: "", category: "", sku: "", price: "", stock: "" });
    setIsAddOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      sku: product.sku,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setIsEditOpen(true);
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newProduct: Product = {
      id: `INV-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`,
      name: formData.name,
      category: formData.category || "Uncategorized",
      sku: formData.sku || `SKU-${Math.floor(Math.random() * 1000)}`,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      status: getStatus(parseInt(formData.stock)),
    };

    setProducts([newProduct, ...products]);
    setIsAddOpen(false);
    toast.success("Product added successfully!");
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    
    setProducts(products.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          name: formData.name,
          category: formData.category,
          sku: formData.sku,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          status: getStatus(parseInt(formData.stock)),
        };
      }
      return p;
    }));
    
    setIsEditOpen(false);
    toast.success("Product updated successfully!");
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success("Product deleted.");
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-6 bg-muted/10 h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage your products, stock levels, and pricing.</p>
        </div>
        <Button onClick={openAddModal} className="shrink-0 gap-2">
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((item) => (
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
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(item)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => handleDeleteProduct(item.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Milo" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                    <SelectItem value="Condiments">Condiments</SelectItem>
                    <SelectItem value="Drinks">Drinks</SelectItem>
                    <SelectItem value="Essentials">Essentials</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₱) *</Label>
                <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct}>Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Product Name *</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                    <SelectItem value="Condiments">Condiments</SelectItem>
                    <SelectItem value="Drinks">Drinks</SelectItem>
                    <SelectItem value="Essentials">Essentials</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input id="edit-sku" name="sku" value={formData.sku} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (₱) *</Label>
                <Input id="edit-price" name="price" type="number" value={formData.price} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock Quantity *</Label>
                <Input id="edit-stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

