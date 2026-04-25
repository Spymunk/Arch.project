import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// GET — returns projects depending on role
export async function GET() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Clients get their own projects
  if (role === 'CLIENT') {
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        updates: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(projects);
  }

  // Admin & Engineer get all clients list (for dropdown in create-project)
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: { id: true, name: true, email: true }
  });

  return NextResponse.json(clients);
}

// POST — create a new project for a client
export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== 'ADMIN' && role !== 'ENGINEER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { clientId, title, description, location } = await request.json();

    if (!clientId || !title) {
      return NextResponse.json({ error: 'Client and project title are required' }, { status: 400 });
    }

    // Generate unique project code
    const projectCode = `ARC-${Math.floor(1000 + Math.random() * 9000)}`;

    const project = await prisma.project.create({
      data: {
        title,
        description: description || '',
        projectCode,
        status: 'PLANNING',
        progress: 0,
        userId: clientId,
      },
      include: {
        user: { select: { email: true, name: true } }
      }
    });

    // Send project assignment email to the client
    const { sendProjectAssignedEmail } = await import('@/lib/mail');
    await sendProjectAssignedEmail(project.user.email, project.user.name || 'Client', project.title, projectCode);

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("CREATE PROJECT ERROR:", error);
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}
