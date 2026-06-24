import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .order("seminar_date", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ speakers: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch speakers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("speakers")
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ speaker: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create speaker" }, { status: 500 });
  }
}
