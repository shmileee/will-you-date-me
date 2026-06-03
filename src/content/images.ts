/**
 * Image registry.
 *
 * Each entry has:
 *   - `local`:  Path to a same-origin file (e.g. `/images/cat.gif`).
 *               Leave empty (`''`) to skip the local-first attempt
 *               and use `remote` directly — recommended unless you've
 *               actually placed a file at that path. With an empty
 *               `local`, the page won't briefly flash a broken-image
 *               icon before falling back to the remote URL.
 *   - `remote`: A public URL that always works.
 *   - `alt`:    Screen-reader / fallback text.
 *
 * To personalise: drop a file into `public/images/` AND set this
 * entry's `local` to that path (e.g. `'/images/cat.gif'`). The page
 * will try local first and seamlessly fall back to `remote` if the
 * file is missing on that build.
 */
export const images = {
  catGif: {
    local: '',
    remote: 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif',
    alt: 'Милий котик',
  },
  spongebobGif: {
    local: '',
    remote: 'https://media.tenor.com/W-oA2c99rJQAAAAM/spongebob-spongebob-squarepants.gif',
    alt: 'Здивований Губка Боб',
  },
  shrekGif: {
    local: '',
    remote: 'https://media.tenor.com/mtiOW6O-k8YAAAAM/shrek-shrek-rizz.gif',
    alt: 'Шрек з ризом',
  },
} as const;

export type ImageName = keyof typeof images;
