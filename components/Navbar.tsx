import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { bacaKeranjang } from "@/lib/cart";

export default async function Navbar() {
  const session = await auth();
  const itemsKeranjang = await bacaKeranjang();
  const jumlahItem = itemsKeranjang.reduce((jml, it) => jml + it.quantity, 0);
  return (
    <nav className="flex items-center justify-between border-b px-4 py-3">
      <Link href="/" className="text-lg font-bold">
        Toko Online
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link href="/produk" className="hover:underline">
          Produk
        </Link>

        {}
        <Link href="/keranjang" className="relative inline-flex items-center">
          Keranjang
          {jumlahItem > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-medium text-white">
              {jumlahItem}
            </span>
          )}
        </Link>

        {/* hanya untuk yang sudah login */}
        {session && <Link href="/pesanan">Pesanan Saya</Link>}

        {/* hanya untuk admin */}
        {session?.user.role === "admin" && (
          <Link href="/admin/produk" className="font-semibold text-blue-600">
            Admin
          </Link>
        )}

        {session?.user ? (
          <>
            <span className="text-gray-700">Halo, {session.user.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
              >
                Logout
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="rounded bg-black px-3 py-1 text-white"
            >
              Daftar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
