"use client";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  MessageSquare, 
  Video, 
  FileText,
  ShoppingCart,
  Package,
  TrendingUp,
  Cpu
} from "lucide-react";

export default function GetHelpPage() {
  return (
    <div className="flex-1 space-y-3 p-6 pt-6 bg-background min-h-screen text-foreground">
      <PageHeader
        supertitle="SUPPORT CENTER"
        title="Get Help & Documentation"
        subtitle="Learn how to navigate your POS system and get the most out of your inventory management."
      />

      {/* Search Header */}
      <Card className="border-none bg-gradient-to-br from-primary/10 via-background to-background shadow-none">
        <CardContent className="pt-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search for guides, POS setup, or troubleshooting..." 
              className="pl-10 h-12 bg-background/80 border-border/50 shadow-sm text-sm"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-accent/50 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-accent">Checkout</Badge>
            <Badge variant="secondary" className="bg-accent/50 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-accent">Inventory</Badge>
            <Badge variant="secondary" className="bg-accent/50 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-accent">Reports</Badge>
            <Badge variant="secondary" className="bg-accent/50 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-accent">Hardware</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* POS Guide */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <ShoppingCart className="size-4 text-primary" />
            </div>
            <CardTitle className="text-base font-bold tracking-tight">Point of Sale (POS) Guide</CardTitle>
            <CardDescription className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed">
              Learn how to process transactions, scan items, apply discounts, and manage cash shifts seamlessly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto text-[11px] font-bold uppercase tracking-widest text-primary hover:no-underline">
              Read Checkout Guide →
            </Button>
          </CardContent>
        </Card>

        {/* Inventory Guide */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center mb-2">
              <Package className="size-4 text-orange-500" />
            </div>
            <CardTitle className="text-base font-bold tracking-tight">Inventory Management</CardTitle>
            <CardDescription className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed">
              How to add new products, update stock quantities, set low-stock alerts, and organize categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto text-[11px] font-bold uppercase tracking-widest text-orange-500 hover:no-underline">
              View Inventory Logic →
            </Button>
          </CardContent>
        </Card>

        {/* Sales & Reports */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
              <TrendingUp className="size-4 text-emerald-500" />
            </div>
            <CardTitle className="text-base font-bold tracking-tight">Sales & Reports Tracking</CardTitle>
            <CardDescription className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed">
              Analyze your store&apos;s performance with daily sales summaries, profit tracking, and best-selling product charts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto text-[11px] font-bold uppercase tracking-widest text-emerald-500 hover:no-underline">
              Reporting Guide →
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* FAQs */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I void a transaction or remove an item?</AccordionTrigger>
                <AccordionContent>
                  During an active transaction in the POS tab, you can click the trash icon next to any item in the cart to remove it. To void a completed transaction, you need manager access and must navigate to the Sales history page.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I add a new product to the inventory?</AccordionTrigger>
                <AccordionContent>
                  Navigate to the Inventory page and click the &quot;Add Product&quot; button. You&apos;ll need to enter the product name, SKU or barcode, price, category, and initial stock quantity.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What happens when a product is out of stock?</AccordionTrigger>
                <AccordionContent>
                  When an item&apos;s stock reaches zero, it will still appear in the POS but will have a visual indicator. The system will also generate a &quot;Low Stock&quot; or &quot;Out of Stock&quot; notification if you have configured those alerts in Settings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I connect the receipt printer?</AccordionTrigger>
                <AccordionContent>
                  Make sure the receipt printer is plugged in and turned on. Go to Settings &gt; Store to view connected hardware. The system supports standard POS printers via USB or local network. Check the hardware integration guide for specific printer setups.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Can I view sales from a previous shift?</AccordionTrigger>
                <AccordionContent>
                  Yes, navigate to the Reports page. You can filter the dashboard by &quot;Today&quot;, &quot;Yesterday&quot;, &quot;This Week&quot;, or select a custom date range to review past transactions and shift summaries.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>How do I handle &quot;Utang&quot; (Credit) for regular customers?</AccordionTrigger>
                <AccordionContent>
                  When checking out an order in the POS, select &quot;Utang&quot; as the payment method. You will be prompted to select or add the customer&apos;s name. Their unpaid balance will be tracked in the customer tabs section.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>How do I set up &quot;Tingi&quot; (Per Piece) pricing?</AccordionTrigger>
                <AccordionContent>
                  When adding a product like a pack of cigarettes or coffee sachets, you can enable &quot;Tingi Mode&quot; in the item settings. This allows you to track the bulk stock while selling individual pieces at a separate retail price.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold tracking-tight">Still need help?</CardTitle>
              <CardDescription className="text-[11px] font-medium text-muted-foreground/60">
                Reach out for technical support with your Beagea POS system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 border-border/50 h-10">
                <MessageSquare className="size-4 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-bold">Start a Support Ticket</p>
                  <p className="text-[10px] text-muted-foreground">Response time: &lt; 2 hours</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-border/50 h-10">
                <Video className="size-4 text-orange-500" />
                <div className="text-left">
                  <p className="text-xs font-bold">Watch Setup Tutorials</p>
                  <p className="text-[10px] text-muted-foreground">Hardware & software setup guides</p>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 border-border/50 h-10">
                <FileText className="size-4 text-emerald-500" />
                <div className="text-left">
                  <p className="text-xs font-bold">Download User Manual</p>
                  <p className="text-[10px] text-muted-foreground">Comprehensive PDF guide (v2.0)</p>
                </div>
              </Button>
            </CardContent>
          </Card>
          
          <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-4">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Cpu className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-foreground">Beagea POS v2.0.1</p>
              <p className="text-[11px] text-muted-foreground">Your store management system is running the latest stable build.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
