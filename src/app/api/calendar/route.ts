import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  try {
    const { title, description, date, time, location, attendees } = await req.json();

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const startDateTime = new Date(`${date}T${time}:00+07:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: title,
        description,
        location,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "Asia/Bangkok",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "Asia/Bangkok",
        },
        attendees: attendees?.map((email: string) => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 30 },
          ],
        },
      },
    });

    return NextResponse.json({ success: true, htmlLink: event.data.htmlLink });
  } catch (error) {
    console.error("Calendar error:", error);
    return NextResponse.json({ error: "Failed to create calendar event" }, { status: 500 });
  }
}
