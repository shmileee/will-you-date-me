export interface DatePlan {
  date: string;
  timeValue: string;
  timeLabel: string;
  foodKey: string;
  foodEmoji: string;
  foodLabel: string;
}

export interface NotifyResult {
  ok: boolean;
  provider: 'telegram' | 'ntfy' | 'discord' | 'none';
  error?: string;
}

const TG_BOT_TOKEN = (import.meta.env.VITE_TG_BOT_TOKEN as string | undefined)?.trim();
const TG_CHAT_ID = (import.meta.env.VITE_TG_CHAT_ID as string | undefined)?.trim();
const NTFY_TOPIC = (import.meta.env.VITE_NTFY_TOPIC as string | undefined)?.trim();
const DISCORD_WEBHOOK = (import.meta.env.VITE_DISCORD_WEBHOOK as string | undefined)?.trim();

const WEEKDAYS_UK = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'] as const;

function formatDateUk(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${d.getFullYear()} (${WEEKDAYS_UK[d.getDay()]})`;
}

function formatMessage(plan: DatePlan): string {
  return [
    '🌸 Катя сказала ТАК! 🌸',
    '',
    `📅 День: ${formatDateUk(plan.date)}`,
    `⏰ Час: ${plan.timeLabel}`,
    `${plan.foodEmoji} Їжа: ${plan.foodLabel}`,
    '',
    'Час її забирати 💕',
  ].join('\n');
}

async function sendTelegram(text: string): Promise<NotifyResult> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text, disable_web_page_preview: true }),
    });
    if (!res.ok) {
      return { ok: false, provider: 'telegram', error: `HTTP ${res.status}: ${await res.text()}` };
    }
    return { ok: true, provider: 'telegram' };
  } catch (err) {
    return { ok: false, provider: 'telegram', error: String(err) };
  }
}

async function sendNtfy(text: string): Promise<NotifyResult> {
  try {
    const res = await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      headers: { Title: 'Date Proposal', Tags: 'cherry_blossom,sparkling_heart', Priority: '4' },
      body: text,
    });
    if (!res.ok) {
      return { ok: false, provider: 'ntfy', error: `HTTP ${res.status}` };
    }
    return { ok: true, provider: 'ntfy' };
  } catch (err) {
    return { ok: false, provider: 'ntfy', error: String(err) };
  }
}

async function sendDiscord(text: string): Promise<NotifyResult> {
  try {
    const res = await fetch(DISCORD_WEBHOOK!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    });
    if (!res.ok && res.status !== 204) {
      return { ok: false, provider: 'discord', error: `HTTP ${res.status}` };
    }
    return { ok: true, provider: 'discord' };
  } catch (err) {
    return { ok: false, provider: 'discord', error: String(err) };
  }
}

export async function sendDateProposal(plan: DatePlan): Promise<NotifyResult> {
  const text = formatMessage(plan);

  if (TG_BOT_TOKEN && TG_CHAT_ID) return sendTelegram(text);
  if (NTFY_TOPIC) return sendNtfy(text);
  if (DISCORD_WEBHOOK) return sendDiscord(text);

  if (import.meta.env.DEV) {
    console.info('[notify] no provider configured — would have sent:\n%s', text);
  }
  return { ok: true, provider: 'none' };
}

export function getNotifyProvider(): NotifyResult['provider'] {
  if (TG_BOT_TOKEN && TG_CHAT_ID) return 'telegram';
  if (NTFY_TOPIC) return 'ntfy';
  if (DISCORD_WEBHOOK) return 'discord';
  return 'none';
}
