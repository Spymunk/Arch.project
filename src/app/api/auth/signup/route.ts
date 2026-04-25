import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
      // If not verified, we'll allow the "creation" to actually be an update below
      // or we can just delete them and let it create. Deleting is cleaner for "resetting" project.
      await prisma.projectUpdate.deleteMany({ where: { project: { userId: existingUser.id } } });
      await prisma.project.deleteMany({ where: { userId: existingUser.id } });
      await prisma.user.delete({ where: { id: existingUser.id } });
    }

    // Generate Verification Token (6 digits)
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Generate Automatic Project Code (ARC-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const projectCode = `ARC-${randomSuffix}`;
    const projectName = `Primary Project - ${name}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user only — project will be created by Engineer/Admin
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CLIENT',
        emailVerified: false,
        verificationToken,
      }
    });

    // SEND REAL EMAIL (just verification code, no project code yet)
    const { sendVerificationEmail } = await import('@/lib/mail');
    const emailResult = await sendVerificationEmail(email, verificationToken, null);
    console.log("RESEND RESULT:", emailResult);

    // SIMULATION BACKUP: Sending email to console
    console.log(`-----------------------------------------`);
    console.log(`EMAIL SENT TO: ${email}`);
    console.log(`VERIFICATION TOKEN: ${verificationToken}`);
    console.log(`PROJECT CREATED: ${projectName} (${projectCode})`);
    console.log(`-----------------------------------------`);

    return NextResponse.json({ 
      message: 'Account created. Please verify your email.',
      email: user.email 
    });
  } catch (error: any) {
    console.error("SIGNUP ERROR:", error);
    return NextResponse.json({ error: error.message || 'Failed to create account' }, { status: 500 });
  }
}
