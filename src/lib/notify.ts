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
  configured: boolean;
  error?: string;
}

const TG_BOT_TOKEN = (import.meta.env.VITE_TG_BOT_TOKEN as string | undefined)?.trim();
const TG_CHAT_ID = (import.meta.env.VITE_TG_CHAT_ID as string | undefined)?.trim();

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

export async function sendDateProposal(plan: DatePlan): Promise<NotifyResult> {
  const text = formatMessage(plan);

  if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
    if (import.meta.env.DEV) {
      console.info('[notify] Telegram secrets not configured — would have sent:\n%s', text);
    }
    return { ok: true, configured: false };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text,
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      return { ok: false, configured: true, error: `HTTP ${res.status}: ${await res.text()}` };
    }
    return { ok: true, configured: true };
  } catch (err) {
    return { ok: false, configured: true, error: String(err) };
  }
}
