-- Dodaj kolumnę sent_at — oznacza wysłane przypomnienia
alter table calendar_reminders add column if not exists sent_at timestamptz default null;
