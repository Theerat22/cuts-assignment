-- ============================================================
-- Speaker Management System — Supabase Schema
-- Run this on a fresh Supabase project.
-- ============================================================


-- ============================================================
-- 1. Extensions
-- ============================================================

create extension if not exists "pgcrypto";


-- ============================================================
-- 2. Utility functions
-- ============================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 3. Tables  (drop in reverse FK order if re-running)
-- ============================================================

drop table if exists notifications   cascade;
drop table if exists ticket_replies  cascade;
drop table if exists tickets         cascade;
drop table if exists agenda_files    cascade;
drop table if exists speakers        cascade;
drop table if exists team_members    cascade;


-- 3.1 Team members ─────────────────────────────────────────

create table team_members (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null unique,
  avatar_url  text,
  created_at  timestamptz not null default now()
);


-- 3.2 Speakers ─────────────────────────────────────────────

create table speakers (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null,
  email             text        not null,
  organization      text,
  title             text,
  avatar_url        text,
  seminar_date      date        not null,
  seminar_time      text        not null,   -- HH:MM (24-hour)
  seminar_end_time  text,                   -- HH:MM optional
  seminar_location  text,
  agenda_deadline   date        not null,
  status            text        not null default 'pending'
    check (status in (
      'pending', 'contacted', 'confirmed',
      'agenda_submitted', 'completed', 'cancelled'
    )),
  assigned_to       uuid        references team_members(id) on delete set null,
  notes             text,
  portal_token      text        not null unique,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger speakers_updated_at
  before update on speakers
  for each row execute function update_updated_at();


-- 3.3 Agenda files ─────────────────────────────────────────
-- file_url points to a Supabase Storage object URL.

create table agenda_files (
  id           uuid        primary key default gen_random_uuid(),
  speaker_id   uuid        not null references speakers(id) on delete cascade,
  file_name    text        not null,
  file_url     text        not null,
  file_size    bigint,                  -- bytes
  deadline     date,
  uploaded_at  timestamptz not null default now()
);


-- 3.4 Tickets ──────────────────────────────────────────────

create table tickets (
  id          uuid        primary key default gen_random_uuid(),
  speaker_id  uuid        not null references speakers(id) on delete cascade,
  subject     text        not null,
  message     text        not null,
  status      text        not null default 'open'
    check (status in ('open', 'replied', 'closed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger tickets_updated_at
  before update on tickets
  for each row execute function update_updated_at();


-- 3.5 Ticket replies ───────────────────────────────────────

create table ticket_replies (
  id           uuid        primary key default gen_random_uuid(),
  ticket_id    uuid        not null references tickets(id) on delete cascade,
  message      text        not null,
  from_role    text        not null check (from_role in ('team', 'speaker')),
  author_name  text        not null,
  created_at   timestamptz not null default now()
);


-- 3.6 Notifications ────────────────────────────────────────

create table notifications (
  id           uuid        primary key default gen_random_uuid(),
  type         text        not null
    check (type in (
      'email_sent', 'ticket_opened', 'agenda_uploaded',
      'status_changed', 'deadline_approaching'
    )),
  title        text        not null,
  message      text        not null,
  speaker_id   uuid        references speakers(id) on delete set null,
  speaker_name text,
  read         boolean     not null default false,
  created_at   timestamptz not null default now()
);


-- ============================================================
-- 4. Indexes
-- ============================================================

create index idx_speakers_status       on speakers(status);
create index idx_speakers_seminar_date on speakers(seminar_date);
create index idx_speakers_assigned_to  on speakers(assigned_to);
create index idx_speakers_portal_token on speakers(portal_token);

create index idx_agenda_files_speaker  on agenda_files(speaker_id);

create index idx_tickets_speaker       on tickets(speaker_id);
create index idx_tickets_status        on tickets(status);

create index idx_ticket_replies_ticket on ticket_replies(ticket_id, created_at);

create index idx_notifications_read    on notifications(read);
create index idx_notifications_speaker on notifications(speaker_id);


-- ============================================================
-- 5. Row-Level Security
-- ============================================================
-- Architecture:
--   Admin dashboard  → authenticated (Supabase Auth session)
--   Speaker portal   → Next.js API routes run as service_role
--                       (portal_token validated server-side)
--   Direct anon      → blocked on all tables
-- ============================================================

alter table team_members    enable row level security;
alter table speakers        enable row level security;
alter table agenda_files    enable row level security;
alter table tickets         enable row level security;
alter table ticket_replies  enable row level security;
alter table notifications   enable row level security;

-- Authenticated admin: full access
create policy "admin_all_team_members"   on team_members   for all to authenticated using (true) with check (true);
create policy "admin_all_speakers"       on speakers       for all to authenticated using (true) with check (true);
create policy "admin_all_agenda_files"   on agenda_files   for all to authenticated using (true) with check (true);
create policy "admin_all_tickets"        on tickets        for all to authenticated using (true) with check (true);
create policy "admin_all_ticket_replies" on ticket_replies for all to authenticated using (true) with check (true);
create policy "admin_all_notifications"  on notifications  for all to authenticated using (true) with check (true);

-- Anon: no direct access (portal goes through server-side API routes with service_role)


-- ============================================================
-- 6. Storage
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'agenda-files',
  'agenda-files',
  false,
  5242880,
  array[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

-- Admin: full access
create policy "admin_storage_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'agenda-files')
  with check (bucket_id = 'agenda-files');

-- Speaker portal (anon): upload only
create policy "speaker_storage_upload" on storage.objects
  for insert to anon
  with check (bucket_id = 'agenda-files');

-- Speaker portal (anon): read (for download link)
create policy "speaker_storage_read" on storage.objects
  for select to anon
  using (bucket_id = 'agenda-files');


-- ============================================================
-- 7. Realtime
-- ============================================================
-- Enable realtime for tables the portal and admin poll.

alter publication supabase_realtime add table speakers;
alter publication supabase_realtime add table tickets;
alter publication supabase_realtime add table ticket_replies;
alter publication supabase_realtime add table notifications;


-- ============================================================
-- 7. Seed data
-- ============================================================

-- 7.1 Team members
insert into team_members (id, name, email) values
  ('00000000-0000-0000-0000-000000000001', 'สมชาย ใจดี',    'somchai@activity.com'),
  ('00000000-0000-0000-0000-000000000002', 'สุดา มีสุข',    'suda@activity.com'),
  ('00000000-0000-0000-0000-000000000003', 'วิชัย เก่งมาก', 'wichai@activity.com'),
  ('00000000-0000-0000-0000-000000000004', 'นารี สวยงาม',   'naree@activity.com');

-- 7.2 Speakers
insert into speakers (
  id, name, email, organization, title,
  seminar_date, seminar_time, seminar_end_time, seminar_location,
  agenda_deadline, status, assigned_to, portal_token, notes
) values
  (
    '00000000-0000-0000-0001-000000000001',
    'ดร.พิชัย รัตนกุล', 'pichai@university.ac.th',
    'มหาวิทยาลัยเทคโนโลยี', 'ผู้อำนวยการสถาบันนวัตกรรม',
    '2026-07-15', '09:00', '10:30', 'ห้อง Auditorium A ชั้น 3',
    '2026-07-08', 'confirmed',
    '00000000-0000-0000-0000-000000000001', 'abc123',
    'วิทยากรหัวข้อ AI & Innovation'
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    'คุณสุภาพร วงศ์มณี', 'supaporn@startup.co.th',
    'Startup Thailand', 'CEO & Co-Founder',
    '2026-07-15', '10:30', '12:00', 'ห้อง Auditorium A ชั้น 3',
    '2026-07-08', 'contacted',
    '00000000-0000-0000-0000-000000000002', 'def456',
    'ขอหัวข้อ Entrepreneurship'
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    'ศาสตราจารย์ ดร.มานะ ชัยเจริญ', 'mana@research.or.th',
    'สถาบันวิจัยแห่งชาติ', 'นักวิจัยอาวุโส',
    '2026-07-16', '13:00', '14:30', 'ห้อง B201',
    '2026-07-09', 'agenda_submitted',
    '00000000-0000-0000-0000-000000000001', 'ghi789',
    'ส่ง Slide แล้ว รอ confirm ไฟล์เพิ่มเติม'
  ),
  (
    '00000000-0000-0000-0001-000000000004',
    'คุณธนพล สินสมบัติ', 'thanaphon@finance.co.th',
    'บริษัทการเงินไทย', 'ผู้จัดการอาวุโส',
    '2026-07-16', '14:30', '16:00', 'ห้อง B201',
    '2026-07-09', 'pending',
    '00000000-0000-0000-0000-000000000003', 'jkl012',
    null
  ),
  (
    '00000000-0000-0000-0001-000000000005',
    'ดร.วรรณา เพชรรัตน์', 'wanna@tech.co.th',
    'Tech Innovation Co.', 'CTO',
    '2026-07-17', '09:00', '10:30', 'ห้อง Main Hall',
    '2026-07-10', 'confirmed',
    '00000000-0000-0000-0000-000000000004', 'mno345',
    'หัวข้อ Digital Transformation'
  ),
  (
    '00000000-0000-0000-0001-000000000006',
    'คุณอภิชาติ โกมลวิจิตร', 'apichat@design.co.th',
    'Creative Design Studio', 'Creative Director',
    '2026-07-17', '11:00', '12:30', 'ห้อง Main Hall',
    '2026-07-10', 'cancelled',
    '00000000-0000-0000-0000-000000000002', 'pqr678',
    'ติดภารกิจ ยกเลิกแล้ว'
  );

-- 7.3 Tickets
insert into tickets (id, speaker_id, subject, message, status) values
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0001-000000000001',
    'สอบถามเรื่องการเดินทางและที่จอดรถ',
    'สวัสดีครับ อยากทราบว่ามีที่จอดรถสำหรับวิทยากรไหมครับ และสถานที่จัดงานอยู่ที่ไหนของอาคารครับ',
    'open'
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0001-000000000003',
    'ขอสอบถามเรื่อง projector และอุปกรณ์',
    'อยากทราบว่าห้องบรรยายมี projector ขนาดกี่นิ้วครับ และสามารถเชื่อมต่อ HDMI ได้ไหม ไฟล์ slide ผมเป็น PowerPoint ครับ',
    'replied'
  );

-- 7.4 Ticket replies
insert into ticket_replies (ticket_id, message, from_role, author_name) values
  (
    '00000000-0000-0000-0002-000000000002',
    'สวัสดีครับ อาจารย์ ห้อง B201 มี projector Full HD ขนาด 120 นิ้ว มี HDMI adapter ครบทุก connector พร้อมรีโมทเลเซอร์ไว้ให้ครับ',
    'team', 'สมชาย ใจดี'
  );

-- 7.5 Notifications
insert into notifications (type, title, message, speaker_id, speaker_name, read) values
  (
    'ticket_opened', 'Ticket ใหม่จากวิทยากร',
    'ดร.พิชัย รัตนกุล เปิด Ticket ถามเรื่องการเดินทาง',
    '00000000-0000-0000-0001-000000000001', 'ดร.พิชัย รัตนกุล', false
  ),
  (
    'agenda_uploaded', 'อัปโหลด Agenda แล้ว',
    'ศ.ดร.มานะ ชัยเจริญ อัปโหลดไฟล์ Slide เรียบร้อยแล้ว',
    '00000000-0000-0000-0001-000000000003', 'ศ.ดร.มานะ ชัยเจริญ', false
  ),
  (
    'email_sent', 'ส่งอีเมลสำเร็จ',
    'ส่งอีเมลยืนยันการนัดหมายให้ คุณสุภาพร วงศ์มณี เรียบร้อยแล้ว',
    '00000000-0000-0000-0001-000000000002', 'คุณสุภาพร วงศ์มณี', true
  ),
  (
    'deadline_approaching', 'Deadline ใกล้แล้ว',
    'Deadline ส่ง Agenda ของ คุณธนพล สินสมบัติ เหลืออีก 2 วัน',
    '00000000-0000-0000-0001-000000000004', 'คุณธนพล สินสมบัติ', false
  );
