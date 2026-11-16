# GTA 4 Online Web Edition

Independent Grand Theft Auto IV information portal and responsive browser UI.

## Current status

- Static HTML, CSS and JavaScript website. No Node build step is required.
- GTA IV PC keyboard and mouse reference.
- Responsive mobile touch-control overlay and settings.
- Blog, privacy, terms, contact, FAQ, sitemap and custom 404 page.
- No GTA IV game engine or external game provider is connected at this time.
- This project does not host or distribute game files. Use a legally obtained copy of the game.

## Cloudflare Pages deployment

See [CLOUDFLARE-DEPLOY.md](./CLOUDFLARE-DEPLOY.md) for the GitHub-connected production setup.

Recommended settings:
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank (no build step is required)
- Build output directory: `.` (repository root)
- Root directory: `/`

The repository includes Cloudflare Pages `_headers` and `_redirects` files. No package installation or compilation is needed.

## Run locally

Serve this folder with any static web server and open the root URL. Opening files directly with `file://` is not recommended because browser security rules differ from a hosted website.

## Mobile controls

See [TOUCH-CONTROLS.md](./TOUCH-CONTROLS.md) for the documented GTA IV input map and client bridge contract.

## Independence

Grand Theft Auto and related marks belong to their respective rights holders. This is an independent fan project and is not affiliated with Rockstar Games or Take-Two Interactive.
