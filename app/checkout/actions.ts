"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bacaKeranjang, simpanKeranjang } from "@/lib/cart";

type FormState = { error?: string } | undefined;

// dipakai lewat useActionState, jadi argumen pertama adalah state sebelumnya
export async function buatPesanan(prevState: FormState) {
  // 1. Wajib login
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // 2. Baca keranjang; kalau kosong, kembali ke katalog
  const keranjang = await bacaKeranjang();
  if (keranjang.length === 0) {
    redirect("/produk");
  }

  // 3. Ambil produk terkait dari database
  const ids = keranjang.map((item) => item.productId);
  const produk = await prisma.product.findMany({
    where: { id: { in: ids } },
  });

  // 4. Validasi stok + siapkan data item (harga diambil dari DB)
  const items: { productId: number; quantity: number; price: number }[] = [];
  let total = 0;

  for (const item of keranjang) {
    const p = produk.find((x) => x.id === item.productId);
    if (!p) {
      return { error: "Ada produk di keranjang yang sudah tidak tersedia." };
    }
    if (p.stock < item.quantity) {
      return {
        error: `Stok "${p.name}" tinggal ${p.stock}, tidak cukup untuk ${item.quantity}.`,
      };
    }

    total += p.price * item.quantity;
    items.push({
      productId: p.id,
      quantity: item.quantity,
      price: p.price, // harga DB saat ini, bukan dari browser
    });
  }

  // 5. Simpan pesanan + kurangi stok dalam SATU transaksi
  const order = await prisma.$transaction(async (tx) => {
    // 5a. Buat Order beserta OrderItem-nya sekaligus (nested create)
    const baru = await tx.order.create({
      data: {
        userId: Number(session.user.id),
        total,
        items: {
          create: items,
        },
      },
    });

    // 5b. Kurangi stok tiap produk
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return baru;
  });

  // 6. Kosongkan keranjang
  await simpanKeranjang([]);

  // 7. Arahkan ke halaman sukses
  redirect(`/checkout/sukses?order=${order.id}`);
}
