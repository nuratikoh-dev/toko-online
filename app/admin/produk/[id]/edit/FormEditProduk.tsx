"use client";
import { useActionState } from "react";

type FormState = { error?: string } | undefined;

export default function FormEditProduk({
  produk,
  aksi,
}: {
  produk: { name: string; price: number; stock: number; description: string };
  aksi: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(aksi, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block font-medium">Nama Produk</label>
        <input
          type="text"
          name="name"
          defaultValue={produk.name}
          required
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Harga (Rp)</label>
        <input
          type="text"
          inputMode="numeric"
          name="price"
          defaultValue={produk.price}
          required
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Stok</label>
        <input
          type="text"
          inputMode="numeric"
          name="stock"
          defaultValue={produk.stock}
          required
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">Deskripsi</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={produk.description}
          className="w-full rounded border p-2"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
