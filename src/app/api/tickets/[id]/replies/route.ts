import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params;
    const { message, from_role, author_name } = await req.json();

    if (!message || !from_role || !author_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: replyData, error: replyError } = await supabase
      .from("ticket_replies")
      .insert({
        ticket_id: ticketId,
        message,
        from_role,
        author_name,
      })
      .select()
      .single();

    if (replyError) {
      return NextResponse.json({ error: replyError.message }, { status: 500 });
    }

    // Update ticket status to 'replied'
    await supabase
      .from("tickets")
      .update({ status: "replied", updated_at: new Date().toISOString() })
      .eq("id", ticketId);

    const reply = {
      id: replyData.id,
      message: replyData.message,
      from: replyData.from_role,
      author_name: replyData.author_name,
      created_at: replyData.created_at,
    };

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}
