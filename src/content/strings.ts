export const strings = {
  meta: {
    lang: 'uk',
    title: '🌸 Підеш зі мною на побачення?',
    description: 'Маленький сюрприз для Каті 🌸',
  },
  home: {
    question: '🌸 Катю, підеш зі мною на побачення? 🌸',
    yes: 'ТАК 💕',
    no: 'ні… 🙈',
  },
  yay: {
    heading: 'СТРИВАЙ, ТИ РЕАЛЬНО СКАЗАЛА «ТАК»?? 😭',
    subtitle: 'Я вже морально готувався, що ти скажеш «ні» 🥹',
    button: 'окей-окей! →',
  },
  date: {
    emojiHeader: '🗓️🐾',
    heading: 'То коли ти вільна?',
    dateLabel: 'Обери день ✨',
    timeLabel: 'О котрій? ⏰',
    timePlaceholder: 'Обери час…',
    times: [
      { value: '17:00', label: '17:00 — вечеряємо з пенсіонерами' },
      { value: '18:00', label: '18:00 — от це правильна відповідь, чесно' },
      { value: '19:00', label: '19:00 — у мене вже живіт бурчить' },
      { value: '20:00', label: '20:00 — це вже вечеря чи сніданок?' },
    ],
    submit: 'фіксуємо побачення! 💌',
    errorMissing: 'Спочатку обери дату і час! 🥺',
  },
  food: {
    heading: 'На що сьогодні тягне? 🍜✨',
    optionsLabel: 'Обери, що нам сьогодні поїсти',
    options: [
      { key: 'pizza', emoji: '🍕', label: 'Піца' },
      { key: 'sushi', emoji: '🍣', label: 'Суші' },
      { key: 'burgers', emoji: '🍔', label: 'Бургери' },
      { key: 'pasta', emoji: '🍝', label: 'Паста' },
      { key: 'tacos', emoji: '🌮', label: 'Тако' },
      { key: 'ramen', emoji: '🍜', label: 'Рамен' },
    ],
    confirm: 'Це воно! →',
    sending: 'надсилаю…',
    sendError: 'Не вдалося надіслати… Спробуй ще раз 🥺',
    retry: 'Спробувати ще',
  },
  letter: {
    heading: 'радію, що ти не сказала «ні». будь готова о {time} — я заїду по тебе 🚗',
    defaultTime: '18:00',
    ps: 'P.S. нормальні люди просто пишуть повідомлення. а я зробив сайт. під час обіду. для тебе. дрібниці.',
  },
} as const;

export type Strings = typeof strings;
export type FoodKey = (typeof strings.food.options)[number]['key'];
export type TimeValue = (typeof strings.date.times)[number]['value'];
