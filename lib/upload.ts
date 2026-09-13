import { writeFile } from "fs/promises";
import path from "path";

export async function simpanGambar(file: File): Promise<string | null> {
  // Kalau tidak ada file dipilih, kembalikan null (imageUrl kosong)
  if (!file || file.size === 0) {
    return null;
  }

  // Ubah file jadi data biner
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Bikin nama unik: waktu sekarang + nama asli (spasi dibuang)
  const namaUnik = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  // Tentukan lokasi simpan: <project>/public/uploads/<namaUnik>
  const tujuan = path.join(process.cwd(), "public", "upload", namaUnik);
  await writeFile(tujuan, buffer);

  // URL yang bisa diakses browser (public/ tidak ikut ditulis di URL)
  return `/upload/${namaUnik}`;
}
