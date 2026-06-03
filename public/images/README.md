# Photos / GIFs

Drop a personal photo or GIF here to replace one of the defaults.

## How it works

Each `<SwappableImage>` is configured in [`src/content/images.ts`](../../src/content/images.ts). Each entry has a `local` field and a `remote` field. By default `local` is empty (`''`), so the page loads the `remote` URL directly — no broken-image flash, no extra request.

To use a local photo:

1. Drop the file in this folder. Pick any name and any extension (e.g. `cat-katya.jpg`, `our-photo.png`, `dance.gif`).
2. Open `src/content/images.ts` and set the corresponding entry's `local` field to that path, e.g.:

   ```ts
   catGif: {
     local: '/images/cat-katya.jpg',  // ← edit this
     remote: 'https://media.giphy.com/...',
     alt: 'Милий котик',
   },
   ```

3. Commit, push. The next deploy will serve your image.

If the local file is ever missing on a deploy, the page seamlessly falls back to `remote`.

## Image registry

| Entry          | Where it shows                 |
| -------------- | ------------------------------ |
| `catGif`       | `/` — the home page question   |
| `spongebobGif` | `/yay` — the surprise reaction |
| `shrekGif`     | `/letter` — the final letter   |

## Tips

- Square or near-square crops look best.
- Animated GIFs work great.
- You can replace just one entry; the others keep their defaults.

## Want to change the alt text?

Edit the `alt` field for that entry in `src/content/images.ts`. Alt text is read by screen readers and shows if the image fails to load.
