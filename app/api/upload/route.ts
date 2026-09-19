import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { simpanGambar } from "@/lib/upload";

export async function POST(request: Request) {
  // Endpoint ini bisa dipanggil siapa saja, jadi otorisasi wajib dicek
  // di sini juga — sama seperti di Server Action admin.
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Tidak punya izin" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("gambar") as File;

  const url = await simpanGambar(file);

  if (!url) {
    return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
  }

  return NextResponse.json({ url });
}
