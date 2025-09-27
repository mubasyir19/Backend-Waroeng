import * as bcrypt from 'bcryptjs';
import { PrismaClient, RoleUser } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // --- User Admin ---
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      name: 'Admin POS',
      email: 'admin@pos.com',
      password: adminPassword,
      role: RoleUser.ADMIN,
    },
  });

  // --- Units ---
  const units = await prisma.unit.createMany({
    data: [
      { name: 'Porsi' },
      { name: 'Tusuk' },
      { name: 'Gelas' },
      { name: 'Botol' },
    ],
    skipDuplicates: true,
  });

  // --- Categories ---
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Makanan' },
      { name: 'Minuman - Kopi' },
      { name: 'Minuman - Non Kopi' },
      { name: 'Snack' },
    ],
    skipDuplicates: true,
  });

  // ambil id kategori & unit
  const allCategories = await prisma.category.findMany();
  const allUnits = await prisma.unit.findMany();

  const getCategoryId = (name: string) =>
    allCategories.find((c) => c.name === name)?.id || '';
  const getUnitId = (name: string) =>
    allUnits.find((u) => u.name === name)?.id || '';

  // --- Products ---
  await prisma.product.createMany({
    data: [
      // Makanan
      {
        name: 'Nasi Kucing',
        price: 3000,
        stock: 50,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Sate Usus',
        price: 2000,
        stock: 100,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Tusuk'),
      },
      {
        name: 'Sate Ati Ampela',
        price: 3000,
        stock: 80,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Tusuk'),
      },
      {
        name: 'Sate Telur Puyuh',
        price: 2500,
        stock: 70,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Tusuk'),
      },

      // Minuman - Kopi
      {
        name: 'Kopi Hitam',
        price: 5000,
        stock: 40,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Minuman - Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Kopi Susu',
        price: 6000,
        stock: 40,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Minuman - Kopi'),
        unitId: getUnitId('Gelas'),
      },

      // Minuman - Non Kopi
      {
        name: 'Teh Manis Panas',
        price: 4000,
        stock: 40,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Teh Tawar Panas',
        price: 3000,
        stock: 40,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Wedang Jahe',
        price: 7000,
        stock: 20,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Air Mineral',
        price: 4000,
        stock: 60,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Botol'),
      },

      // Snack
      {
        name: 'Gorengan Tempe',
        price: 1500,
        stock: 100,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Snack'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Tahu Isi',
        price: 1500,
        stock: 100,
        imageUrl: '/images/product.jpg',
        categoryId: getCategoryId('Snack'),
        unitId: getUnitId('Porsi'),
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seeder selesai. Data awal berhasil ditambahkan.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
