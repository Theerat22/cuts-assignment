import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

const BUCKET = "agenda-files";

async function ensureBucket(supabase: ReturnType<typeof createServiceClient>) {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.id === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, {
      public: false,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const speakerId = form.get("speakerId") as string | null;
    const deadline = form.get("deadline") as string | null;

    if (!file || !speakerId) {
      return NextResponse.json({ error: "Missing file or speakerId" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "ไฟล์ขนาดเกิน 5MB" }, { status: 400 });
    }

    const supabase = createServiceClient();
    await ensureBucket(supabase);

    const ext = file.name.split(".").pop() ?? "bin";
    const safeName = `${Date.now()}.${ext}`;
    const path = `${speakerId}/${safeName}`;
    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const { data, error: dbError } = await supabase
      .from("agenda_files")
      .insert({
        speaker_id: speakerId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        deadline: deadline || null,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ file: data });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
