import { put } from "@vercel/blob";

export async function simpanGambar(file: File): Promise<string | null> {
  // Kalau tidak ada file dipilih, kembalikan null (imageUrl kosong)
  if (!file || file.size === 0) {
    return null;
  }

  // Bikin nama unik: waktu sekarang + nama asli (spasi dibuang)
  const namaUnik = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  // Simpan ke Vercel Blob. Filesystem di serverless read-only,
  // jadi gambar tidak bisa ditulis ke public/ seperti waktu di lokal.
  const blob = await put(`produk/${namaUnik}`, file, {
    access: "public",
    contentType: file.type || undefined,
  });

  // URL absolut dari Blob, bukan lagi path "/upload/..."
  return blob.url;
}
