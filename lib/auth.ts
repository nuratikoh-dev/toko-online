import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        // Cari user berdasarkan email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        // Bandingkan password yang diketik dengan hash di database
        const cocok = await bcrypt.compare(password, user.passwordHash);
        if (!cocok) return null;

        // Kembalikan data yang ingin disimpan di sesi
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Saat baru login, `user` terisi → salin id & role ke token
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Salin dari token ke objek session yang dipakai di aplikasi
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
