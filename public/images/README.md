# Photos / GIFs

This folder is where you drop your own images to replace the default GIFs.

## How it works

Each `<SwappableImage name="..." />` first tries to load the local file at `/images/<name>`. If missing, it falls back to the remote URL listed in `src/content/images.ts`.

To swap an image: drop a file here with one of these names. Any image format works (the browser handles the rest).

| File to drop here                    | Where it shows                 |
| ------------------------------------ | ------------------------------ |
| `cat.gif` (or `.jpg`/`.png`/`.webp`) | `/` — the home page question   |
| `spongebob.gif`                      | `/yay` — the surprise reaction |
| `shrek.gif`                          | `/letter` — the final letter   |

> **Tip:** Square or near-square photos look best. Animated GIFs work great. If you want, you can replace just one — the others will keep using the default GIFs.

## Want to change the alt text too?

Open `src/content/images.ts` and edit the `alt` field for that entry. Alt text shows when the image fails to load and is read by screen readers.
