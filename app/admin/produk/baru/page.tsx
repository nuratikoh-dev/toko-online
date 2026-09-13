"use client";
import { useActionState } from "react";
import { buatProduk } from "../actions";

export default function HalamanTambahProduk() {
  const [state, formAction] = useActionState(buatProduk, undefined);

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold">Tambah Produk</h1>

      <form
        action={formAction}
        // encType="multipart/form-data"
        className="space-y-4"
      >
        <div>
          <label className="mb-1 block font-medium">Nama Produk</label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Harga (Rp)</label>
          <input
            type="number"
            name="price"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Stok</label>
          <input
            type="number"
            name="stock"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Deskripsi</label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Gambar Produk</label>
          <input
            type="file"
            name="gambar"
            accept="image/*"
            className="w-full rounded border p-2"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Simpan Produk
        </button>
      </form>
    </div>
  );
}

// import { buatProduk } from "../actions";

// export default function HalamanTambahProduk() {
//   return (
//     <div className="mx-auto max-w-lg p-6">
//       <h1 className="mb-6 text-2xl font-bold">Tambah Produk</h1>

//       <form
//         action={buatProduk}
//         // encType="multipart/form-data"
//         className="space-y-4"
//       >
//         <div>
//           <label className="mb-1 block font-medium">Nama Produk</label>
//           <input
//             type="text"
//             name="name"
//             required
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block font-medium">Harga (Rp)</label>
//           <input
//             type="number"
//             name="price"
//             required
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block font-medium">Stok</label>
//           <input
//             type="number"
//             name="stock"
//             required
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block font-medium">Deskripsi</label>
//           <textarea
//             name="description"
//             rows={4}
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <div>
//           <label className="mb-1 block font-medium">Gambar Produk</label>
//           <input
//             type="file"
//             name="gambar"
//             accept="image/*"
//             className="w-full rounded border p-2"
//           />
//         </div>

//         <button type="submit" className="rounded bg-black px-4 py-2 text-white">
//           Simpan Produk
//         </button>
//       </form>
//     </div>
//   );
// }
