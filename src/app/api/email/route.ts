import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, speakerId, portalToken } = await req.json();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const portalUrl = `${appUrl}/portal/${portalToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlBody = `
      <div style="font-family: 'Noto Sans Thai', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">งานสัมมนา</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Activity Team</p>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <div style="white-space: pre-line; color: #374151; line-height: 1.7; font-size: 15px;">${body}</div>
          <div style="margin-top: 30px; padding: 20px; background: #f0f4ff; border-radius: 12px; border: 1px solid #c7d2fe;">
            <p style="margin: 0 0 12px; font-weight: 600; color: #4338ca; font-size: 14px;">Portal ส่วนตัวของท่าน</p>
            <p style="margin: 0 0 12px; color: #6366f1; font-size: 13px;">ท่านสามารถเข้าถึงข้อมูลงาน, อัปโหลดไฟล์ และส่งคำถามผ่าน Portal ส่วนตัว</p>
            <a href="${portalUrl}" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">เข้าสู่ Portal →</a>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">ส่งโดยทีมฝ่าย Activity • Speaker Management System</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"ทีมฝ่าย Activity" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      text: body,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
