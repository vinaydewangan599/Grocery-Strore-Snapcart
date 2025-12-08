import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";



export const metadata: Metadata = {
  title: "SnapCart",
  description: "10 min grocery delivery service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from bg-green-50 to-white">
        <Provider>{children}</Provider> 
        
      </body>
    </html>
  );
}
