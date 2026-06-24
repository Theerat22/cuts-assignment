export type SpeakerStatus =
  | "pending"
  | "contacted"
  | "confirmed"
  | "agenda_submitted"
  | "completed"
  | "cancelled";

export interface Speaker {
  id: string;
  name: string;
  email: string;
  organization?: string;
  title?: string;
  avatar_url?: string;
  seminar_date: string;
  seminar_time: string;
  seminar_end_time?: string;
  seminar_location?: string;
  agenda_deadline: string;
  status: SpeakerStatus;
  assigned_to?: string;
  notes?: string;
  portal_token: string;
  created_at: string;
  updated_at: string;
}

export interface AgendaFile {
  id: string;
  speaker_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  deadline?: string;
  uploaded_at: string;
}

export interface TicketReply {
  id: string;
  message: string;
  from: "team" | "speaker";
  author_name: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  speaker_id: string;
  subject: string;
  message: string;
  status: "open" | "replied" | "closed";
  created_at: string;
  updated_at: string;
  replies: TicketReply[];
}

export interface Notification {
  id: string;
  type: "email_sent" | "ticket_opened" | "agenda_uploaded" | "status_changed" | "deadline_approaching";
  title: string;
  message: string;
  speaker_id?: string;
  speaker_name?: string;
  read: boolean;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface CalendarEvent {
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  attendees?: string[];
}
