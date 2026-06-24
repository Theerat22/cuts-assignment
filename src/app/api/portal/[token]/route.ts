import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .eq("portal_token", token)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
    }

    return NextResponse.json({ speaker: data });
  } catch (error) {
    return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
  }
}
