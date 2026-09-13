"use server";

import { revalidatePath } from "next/cache";
import { bacaKeranjang, simpanKeranjang } from "@/lib/cart";

export async function tambahKeKeranjang(productId: number) {
  const items = await bacaKeranjang();
  const adaItem = items.find((it) => it.productId === productId);

  if (adaItem) {
    adaItem.quantity += 1;
  } else {
    items.push({ productId, quantity: 1 });
  }

  await simpanKeranjang(items);
  revalidatePath("/keranjang");
}

export async function ubahJumlah(productId: number, jumlah: number) {
  let items = await bacaKeranjang();

  if (jumlah <= 0) {
    items = items.filter((it) => it.productId !== productId);
  } else {
    const adaItem = items.find((it) => it.productId === productId);
    if (adaItem) {
      adaItem.quantity = jumlah;
    } else {
      items.push({ productId, quantity: jumlah });
    }
  }

  await simpanKeranjang(items);
  revalidatePath("/keranjang");
}

export async function hapusDariKeranjang(productId: number) {
  const items = await bacaKeranjang();
  const sisa = items.filter((it) => it.productId !== productId);

  await simpanKeranjang(sisa);
  revalidatePath("/keranjang");
}
