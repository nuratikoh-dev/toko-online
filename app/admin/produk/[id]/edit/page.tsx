import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ubahProduk } from "../../actions";
import FormEditProduk from "./FormEditProduk";

export default async function HalamanEditProduk({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produk = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!produk) {
    notFound();
  }

  // "ikat" id ke action supaya ubahProduk tahu produk mana yang diedit
  const ubahDenganId = ubahProduk.bind(null, produk.id);

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Produk</h1>

      <FormEditProduk produk={produk} aksi={ubahDenganId} />
    </div>
  );
}
