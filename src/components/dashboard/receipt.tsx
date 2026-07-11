import { forwardRef } from "react";
import { format } from "date-fns";

export type ReceiptItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

interface ReceiptProps {
  items: ReceiptItem[];
  total: number;
  cash?: number;
  change?: number;
  receiptNumber: string;
  date: Date;
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  ({ items, total, cash, change, receiptNumber, date }, ref) => {
    return (
      <div ref={ref} className="p-8 w-full max-w-[320px] mx-auto text-black font-mono text-sm bg-white" style={{ fontFamily: "monospace" }}>
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-bold text-xl mb-1">BEAGEA SARI-SARI</h1>
          <p className="text-xs">Your Friendly Neighborhood Store</p>
          <p className="text-xs">Brgy. Example, City</p>
          <div className="border-b-2 border-dashed border-gray-400 my-4" />
        </div>

        {/* Meta Info */}
        <div className="mb-4 text-xs space-y-1">
          <div className="flex justify-between">
            <span>Receipt:</span>
            <span>#{receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{format(date, "MMM dd, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{format(date, "hh:mm a")}</span>
          </div>
        </div>

        <div className="border-b-2 border-dashed border-gray-400 my-4" />

        {/* Items */}
        <div className="mb-4">
          <div className="flex justify-between font-bold text-xs mb-2">
            <span className="w-8">Qty</span>
            <span className="flex-1 text-left">Item</span>
            <span className="w-16 text-right">Amount</span>
          </div>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="text-xs">
                <div className="flex justify-between items-start">
                  <span className="w-8">{item.quantity}</span>
                  <span className="flex-1 text-left pr-2 break-words">{item.name}</span>
                  <span className="w-16 text-right">₱{item.total.toFixed(2)}</span>
                </div>
                {item.quantity > 1 && (
                  <div className="text-[10px] text-gray-500 ml-8">
                    @ ₱{item.price.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-b-2 border-dashed border-gray-400 my-4" />

        {/* Totals */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between font-bold text-base">
            <span>TOTAL</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          {cash !== undefined && (
            <div className="flex justify-between text-xs mt-2">
              <span>Cash</span>
              <span>₱{cash.toFixed(2)}</span>
            </div>
          )}
          {change !== undefined && (
            <div className="flex justify-between text-xs">
              <span>Change</span>
              <span>₱{change.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="border-b-2 border-dashed border-gray-400 my-4" />

        {/* Footer */}
        <div className="text-center text-xs mt-6 space-y-1">
          <p className="font-bold">Thank you for shopping!</p>
          <p>Please come again.</p>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #print-root, #print-root * {
              visibility: visible;
            }
            #print-root {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              size: auto;
              margin: 0mm;
            }
          }
        `}} />
      </div>
    );
  }
);

Receipt.displayName = "Receipt";
