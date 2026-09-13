import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/rupiah";
import { notFound } from "next/navigation";
import Link from "next/link";
import { tambahKeKeranjang } from "@/app/keranjang/actions";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produk = await prisma.product.findUnique({ where: { slug } });

  return {
    title: produk ? produk.name : "Produk tidak ditemukan",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const produk = await prisma.product.findUnique({
    where: { slug },
  });

  if (!produk) {
    return notFound();
    // return (
    //   <main className="mx-auto max-w-5xl px-4 py-8">
    //     <h1 className="text-3xl font-bold text-gray-900">
    //       Produk tidak ditemukan
    //     </h1>
    //     <p className="mt-4 text-gray-700">
    //       Maaf, produk yang Anda cari tidak tersedia. Silakan kembali ke
    //       katalog.
    //     </p>
    //     <Link
    //       href="/"
    //       className="mt-6 inline-block text-sm text-blue-600 hover:text-blue-800"
    //     >
    //       &larr; Kembali ke katalog
    //     </Link>
    //   </main>
    // );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Tombol kembali ke katalog */}
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-800"
      >
        &larr; Kembali ke katalog
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Kolom kiri: gambar */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          <img
            src={produk.imageUrl || "https://placehold.co/600x600?text=Produk"}
            alt={produk.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Kolom kanan: informasi */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900">{produk.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-blue-600">
            {formatRupiah(produk.price)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Stok tersedia: {produk.stock}
          </p>
          <p className="mt-6 leading-relaxed text-gray-700">
            {produk.description}
          </p>
          {/* Tombol ini BELUM berfungsi — kita aktifkan di Modul 7 */}
          <form
            action={async () => {
              "use server";
              await tambahKeKeranjang(produk.id);
              redirect("/keranjang");
            }}
          >
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Tambah ke keranjang
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
