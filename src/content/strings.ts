export const strings = {
  meta: {
    lang: 'uk',
    title: '🌸 Підеш зі мною на побачення?',
    description: 'Маленький сюрприз для Каті 🌸',
  },
  home: {
    question: '🌸 Підеш зі мною на побачення? 🌸',
    yes: 'ТАК 💕',
    no: 'ні… 🙈',
  },
  yay: {
    heading: 'ЗАЧЕКАЙ, ТИ СПРАВДІ СКАЗАЛА ТАК?? 😭',
    subtitle: 'Я був готовий до того, що ти скажеш ні 🥹',
    button: 'добре, добре! →',
  },
  date: {
    emojiHeader: '🗓️🐾',
    heading: 'То коли ти вільна?',
    dateLabel: 'Обери день ✨',
    timeLabel: 'О котрій? ⏰',
    timePlaceholder: 'Обери час…',
    times: [
      { value: '17:00', label: '17:00 — повечеряємо з пенсіонерами' },
      { value: '18:00', label: '18:00 — це правильна відповідь, чесно' },
      { value: '19:00', label: '19:00 — мене вже починає лоскотати в шлунку' },
      { value: '20:00', label: '20:00 — це вечеря чи сніданок?' },
    ],
    submit: 'записуймо побачення! 💌',
    errorMissing: 'Спочатку обери дату і час! 🥺',
  },
  food: {
    heading: 'Що нам сьогодні смакує? 🍜✨',
    options: [
      { key: 'pizza', emoji: '🍕', label: 'Піца' },
      { key: 'sushi', emoji: '🍣', label: 'Суші' },
      { key: 'burgers', emoji: '🍔', label: 'Бургери' },
      { key: 'pasta', emoji: '🍝', label: 'Паста' },
      { key: 'tacos', emoji: '🌮', label: 'Тако' },
      { key: 'ramen', emoji: '🍜', label: 'Рамен' },
    ],
    confirm: 'Це воно! →',
  },
  letter: {
    heading: 'тішуся, що ти не сказала «ні». будь готова о 18:00, я тебе підбираю 🚗',
    ps: 'P.S. нормальні люди пишуть смс. а я зробив сайт. за обідом. для тебе. без проблем.',
  },
} as const;

export type Strings = typeof strings;
export type FoodKey = (typeof strings.food.options)[number]['key'];
export type TimeValue = (typeof strings.date.times)[number]['value'];
