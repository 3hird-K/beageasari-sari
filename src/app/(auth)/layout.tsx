import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECF1EC] p-4">
      {children}
    </div>
  );
}
