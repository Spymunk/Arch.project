import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  console.log("Cleaning database...");
  await prisma.projectUpdate.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Master Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@archproject.com',
      name: 'Lead Architect',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true
    }
  })

  // Create Site Engineer
  const engineer = await prisma.user.create({
    data: {
      email: 'engineer@archproject.com',
      name: 'Site Engineer Mike',
      password: hashedPassword,
      role: 'ENGINEER',
      emailVerified: true
    }
  })

  console.log("Database reset. Staff accounts seeded.");
  console.log("Admin: admin@archproject.com / password123");
  console.log("Engineer: engineer@archproject.com / password123");
  console.log("Your personal Gmail is now FREE to be used for the signup test.");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
