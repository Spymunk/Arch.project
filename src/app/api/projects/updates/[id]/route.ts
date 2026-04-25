import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { clientFeedback } = body;

    // Security: Only the owner of the project can leave feedback
    const update = await prisma.projectUpdate.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!update) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (update.project.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.projectUpdate.update({
      where: { id },
      data: { clientFeedback }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
