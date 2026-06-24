import { Ticket, TicketReply } from "./types";
import { mockTickets } from "./mock-data";

const KEY = "spk_tickets_v1";

function load(): Ticket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Ticket[]) : [...mockTickets];
  } catch {
    return [...mockTickets];
  }
}

function save(tickets: Ticket[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(tickets));
}

export function getTickets(speakerId?: string): Ticket[] {
  const all = load();
  return speakerId ? all.filter((t) => t.speaker_id === speakerId) : all;
}

export function addTicket(ticket: Ticket): void {
  const all = load();
  save([ticket, ...all]);
}

export function addReply(ticketId: string, reply: TicketReply): void {
  const all = load();
  save(
    all.map((t) =>
      t.id === ticketId
        ? {
            ...t,
            replies: [...t.replies, reply],
            status: "replied",
            updated_at: new Date().toISOString(),
          }
        : t
    )
  );
}

export function closeTicket(ticketId: string): void {
  const all = load();
  save(
    all.map((t) =>
      t.id === ticketId
        ? { ...t, status: "closed", updated_at: new Date().toISOString() }
        : t
    )
  );
}

export function getOpenCount(speakerId?: string): number {
  return getTickets(speakerId).filter((t) => t.status === "open").length;
}
