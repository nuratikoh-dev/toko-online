"use client";
import { useActionState } from "react";
import { buatPesanan } from "./actions";

export default function TombolBuatPesanan() {
  const [state, formAction, pending] = useActionState(buatPesanan, undefined);

  return (
    <form action={formAction} className="mt-6">
      {state?.error && (
        <p className="mb-3 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Buat Pesanan"}
      </button>
    </form>
  );
}
