import type { Metadata } from "next";
import Link from 'next/link';
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Bharat Deal Pipeline",
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
          <div className="flex items-center gap-4">
            {/* Simple logo placeholder for Next Bharat */}
            <div className="w-8 h-8 rounded bg-[#F9A822] flex items-center justify-center font-bold text-[#1A2340]">NB</div>
            <h1 className="text-xl font-bold">Deal Pipeline</h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-[#F9A822] transition-colors">Pipeline</Link>
            <Link href="/logs" className="text-sm font-medium hover:text-[#F9A822] transition-colors">Log Monitor</Link>
            <Link href="/dataroom" className="text-sm font-medium hover:text-[#F9A822] transition-colors">Data Room</Link>
            <span className="text-sm italic ml-4 opacity-75">Power of Community</span>
          </nav>
        </header>
        <main className="flex-1 overflow-hidden p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
