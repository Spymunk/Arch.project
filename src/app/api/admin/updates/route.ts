import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
  const session = await auth();

  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { projectId, title, description, videoUrl } = body;

    const update = await prisma.projectUpdate.create({
      data: {
        projectId,
        title,
        description,
        videoUrl
      }
    });

    return NextResponse.json(update);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 });
  }
}
