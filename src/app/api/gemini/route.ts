import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt, currentEmail, speakerName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `คุณเป็นผู้ช่วยในการเขียนอีเมลภาษาไทยสำหรับงานสัมมนา กำลังช่วยปรับปรุงอีเมลถึงวิทยากร ${speakerName}

อีเมลปัจจุบัน:
${currentEmail}

คำขอปรับปรุง: ${prompt}

กรุณาปรับปรุงเนื้อหาอีเมลตามคำขอ โดย:
1. รักษาข้อมูลสำคัญทั้งหมด (วันเวลา สถานที่ deadline)
2. ใช้ภาษาไทยที่สุภาพและเป็นทางการ
3. ตอบกลับเฉพาะเนื้อหาอีเมลที่ปรับปรุงแล้ว ไม่ต้องมีคำอธิบายเพิ่มเติม`;

    const result = await model.generateContent(systemPrompt);
    const improved = result.response.text();

    return NextResponse.json({ improved });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
  }
}
