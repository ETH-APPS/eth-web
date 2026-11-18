import argon2 from 'argon2';
import { PrismaService } from '../database/prisma.service.js';

async function main() {
  const email = process.env.STAFF_EMAIL?.trim().toLowerCase();
  const password = process.env.STAFF_PASSWORD;
  const firstName = process.env.STAFF_FIRST_NAME?.trim();
  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.length < 8 ||
    !firstName
  ) {
    throw new Error(
      'Set STAFF_EMAIL, STAFF_PASSWORD (min 8 characters), and STAFF_FIRST_NAME',
    );
  }

  const prisma = new PrismaService();
  try {
    await prisma.$connect();
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        role: 'STAFF',
        passwordHash: await argon2.hash(password, {
          type: argon2.argon2id,
          memoryCost: 19456,
          timeCost: 2,
          parallelism: 1,
        }),
      },
      select: { id: true, email: true, role: true },
    });
    process.stdout.write(
      `Created ${user.role} account ${user.email} (${user.id})\n`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

try {
  await main();
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Failed to create staff account'}\n`,
  );
  process.exitCode = 1;
}
