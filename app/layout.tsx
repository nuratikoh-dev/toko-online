import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { bacaKeranjang } from "@/lib/cart";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toko Online",
  description: "Toko online dibangun dengan Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const itemsKeranjang = await bacaKeranjang();
  const jumlahItem = itemsKeranjang.reduce((jml, it) => jml + it.quantity, 0);

  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
