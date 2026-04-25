import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'ENGINEER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT', emailVerified: true },
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(clients);
}
