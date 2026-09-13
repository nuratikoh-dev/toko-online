"use client";
import Link from "next/link";
import { useActionState } from "react";
import { daftar } from "./actions";

export default function DaftarPage() {
  const [state, formAction, pending] = useActionState(daftar, undefined);

  return (
    <>
      <form action={formAction} className="mx-auto max-w-sm space-y-3 p-4">
        <h1 className="text-xl font-bold">Daftar Akun</h1>

        {state?.error && (
          <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <input
          name="nama"
          placeholder="Nama"
          className="w-full rounded border p-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded border p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full rounded border p-2"
        />

        <button
          disabled={pending}
          className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
        >
          {pending ? "Memproses..." : "Daftar"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-blue-600 underline">
          Masuk di sini
        </Link>
      </p>
    </>
  );
}
