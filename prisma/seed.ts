import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Kaos Polos Hitam",
        slug: "kaos-polos-hitam",
        price: 75000,
        stock: 20,
        description: "Kaos katun combed 30s, nyaman dipakai sehari-hari.",
        imageUrl: null,
      },
      {
        name: "Topi Baseball Navy",
        slug: "topi-baseball-navy",
        price: 95000,
        stock: 15,
        description: "Topi baseball berbahan kanvas dengan strap belakang.",
        imageUrl: null,
      },
      {
        name: "Tote Bag Kanvas",
        slug: "tote-bag-kanvas",
        price: 60000,
        stock: 30,
        description: "Tas jinjing kanvas tebal, muat laptop 14 inci.",
        imageUrl: null,
      },
      {
        name: "Mug Keramik Putih",
        slug: "mug-keramik-putih",
        price: 45000,
        stock: 50,
        description: "Mug keramik 350ml, aman untuk microwave.",
        imageUrl: null,
      },
      {
        name: "Sticker Pack Lucu",
        slug: "sticker-pack-lucu",
        price: 25000,
        stock: 100,
        description: "Isi 10 stiker vinyl tahan air, cocok buat laptop.",
        imageUrl: null,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed selesai: produk contoh berhasil dimasukkan.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
