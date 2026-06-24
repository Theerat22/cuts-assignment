import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    const speakerId = req.nextUrl.searchParams.get("speakerId");

    if (!speakerId) {
      return NextResponse.json({ error: "Missing speakerId" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("agenda_files")
      .select("*")
      .eq("speaker_id", speakerId)
      .order("uploaded_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ files: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agenda files" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { speaker_id, file_name, file_url, file_size, deadline } = await req.json();

    if (!speaker_id || !file_name || !file_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("agenda_files")
      .insert({ speaker_id, file_name, file_url, file_size, deadline })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ file: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save agenda file" }, { status: 500 });
  }
}
