import { z } from "zod";

// Di Indonesia titik adalah pemisah ribuan ("50.000" = lima puluh ribu),
// sedangkan JavaScript membacanya sebagai desimal -> Number("50.000") = 50.
// Jadi semua karakter non-digit dibuang dulu sebelum diubah jadi angka.
// Aman karena harga & stok di database bertipe Int.
const keAngka = (v: unknown) => {
  if (typeof v !== "string") return v;
  const digit = v.replace(/\D/g, "");
  return digit === "" ? NaN : Number(digit);
};

export const produkSchema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi"),
  price: z.preprocess(
    keAngka,
    z
      .number({ error: "Harga wajib diisi berupa angka" })
      .int("Harga harus berupa angka bulat")
      .positive("Harga harus lebih dari 0"),
  ),
  stock: z.preprocess(
    keAngka,
    z
      .number({ error: "Stok wajib diisi berupa angka" })
      .int("Stok harus berupa angka bulat")
      .min(0, "Stok tidak boleh negatif"),
  ),
  description: z.string().trim().min(1, "Deskripsi wajib diisi"),
});
