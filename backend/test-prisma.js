const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const filtered = await prisma.product.findMany({
    where: { name: { contains: 'zelda' } },
    take: 10
  });
  console.log('filtered (contains zelda):', filtered.map(p => p.name), 'count:', filtered.length);

  const count = await prisma.product.count({
    where: { name: { contains: 'zelda' } }
  });
  console.log('count (contains zelda):', count);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
