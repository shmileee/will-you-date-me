export const images = {
  catGif: {
    local: '/images/cat.gif',
    remote: 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif',
    alt: 'Милий котик',
  },
  spongebobGif: {
    local: '/images/spongebob.gif',
    remote: 'https://media.tenor.com/W-oA2c99rJQAAAAM/spongebob-spongebob-squarepants.gif',
    alt: 'Здивований Губка Боб',
  },
  shrekGif: {
    local: '/images/shrek.gif',
    remote: 'https://media.tenor.com/mtiOW6O-k8YAAAAM/shrek-shrek-rizz.gif',
    alt: 'Шрек з ризом',
  },
} as const;

export type ImageName = keyof typeof images;
