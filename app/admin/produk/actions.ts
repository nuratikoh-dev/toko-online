"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { produkSchema } from "./schema";
import { simpanGambar } from "@/lib/upload";

type FormState = { error?: string } | undefined;

function buatSlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

async function cekAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "Kamu tidak punya izin untuk aksi ini" };
  }
  return null;
}

// CREATE
export async function buatProduk(prevState: FormState, formData: FormData) {
  const gagalAuth = await cekAdmin();
  if (gagalAuth) return gagalAuth;

  const hasil = produkSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    description: formData.get("description"),
  });

  if (!hasil.success) {
    return { error: hasil.error.issues[0].message };
  }

  const { name, price, stock, description } = hasil.data;
  const slug = buatSlug(name);

  let imageUrl: string | null | undefined;
  const file = formData.get("gambar") as File | null;
  if (file && file.size > 0) {
    try {
      imageUrl = await simpanGambar(file);
    } catch (e) {
      console.error("Gagal mengunggah gambar:", e);
      return { error: "Gagal mengunggah gambar. Coba lagi sebentar." };
    }
  }

  try {
    await prisma.product.create({
      data: { name, slug, price, stock, description, imageUrl },
    });
  } catch (e) {
    console.error("Gagal menyimpan produk:", e);
    return { error: "Terjadi kesalahan. Coba lagi sebentar." };
  }

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

// UPDATE
export async function ubahProduk(
  id: number,
  prevState: FormState,
  formData: FormData,
) {
  const gagalAuth = await cekAdmin();
  if (gagalAuth) return gagalAuth;

  const hasil = produkSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    description: formData.get("description"),
  });

  if (!hasil.success) {
    return { error: hasil.error.issues[0].message };
  }

  const { name, price, stock, description } = hasil.data;
  const slug = buatSlug(name);

  try {
    await prisma.product.update({
      where: { id },
      data: { name, slug, price, stock, description },
    });
  } catch (e) {
    console.error("Gagal mengubah produk:", e);
    return { error: "Terjadi kesalahan. Coba lagi sebentar." };
  }

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

// DELETE
export async function hapusProduk(id: number): Promise<FormState> {
  const gagalAuth = await cekAdmin();
  if (gagalAuth) return gagalAuth;

  try {
    await prisma.product.delete({ where: { id } });
  } catch (e) {
    console.error("Gagal menghapus produk:", e);
    return { error: "Gagal menghapus produk. Coba lagi sebentar." };
  }

  revalidatePath("/admin/produk");
  return { error: undefined };
}

// "use server";

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import { produkSchema } from "./schema";
// import { simpanGambar } from "@/lib/upload";

// type FormState = { error?: string } | undefined;

// function buatSlug(name: string) {
//   return name.toLowerCase().trim().replace(/\s+/g, "-");
// }

// async function cekAdmin() {
//   const session = await auth();
//   if (session?.user?.role !== "admin") {
//     return { error: "Kamu tidak punya izin untuk aksi ini" };
//   }
//   return null;
// }

// // CREATE
// export async function buatProduk(prevState: FormState, formData: FormData) {
//   const gagalAuth = await cekAdmin();
//   if (gagalAuth) return gagalAuth;

//   const hasil = produkSchema.safeParse({
//     name: formData.get("name"),
//     price: formData.get("price"),
//     stock: formData.get("stock"),
//     description: formData.get("description"),
//   });

//   if (!hasil.success) {
//     return { error: hasil.error.issues[0].message };
//   }

//   const { name, price, stock, description } = hasil.data;
//   const slug = buatSlug(name);

//   let imageUrl: string | null | undefined;
//   const file = formData.get("gambar") as File | null;
//   if (file && file.size > 0) {
//     try {
//       imageUrl = await simpanGambar(file);
//     } catch (e) {
//       console.error("Gagal mengunggah gambar:", e);
//       return { error: "Gagal mengunggah gambar. Coba lagi sebentar." };
//     }
//   }

//   try {
//     await prisma.product.create({
//       data: { name, slug, price, stock, description, imageUrl },
//     });
//   } catch (e) {
//     console.error("Gagal menyimpan produk:", e);
//     return { error: "Terjadi kesalahan. Coba lagi sebentar." };
//   }

//   revalidatePath("/admin/produk");
//   redirect("/admin/produk");
// }

// // UPDATE
// export async function ubahProduk(
//   id: number,
//   prevState: FormState,
//   formData: FormData,
// ) {
//   const gagalAuth = await cekAdmin();
//   if (gagalAuth) return gagalAuth;

//   const hasil = produkSchema.safeParse({
//     name: formData.get("name"),
//     price: formData.get("price"),
//     stock: formData.get("stock"),
//     description: formData.get("description"),
//   });

//   if (!hasil.success) {
//     return { error: hasil.error.issues[0].message };
//   }

//   const { name, price, stock, description } = hasil.data;
//   const slug = buatSlug(name);

//   try {
//     await prisma.product.update({
//       where: { id },
//       data: { name, slug, price, stock, description },
//     });
//   } catch (e) {
//     console.error("Gagal mengubah produk:", e);
//     return { error: "Terjadi kesalahan. Coba lagi sebentar." };
//   }

//   revalidatePath("/admin/produk");
//   redirect("/admin/produk");
// }

// // DELETE
// export async function hapusProduk(id: number): Promise<FormState> {
//   const gagalAuth = await cekAdmin();
//   if (gagalAuth) return gagalAuth;

//   try {
//     await prisma.product.delete({ where: { id } });
//   } catch (e) {
//     console.error("Gagal menghapus produk:", e);
//     return { error: "Gagal menghapus produk. Coba lagi sebentar." };
//   }

//   revalidatePath("/admin/produk");
//   return { error: undefined };
// }

// // "use server";

// // import { prisma } from "@/lib/prisma";
// // import { auth } from "@/lib/auth";
// // import { revalidatePath } from "next/cache";
// // import { redirect } from "next/navigation";
// // import { simpanGambar } from "@/lib/upload";
// // import { produkSchema } from "./schema";

// // export async function buatProduk(formData: FormData) {
// //   // Bagian 4 cek otorisasi dulu, sebelum apa pun
// //   const session = await auth();
// //   if (session?.user?.role !== "admin") {
// //     redirect("/login");
// //   }

// //   // validasi Zod (dari tutorial)
// //   const hasil = produkSchema.safeParse({
// //     name: formData.get("name"),
// //     price: formData.get("price"),
// //     stock: formData.get("stock"),
// //   });

// //   if (!hasil.success) {
// //     // beda dari tutorial: redirect, bukan return (form kita masih Server Component)
// //     redirect(
// //       `/admin/produk/baru?error=${encodeURIComponent(hasil.error.issues[0].message)}`,
// //     );
// //   }

// //   const { name, price, stock } = hasil.data;

// //   // tambahan: field yang tutorial gak bahas tapi wajib di schema kita
// //   const description = formData.get("description") as string;
// //   const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
// //   const imageUrl = await simpanGambar(formData.get("gambar") as File);

// //   // bagian 7 bungkus dengan try...catch
// //   try {
// //     await prisma.product.create({
// //       data: { name, slug, price, stock, description, imageUrl },
// //     });
// //   } catch (e) {
// //     console.error("Gagal menyimpan produk:", e); // detail lengkap, cuma kamu yang lihat
// //     redirect(
// //       `/admin/produk/baru?error=${encodeURIComponent("Terjadi kesalahan. Coba lagi sebentar.")}`,
// //     );
// //   }

// //   revalidatePath("/admin/produk");
// //   redirect("/admin/produk");
// // }

// // // tidak berubah dari Modul 9
// // export async function ubahProduk(id: number, formData: FormData) {
// //   // Bagian 4 cek otorisasi
// //   const session = await auth();
// //   if (session?.user?.role !== "admin") {
// //     redirect("/login");
// //   }

// //   const name = formData.get("name") as string;
// //   const price = Number(formData.get("price"));
// //   const stock = Number(formData.get("stock"));
// //   const description = formData.get("description") as string;
// //   const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

// //   try {
// //     await prisma.product.update({
// //       where: { id },
// //       data: { name, slug, price, stock, description },
// //     });
// //   } catch (e) {
// //     console.error("Gagal mengubah produk:", e);
// //     redirect(
// //       `/admin/produk/${id}/edit?error=${encodeURIComponent("Terjadi kesalahan. Coba lagi sebentar.")}`,
// //     );
// //   }

// //   revalidatePath("/admin/produk");
// //   redirect("/admin/produk");
// // }

// // export async function hapusProduk(id: number) {
// //   // bagian 4 cek otorisasii
// //   const session = await auth();
// //   if (session?.user?.role !== "admin") {
// //     redirect("/login");
// //   }

// //   try {
// //     await prisma.product.delete({ where: { id } });
// //   } catch (e) {
// //     console.error("Gagal menghapus produk:", e);
// //     // untuk hapus, cukup log saja — tidak ada halaman untuk redirect+pesan
// //   }

// //   revalidatePath("/admin/produk");
// // }
