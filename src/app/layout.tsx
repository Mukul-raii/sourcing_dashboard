import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Bharat Dashboard",
  description: "Next Bharat Ventures Deal Pipeline & Automation Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F7F6F6] text-[#090B0B]">
        <header className="bg-[#1A2340] text-[#F7F6F6] p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-[#F9A822] flex items-center justify-center font-bold text-[#1A2340]">NB</div>
              <h1 className="text-xl font-bold">Pipeline Dashboard</h1>
            </div>
            <nav className="hidden md:flex gap-4 border-l border-gray-600 pl-6">
              <Link href="/" className="hover:text-[#F9A822] transition-colors font-medium text-sm">Deals</Link>
              <Link href="/log-monitor" className="hover:text-[#F9A822] transition-colors font-medium text-sm">Log Monitor</Link>
            </nav>
          </div>
          <div>
            <span className="text-sm hidden sm:inline-block">Power of Community</span>
          </div>
        </header>
        <main className="flex-1 overflow-hidden p-6 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
