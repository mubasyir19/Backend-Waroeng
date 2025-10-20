import { PrismaClient, RoleUser } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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
      username: 'adminPOS',
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
      { name: 'Pcs' },
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
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Sate Usus',
        price: 2000,
        stock: 100,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Tusuk'),
      },
      {
        name: 'Sate Ati Ampela',
        price: 3000,
        stock: 80,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Tusuk'),
      },
      {
        name: 'Sate Telur Puyuh',
        price: 2500,
        stock: 70,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Tusuk'),
      },
      {
        name: 'Indomie Rebus',
        price: 8000,
        stock: 50,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Indomie Goreng',
        price: 9000,
        stock: 50,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Roti Bakar Coklat Keju',
        price: 15000,
        stock: 30,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Nasi Goreng Spesial',
        price: 20000,
        stock: 20,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Mie Ayam',
        price: 18000,
        stock: 40,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Gorengan (Per Biji)',
        price: 2000,
        stock: 200,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Snack'),
        unitId: getUnitId('Pcs'),
      },
      {
        name: 'Kentang Goreng',
        price: 12000,
        stock: 40,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Snack'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Indomie Kuah Soto',
        price: 9000,
        stock: 50,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Telur Setengah Matang',
        price: 7000,
        stock: 40,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Mie Dok Dok',
        price: 14000,
        stock: 30,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Makanan'),
        unitId: getUnitId('Porsi'),
      },

      // Minuman - Kopi
      {
        name: 'Kopi Hitam Panas',
        price: 5000,
        stock: 40,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Es Kopi Susu',
        price: 12000,
        stock: 40,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Kopi'),
        unitId: getUnitId('Gelas'),
      },

      // Minuman - Non Kopi
      {
        name: 'Teh Manis Panas',
        price: 4000,
        stock: 40,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Teh Tawar Panas',
        price: 3000,
        stock: 40,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Es Teh Manis',
        price: 6000,
        stock: 40,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Wedang Jahe',
        price: 7000,
        stock: 20,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Air Mineral',
        price: 4000,
        stock: 60,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Botol'),
      },
      {
        name: 'Es Jeruk',
        price: 8000,
        stock: 30,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Jus Alpukat',
        price: 15000,
        stock: 20,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Susu Jahe',
        price: 9000,
        stock: 30,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Es Coklat',
        price: 10000,
        stock: 30,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },
      {
        name: 'Es Milo',
        price: 11000,
        stock: 30,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Minuman - Non Kopi'),
        unitId: getUnitId('Gelas'),
      },

      // Snack
      {
        name: 'Gorengan Tempe',
        price: 1500,
        stock: 100,
        imageUrl: '/uploads/products/product.png',
        categoryId: getCategoryId('Snack'),
        unitId: getUnitId('Porsi'),
      },
      {
        name: 'Tahu Isi',
        price: 1500,
        stock: 100,
        imageUrl: '/uploads/products/product.png',
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
