import { neon } from "@neondatabase/serverless";

// Limits on the "email me the link" form (route.ts). Each email sent is a row in the
// mercedtime database, the one the extension's degree requirements live in:
//
//   create table website_email_sends (
//     id bigint generated always as identity primary key,
//     email_hash text not null,   -- keyed hash of the address (HASH_SECRET), never the address
//     ip_hash text not null,      -- keyed hash of the sender's IP
//     sent_at timestamptz not null default now()
//   );
//
// DB_API signs in as mercedtime_website, which can only select, insert and delete in this table.
// No limit looks back more than a day, so each check deletes older rows; with the daily cap that
// keeps the table under a hundred rows, small enough to need no indexes.

const PER_IP_PER_HOUR = 20; // loose, since campus Wi-Fi puts many students behind a few addresses
const PER_DAY = 90; // under the 100 a day on Resend's free plan

export type Limit = "recipient" | "ip" | "daily";

/** Records a send unless a limit stops it: the row's id, or the limit that was hit. */
export async function reserveSend(emailHash: string, ipHash: string): Promise<{ id: string } | { limit: Limit }> {
  const sql = neon(process.env.DB_API!);
  // One statement, so the checks and the insert can't be split by another request.
  const [row] = await sql`
    with old as (
      delete from website_email_sends where sent_at < now() - interval '1 day'
    ), hit as (
      select
        exists (
          select 1 from website_email_sends
          where email_hash = ${emailHash}::text and sent_at > now() - interval '1 day'
        ) as recipient,
        (
          select count(*) from website_email_sends
          where ip_hash = ${ipHash}::text and sent_at > now() - interval '1 hour'
        ) >= ${PER_IP_PER_HOUR} as ip,
        (
          select count(*) from website_email_sends where sent_at > now() - interval '1 day'
        ) >= ${PER_DAY} as daily
    ), sent as (
      insert into website_email_sends (email_hash, ip_hash)
      select ${emailHash}::text, ${ipHash}::text from hit where not (recipient or ip or daily)
      returning id
    )
    select hit.*, (select id from sent) as id from hit`;
  if (row.id != null) return { id: String(row.id) };
  return { limit: row.recipient ? "recipient" : row.ip ? "ip" : "daily" };
}

/** Takes back a send whose email didn't go out, so it doesn't count against the student. */
export async function releaseSend(id: string) {
  const sql = neon(process.env.DB_API!);
  await sql`delete from website_email_sends where id = ${id}`;
}
