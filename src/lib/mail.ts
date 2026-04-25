import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string, projectCode: string | null) => {
  try {
    await resend.emails.send({
      from: 'Architectural Portal <onboarding@resend.dev>',
      to: email,
      subject: 'Verify Your Account & Your Project Code',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #003399; margin: 0; font-size: 24px;">Welcome to the Portal</h1>
            <p style="color: #64748b; font-size: 16px;">Your architectural journey begins here.</p>
          </div>

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Step 1: Verify Your Identity</p>
            <p style="margin: 0 0 20px; font-size: 15px; color: #334155;">Enter this 6-digit code on the website to activate your account:</p>
            <div style="background: #ffffff; padding: 15px; text-align: center; border-radius: 12px; border: 2px solid #003399;">
              <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #003399;">${token}</span>
            </div>
          </div>

          ${projectCode ? `
          <div style="background-color: #eff6ff; padding: 25px; border-radius: 16px; border: 1px solid #bfdbfe;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #1e40af; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Your Unique Project Code</p>
            <p style="margin: 0 0 15px; font-size: 15px; color: #1e3a8a;">The system has automatically generated your secure project tracking code:</p>
            <div style="font-size: 20px; font-weight: 800; color: #1e40af; background: #ffffff; display: inline-block; padding: 8px 16px; border-radius: 8px; border: 1px solid #bfdbfe;">
              ${projectCode}
            </div>
            <p style="margin: 15px 0 0; font-size: 13px; color: #60a5fa;">Keep this code safe. You will see this on all your technical drawings and site updates.</p>
          </div>
          ` : `
          <div style="background-color: #f0fdf4; padding: 25px; border-radius: 16px; border: 1px solid #bbf7d0;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #15803d; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">What happens next?</p>
            <p style="margin: 0; font-size: 15px; color: #166534; line-height: 1.6;">Once you verify your account, our engineers will review your registration and create your personalised project. You will be able to see all project details and construction updates on your dashboard.</p>
          </div>
          `}

          <div style="margin-top: 40px; text-align: center; border-top: 1px solid #e2e8f0; pt: 30px;">
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 5px;">&copy; 2026 Architectural Client Portal. 123 Design Street, HQ.</p>
            <p style="font-size: 11px; color: #cbd5e1;">If you did not request this email, please ignore it.</p>
          </div>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error("FULL RESEND ERROR:", JSON.stringify(error, null, 2));
    return { success: false, error };
  }
};

export const sendProjectAssignedEmail = async (email: string, name: string, projectTitle: string, projectCode: string) => {
  try {
    await resend.emails.send({
      from: 'Architectural Portal <onboarding@resend.dev>',
      to: email,
      subject: `Your New Project Is Ready: ${projectCode}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #003399; margin: 0; font-size: 24px;">Project Assigned!</h1>
            <p style="color: #64748b; font-size: 16px;">Hello ${name}, your project is now live on the portal.</p>
          </div>

          <div style="background-color: #eff6ff; padding: 25px; border-radius: 16px; border: 1px solid #bfdbfe; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #1e40af; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Project Name</p>
            <p style="margin: 0; font-size: 18px; font-weight: 800; color: #1e3a8a;">${projectTitle}</p>
          </div>

          <div style="background-color: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Your Unique Project Code</p>
            <div style="font-size: 28px; font-weight: 900; color: #003399; background: #ffffff; display: inline-block; padding: 12px 24px; border-radius: 12px; border: 2px solid #003399; letter-spacing: 4px;">
              ${projectCode}
            </div>
            <p style="margin: 15px 0 0; font-size: 13px; color: #94a3b8;">This code will appear on all your technical drawings and site update videos.</p>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:3000/dashboard" style="background: #003399; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px;">VIEW YOUR PROJECT DASHBOARD</a>
          </div>

          <div style="margin-top: 40px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="font-size: 12px; color: #94a3b8;">&copy; 2026 Architectural Client Portal. All rights reserved.</p>
          </div>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error("PROJECT ASSIGNED EMAIL ERROR:", JSON.stringify(error, null, 2));
    return { success: false, error };
  }
};
