"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Minus, Trash2, ShoppingBag, Banknote, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Groceries", "Snacks", "Drinks", "Condiments", "Essentials"];

const PRODUCTS = [
  { id: "1", name: "Pancit Canton", category: "Groceries", price: 18.00, image: "🍜", color: "bg-orange-500/10 text-orange-600" },
  { id: "2", name: "Corned Beef", category: "Groceries", price: 45.00, image: "🥫", color: "bg-red-500/10 text-red-600" },
  { id: "3", name: "Sardines", category: "Groceries", price: 22.00, image: "🐟", color: "bg-blue-500/10 text-blue-600" },
  { id: "4", name: "Chicharon", category: "Snacks", price: 35.00, image: "🥓", color: "bg-amber-500/10 text-amber-600" },
  { id: "5", name: "SkyFlakes", category: "Snacks", price: 6.50, image: "🍘", color: "bg-yellow-500/10 text-yellow-600" },
  { id: "6", name: "Boy Bawang", category: "Snacks", price: 15.00, image: "🧄", color: "bg-slate-500/10 text-slate-600" },
  { id: "7", name: "Soy Sauce", category: "Condiments", price: 20.00, image: "🫙", color: "bg-zinc-500/10 text-zinc-600" },
  { id: "8", name: "Banana Ketchup", category: "Condiments", price: 30.00, image: "🍅", color: "bg-red-500/10 text-red-600" },
  { id: "9", name: "3-in-1 Coffee", category: "Drinks", price: 12.00, image: "☕", color: "bg-amber-700/10 text-amber-800" },
  { id: "10", name: "Coke Kasalo", category: "Drinks", price: 40.00, image: "🥤", color: "bg-rose-500/10 text-rose-600" },
  { id: "11", name: "Bigas (1kg)", category: "Essentials", price: 55.00, image: "🍚", color: "bg-slate-500/10 text-slate-600" },
  { id: "12", name: "Eggs (1 doz)", category: "Essentials", price: 100.00, image: "🥚", color: "bg-yellow-500/10 text-yellow-600" },
];

type CartItem = {
  product: typeof PRODUCTS[0];
  quantity: number;
};

export default function PosPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const addToCart = (product: typeof PRODUCTS[0]) => {
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

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% mock tax
  const total = subtotal + tax;

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
            {CATEGORIES.map((cat) => (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200 active:scale-95 group border-border/50 bg-background overflow-hidden flex flex-col h-full"
                onClick={() => addToCart(product)}
              >
                <div className={cn("aspect-square flex items-center justify-center text-5xl transition-colors", product.color)}>
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {product.image}
                  </div>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{product.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
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
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <LayoutGrid className="size-12 mb-4 opacity-20" />
              <p>No products found in this category.</p>
            </div>
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
                <div className={cn("size-10 rounded-lg flex items-center justify-center text-xl shrink-0", item.product.color)}>
                  {item.product.image}
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
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono">₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (8%)</span>
              <span className="font-mono">₱{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/50">
              <span>Total</span>
              <span className="font-mono text-primary">₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="h-12 border-destructive text-destructive hover:bg-destructive/10"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              <Trash2 className="mr-2 size-4" />
              Clear
            </Button>
            <Button 
              className="h-12"
              disabled={cart.length === 0}
            >
              <Banknote className="mr-2 size-4" />
              Record
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
