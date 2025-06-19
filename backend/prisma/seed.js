const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { id: 1, name: "Red T-Shirt" },
      { id: 2, name: "Blue Jeans" },
      { id: 3, name: "Smart Watch" },
      { id: 4, name: "Leather Wallet" },
      { id: 5, name: "Wireless Headphones" },
      { id: 6, name: "Sneakers" }
    ],
    skipDuplicates: true, 
  });

  console.log("Products seeded to database");
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
