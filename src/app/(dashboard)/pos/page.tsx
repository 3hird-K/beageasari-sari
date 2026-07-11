"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, Minus, Trash2, ShoppingBag, Banknote, LayoutGrid, Loader2, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { recordSaleAction } from "./actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print";
import { Receipt } from "@/components/dashboard/receipt";

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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cashReceived, setCashReceived] = useState<string>("");
  const [lastReceiptData, setLastReceiptData] = useState<any>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

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
      if (p.stock_quantity <= 0) return false;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, products]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          toast.error(`Cannot add more than available stock (${product.stock_quantity})`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      if (product.stock_quantity <= 0) {
        toast.error("Product is out of stock");
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === id) {
          const newQ = item.quantity + delta;
          if (delta > 0 && newQ > item.product.stock_quantity) {
            toast.error(`Cannot add more than available stock (${item.product.stock_quantity})`);
            return item;
          }
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
      
      // Save data for receipt before clearing cart
      const receiptData = {
        items: cart.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          total: i.product.price * i.quantity,
        })),
        total,
        cash: parseFloat(cashReceived || "0"),
        change: Math.max(0, parseFloat(cashReceived || "0") - total),
        receiptNumber: `RE-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date(),
      };
      setLastReceiptData(receiptData);

      clearCart();
      setIsCheckoutOpen(false);
      setCashReceived("");
      fetchProducts(); // Refresh stock quantities
      
      // Auto-print receipt after a short delay to allow state update
      setTimeout(() => {
        if (reactToPrintFn) {
          reactToPrintFn();
        }
      }, 500);
    } else {
      toast.error(result.error || "Failed to record sale. Please try again.");
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
                    className={cn(
                      "group cursor-pointer border-border/40 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 active:scale-[0.98] flex flex-col h-[130px] rounded-xl overflow-hidden relative",
                      product.stock_quantity <= 0 && "opacity-60 grayscale-[0.5]"
                    )}
                    onClick={() => addToCart(product)}
                  >
                    {/* Top Accent Line */}
                    <div className={cn("h-1 w-full absolute top-0 left-0", product.color.split(" ")[0])} />

                    <CardContent className="p-3 pt-4 flex flex-col h-full justify-between gap-1">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5 pr-1 overflow-hidden">
                          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                            {product.category}
                          </p>
                        </div>
                        <div className={cn("size-8 rounded-lg flex flex-shrink-0 items-center justify-center text-xs font-bold shadow-sm", product.color)}>
                          {product.name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="font-bold text-base tracking-tight">
                            ₱{product.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[10px] font-medium px-1.5 py-0.5 rounded-md", 
                            product.stock_quantity > 10 ? "text-muted-foreground bg-muted" : 
                            product.stock_quantity > 0 ? "text-amber-500 bg-amber-500/10" : 
                            "text-destructive bg-destructive/10"
                          )}>
                            {product.stock_quantity > 0 ? `${product.stock_quantity} left` : "Out"}
                          </span>
                          <div className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                            <Plus className="size-3" strokeWidth={3} />
                          </div>
                        </div>
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
              onClick={() => setIsCheckoutOpen(true)}
            >
              {isRecording ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Banknote className="mr-2 size-4" />
              )}
              {isRecording ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={(open) => !isRecording && setIsCheckoutOpen(open)}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-muted/30 p-3.5 rounded-xl border border-border/50 space-y-2.5">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Total Items</span>
                <span className="font-medium text-foreground">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
              </div>
              <div className="flex justify-between items-center font-bold border-t border-border/60 pt-2.5">
                <span className="text-base">Total Due</span>
                <span className="text-2xl text-primary tracking-tight">₱{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 px-1">
              <label className="text-sm font-medium text-foreground/90">Cash Received</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₱</span>
                <Input 
                  type="number"
                  min={0}
                  step="0.01"
                  autoFocus
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="pl-8 h-12 text-lg font-mono bg-background shadow-sm border-border"
                  placeholder="0.00"
                />
              </div>
            </div>

            {parseFloat(cashReceived) >= total && (
              <div className="flex justify-between items-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 animate-in fade-in zoom-in-95 duration-200">
                <span className="text-base">Change</span>
                <span className="text-xl tracking-tight">₱{(parseFloat(cashReceived) - total).toFixed(2)}</span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-1">
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={isRecording}>
              Cancel
            </Button>
            <Button 
              onClick={handleRecordSale} 
              disabled={isRecording || !cashReceived || parseFloat(cashReceived) < total}
            >
              {isRecording ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Printer className="mr-2 size-4" />
              )}
              {isRecording ? "Recording..." : "Record & Print"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden Receipt for Printing */}
      <div className="hidden">
        <div ref={contentRef} id="print-root">
          {lastReceiptData && (
            <Receipt
              items={lastReceiptData.items}
              total={lastReceiptData.total}
              cash={lastReceiptData.cash}
              change={lastReceiptData.change}
              receiptNumber={lastReceiptData.receiptNumber}
              date={lastReceiptData.date}
            />
          )}
        </div>
      </div>
    </div>
  );
}
