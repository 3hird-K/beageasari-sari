"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Package, DollarSign, AlertTriangle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { addProductAction, updateProductAction, deleteProductAction } from "./actions";
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TablePagination } from "@/components/dashboard/table-pagination";

type Product = {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock_quantity: number;
  price: number;
  color: string;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Columns State
  const [columns, setColumns] = useState({
    category: true,
    price: true,
    stock: true,
    status: true,
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    } else {
      console.error("Error fetching products:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSupplyOpen, setIsSupplyOpen] = useState(false);
  
  // Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [supplyQuantity, setSupplyQuantity] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
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
    setFormData({ name: "", category: "", price: "", stock: "" });
    setIsAddOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock_quantity.toString(),
    });
    setIsEditOpen(true);
  };

  const openSupplyModal = (product: Product) => {
    setEditingProduct(product);
    setSupplyQuantity("");
    setIsSupplyOpen(true);
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const colorClasses = [
      "bg-orange-500/10 text-orange-600",
      "bg-red-500/10 text-red-600",
      "bg-blue-500/10 text-blue-600",
      "bg-amber-500/10 text-amber-600",
      "bg-slate-500/10 text-slate-600",
      "bg-zinc-500/10 text-zinc-600",
      "bg-rose-500/10 text-rose-600",
    ];
    const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];

    const res = await addProductAction({
      name: formData.name,
      category: formData.category || "Uncategorized",
      sku: `SKU-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock),
      color: randomColor,
    });

    if (res.success) {
      setIsAddOpen(false);
      toast.success("Product added successfully!");
      fetchProducts();
    } else {
      toast.error(res.error || "Failed to add product.");
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    
    const res = await updateProductAction(editingProduct.id, {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock),
    });

    if (res.success) {
      setIsEditOpen(false);
      toast.success("Product updated successfully!");
      fetchProducts();
    } else {
      toast.error(res.error || "Failed to update product.");
    }
  };

  const handleSupplyStock = async () => {
    if (!editingProduct) return;
    const addedStock = parseInt(supplyQuantity);
    if (isNaN(addedStock) || addedStock <= 0) {
      toast.error("Please enter a valid stock quantity to supply.");
      return;
    }
    
    const res = await updateProductAction(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      price: editingProduct.price,
      stock_quantity: editingProduct.stock_quantity + addedStock,
    });

    if (res.success) {
      setIsSupplyOpen(false);
      toast.success(`Successfully added ${addedStock} stock to ${editingProduct.name}!`);
      fetchProducts();
    } else {
      toast.error(res.error || "Failed to supply stock.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await deleteProductAction(id);
    if (res.success) {
      toast.success("Product deleted.");
      fetchProducts();
    } else {
      toast.error(res.error || "Failed to delete product.");
    }
  };

  const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase());
    
    const status = getStatus(p.stock_quantity);
    const matchesStock = stockStatusFilter === "all" || status.toLowerCase() === stockStatusFilter.toLowerCase();
    
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;

    return matchesSearch && matchesStock && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Unique items in inventory</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Estimated inventory value</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 20).length}
            </div>
            <p className="text-xs text-muted-foreground">Items with 20 or less stock</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.stock_quantity <= 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Items needing restock</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardTitle className="text-lg font-semibold">Products</CardTitle>
            <div className="flex w-full sm:w-auto items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="relative w-full sm:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, SKUs..."
                  className="pl-8 bg-background"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockStatusFilter} onValueChange={(v) => { setStockStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in stock">In Stock</SelectItem>
                  <SelectItem value="low stock">Low Stock</SelectItem>
                  <SelectItem value="out of stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Filter className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[150px]">
                  <DropdownMenuCheckboxItem
                    checked={columns.category}
                    onCheckedChange={(checked) => setColumns(prev => ({ ...prev, category: checked }))}
                  >
                    Category
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columns.price}
                    onCheckedChange={(checked) => setColumns(prev => ({ ...prev, price: checked }))}
                  >
                    Price
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columns.stock}
                    onCheckedChange={(checked) => setColumns(prev => ({ ...prev, stock: checked }))}
                  >
                    Stock
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columns.status}
                    onCheckedChange={(checked) => setColumns(prev => ({ ...prev, status: checked }))}
                  >
                    Status
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[100px]">SKU</TableHead>
                <TableHead>Product Name</TableHead>
                {columns.category && <TableHead>Category</TableHead>}
                {columns.price && <TableHead className="text-right">Price</TableHead>}
                {columns.stock && <TableHead className="text-right">Stock</TableHead>}
                {columns.status && <TableHead className="text-right">Status</TableHead>}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={Object.values(columns).filter(Boolean).length + 3} className="h-24 text-center text-muted-foreground">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={Object.values(columns).filter(Boolean).length + 3} className="h-24 text-center text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((item) => {
                  const status = getStatus(item.stock_quantity);
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.sku}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      {columns.category && (
                        <TableCell>
                          <Badge variant="secondary" className="font-normal text-xs bg-muted text-muted-foreground hover:bg-muted">
                            {item.category}
                          </Badge>
                        </TableCell>
                      )}
                      {columns.price && <TableCell className="text-right font-mono">₱{Number(item.price).toFixed(2)}</TableCell>}
                      {columns.stock && <TableCell className="text-right font-medium">{item.stock_quantity}</TableCell>}
                      {columns.status && (
                        <TableCell className="text-right">
                          <Badge 
                            variant={
                              status === "In Stock" ? "default" 
                              : status === "Low Stock" ? "secondary" 
                              : "outline"
                            }
                            className={
                              status === "In Stock" ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20" 
                              : status === "Low Stock" ? "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20" 
                              : "bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/20"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSupplyModal(item)}>
                              <Package className="mr-2 h-4 w-4 text-emerald-500" /> Supply Stock
                            </DropdownMenuItem>
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            pageSize={itemsPerPage}
            totalItems={filteredProducts.length}
            itemLabel="products"
            onPageChange={setCurrentPage}
            onPageSizeChange={(s) => {
              setItemsPerPage(s);
              setCurrentPage(1);
            }}
          />
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
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                name="category" 
                list="category-options" 
                value={formData.category} 
                onChange={handleInputChange} 
                placeholder="Type or select a category"
              />
              <datalist id="category-options">
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
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
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input 
                id="edit-category" 
                name="category" 
                list="category-options-edit" 
                value={formData.category} 
                onChange={handleInputChange} 
                placeholder="Type or select a category"
              />
              <datalist id="category-options-edit">
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
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

      {/* Supply Stock Modal */}
      <Dialog open={isSupplyOpen} onOpenChange={setIsSupplyOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Supply Stock</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Product</span>
              <span className="font-semibold text-lg">{editingProduct?.name}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Current Stock</span>
              <span className="font-semibold">{editingProduct?.stock_quantity}</span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supply-quantity">Quantity to Add *</Label>
              <Input 
                id="supply-quantity" 
                type="number" 
                placeholder="e.g. 50" 
                value={supplyQuantity} 
                onChange={(e) => setSupplyQuantity(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSupplyStock();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSupplyOpen(false)}>Cancel</Button>
            <Button onClick={handleSupplyStock} className="bg-emerald-600 hover:bg-emerald-700 text-white">Add Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

