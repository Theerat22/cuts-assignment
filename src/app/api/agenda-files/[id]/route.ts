import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

const BUCKET = "agenda-files";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    const { data: file, error: fetchError } = await supabase
      .from("agenda_files")
      .select("file_url, file_name")
      .eq("id", id)
      .single();

    if (fetchError || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Extract storage path from the stored URL
    // URL format: .../storage/v1/object/public/agenda-files/{path}
    const marker = `/object/public/${BUCKET}/`;
    const storagePath = file.file_url.split(marker)[1];

    if (!storagePath) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 500 });
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 60); // 60 seconds

    if (signError || !signed) {
      return NextResponse.json({ error: signError?.message ?? "Failed to sign URL" }, { status: 500 });
    }

    return NextResponse.redirect(signed.signedUrl);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceClient();

    const { error } = await supabase
      .from("agenda_files")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete agenda file" }, { status: 500 });
  }
}
