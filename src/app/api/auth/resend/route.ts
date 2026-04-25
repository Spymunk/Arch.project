import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { projects: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    // Generate New Token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.update({
      where: { email },
      data: { verificationToken }
    });

    const projectCode = user.projects[0]?.projectCode || "N/A";

    // Send Email
    await sendVerificationEmail(email, verificationToken, projectCode);

    return NextResponse.json({ message: 'Token resent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resend token' }, { status: 500 });
  }
}
