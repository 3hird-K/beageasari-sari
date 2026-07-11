"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Minus, Trash2, ShoppingBag, Banknote, LayoutGrid, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { recordSaleAction } from "./actions";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock_quantity: number;
  price: number;
  color: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

export default function PosPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, products]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === id) {
          const newQ = item.quantity + delta;
          return { ...item, quantity: Math.max(0, newQ) };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleRecordSale = async () => {
    if (cart.length === 0) return;
    setIsRecording(true);
    
    const items = cart.map(item => ({
      id: item.product.id,
      quantity: item.quantity
    }));

    const result = await recordSaleAction(items);
    
    if (result.success) {
      toast.success("Sale recorded successfully!");
      clearCart();
      fetchProducts(); // Refresh stock quantities
    } else {
      toast.error("Failed to record sale. Please try again.");
    }
    
    setIsRecording(false);
  };

  return (
    <div className="flex h-full flex-col lg:flex-row overflow-hidden bg-muted/10">
      {/* Left Panel: Products */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border/50">
        <div className="p-4 bg-background border-b border-border/50 space-y-4 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products (e.g. Sardines, Shampoo...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-transparent focus-visible:border-primary transition-all rounded-xl"
              />
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full whitespace-nowrap px-4 shadow-none transition-all",
                  selectedCategory === cat 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-background hover:bg-muted"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-muted/20 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <LayoutGrid className="size-12 mb-4 animate-pulse opacity-20" />
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200 active:scale-95 group border-border/50 bg-background overflow-hidden flex flex-col h-[120px]"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-4 flex-1 flex flex-col justify-between gap-2 h-full">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 pr-2">
                          <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.category}</p>
                        </div>
                        <div className={cn("size-8 rounded-full flex flex-shrink-0 items-center justify-center text-xs font-bold", product.color)}>
                          {product.name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-auto">
                        <span className="font-bold text-base">
                          ₱{product.price.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="size-3 mr-0.5" /> Add
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground mt-12">
                  <LayoutGrid className="size-12 mb-4 opacity-20" />
                  <p>No products found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel: Cart */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col bg-background shadow-xl lg:shadow-none z-20 shrink-0">
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card text-card-foreground shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            <h2 className="font-bold text-lg tracking-tight">Current Order</h2>
          </div>
          <Badge variant="secondary" className="font-mono bg-muted/50">
            {cart.reduce((a, b) => a + b.quantity, 0)} Items
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 space-y-4">
              <ShoppingBag className="size-16" strokeWidth={1} />
              <p className="text-sm font-medium">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-xl border border-border/50 group hover:border-border transition-colors">
                <div className={cn("size-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0", item.product.color)}>
                  {item.product.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{item.product.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono">
                    ₱{item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-sm font-mono">
                    ₱{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 bg-background rounded-md border border-border shadow-sm p-0.5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, -1); }}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.quantity === 1 ? <Trash2 className="size-3 text-rose-500" /> : <Minus className="size-3" />}
                    </button>
                    <span className="w-5 text-center text-xs font-semibold">{item.quantity}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, 1); }}
                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-muted/10 border-t border-border/50 space-y-4 shrink-0">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="font-mono text-primary">₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={clearCart}
              disabled={cart.length === 0 || isRecording}
            >
              <Trash2 className="mr-2 size-4" />
              Clear
            </Button>
            <Button 
              disabled={cart.length === 0 || isRecording}
              onClick={handleRecordSale}
            >
              {isRecording ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Banknote className="mr-2 size-4" />
              )}
              {isRecording ? "Recording..." : "Record"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
