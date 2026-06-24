import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    const speakerId = req.nextUrl.searchParams.get("speakerId");
    const token = req.nextUrl.searchParams.get("token");
    const supabase = createServiceClient();

    if (!speakerId) {
      return NextResponse.json({ error: "Missing speakerId" }, { status: 400 });
    }

    // If token is provided, validate it against the speaker's portal_token
    if (token) {
      const { data: speaker, error: speakerError } = await supabase
        .from("speakers")
        .select("portal_token")
        .eq("id", speakerId)
        .single();

      if (speakerError || !speaker || speaker.portal_token !== token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { data, error } = await supabase
      .from("tickets")
      .select("*, ticket_replies(*)")
      .eq("speaker_id", speakerId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tickets = (data || []).map((ticket: Record<string, unknown>) => ({
      ...ticket,
      replies: ((ticket.ticket_replies as Record<string, unknown>[]) || []).map((r) => ({
        id: r.id,
        message: r.message,
        from: r.from_role,
        author_name: r.author_name,
        created_at: r.created_at,
      })),
      ticket_replies: undefined,
    }));

    return NextResponse.json({ tickets });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { speakerId, speakerToken, subject, message } = await req.json();

    if (!speakerId || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Validate token
    const { data: speaker, error: speakerError } = await supabase
      .from("speakers")
      .select("portal_token, name")
      .eq("id", speakerId)
      .single();

    if (speakerError || !speaker || speaker.portal_token !== speakerToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .insert({
        speaker_id: speakerId,
        subject,
        message,
        status: "open",
      })
      .select()
      .single();

    if (ticketError) {
      return NextResponse.json({ error: ticketError.message }, { status: 500 });
    }

    // Insert notification
    await supabase.from("notifications").insert({
      type: "ticket_opened",
      title: "Ticket ใหม่จากวิทยากร",
      message: `${speaker.name} เปิด Ticket: ${subject}`,
      speaker_id: speakerId,
      speaker_name: speaker.name,
      read: false,
    });

    return NextResponse.json({ ticket: { ...ticket, replies: [] } });
  } catch (error) {
    console.error("Ticket error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
