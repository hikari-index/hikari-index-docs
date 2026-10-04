---
title: Settings
description: Every setting in .env, what it does, and its default.
---

# Settings

All settings live in `.env` beside `compose.yaml`. After changing one,
`docker compose up -d` applies it; Compose recreates only the containers
whose settings changed.

## Yours to set

| Setting | What it is |
|---|---|
| `HIKARI_VIDEO` | The folder your video is in. Mounted read-only at `/source` in the worker that reads video, and nowhere else. Required. |
| `HIKARI_ORIGIN` | The address you open the gallery at, exactly as the browser shows it, for example `http://192.0.2.10:5183`. The sign-in form refuses anything sent from another address. Default `http://localhost:5183`. |
| `COMPOSE_PROFILES` | Which analyze worker runs on this machine: `gpu`, `cpu`, or empty for none (when it runs on [a second machine](../install/second-machine.md)). Emptying it does not stop a worker that is already running: `docker compose rm -sf analyze-cpu` (or `analyze-gpu`) first. |

## Optional

| Setting | What it is |
|---|---|
| `HIKARI_GALLERY_PORT` | The port the gallery listens on. Default `5183`. |
| `HIKARI_GALLERY_BIND` | The address it listens on. Default `0.0.0.0` (every network the machine is on); `127.0.0.1` keeps it to this machine. |
| `HIKARI_DB_DATA` | A folder for the database instead of a Docker volume. |
| `HIKARI_DATA` | A folder for the run records and frames instead of a Docker volume. Must be writable by user id 10001. Needed for a second machine. |
| `HIKARI_IMAGES` | A folder for the web images instead of a Docker volume. Must be writable by user id 10001. |
| `HIKARI_SHOKO_BASE_URL` | Shoko's address, for example `http://192.0.2.20:8111`. Without it, Shoko is off. See [Connect Shoko](../install/shoko.md). |
| `HIKARI_SECRETS` | The folder holding the file `shoko-api-key`. Default `./secrets`. |
| `HIKARI_SOURCE_ROOTS` | Names for folders inside the video mount, as `name=/path` pairs separated by commas. Default `library=/source`. With Shoko, the name is Shoko's folder number. |
| `HIKARI_ANALYZE_STANDBY` | `1` makes this machine's analyze worker a fallback: it takes a stage only when no regular (non-standby) analyze worker has checked in for ten minutes. |
| `HIKARI_WORKER_HOURS` | Start the worker's stages (extraction, web images, deletions) only between these hours, for example `01-07`. A stage already running finishes. The hours are the container's clock, which is UTC. Empty means any time. |
| `HIKARI_POLL_SECONDS` | How often an idle worker asks for work. Default `30`. |
| `HIKARI_ADMIN_LINK` | `0` hides the **Admin** link in the header. It hides the link only; `/admin` still answers. Default `1`. |
| `HIKARI_VERSION` | The tag the built images get, and the version the gallery and workers print in their logs. Baked in at build time: change it, then `docker compose build`. Default `local`. |

## Made for you by the first-run step

`docker compose run --rm --no-deps gallery node scripts/first-run.js`
prints these. Do not edit them by hand, except to replace them with a new
set.

| Setting | What it is |
|---|---|
| `HIKARI_DB_PASSWORD` | The database's password. The database was created with it; changing it later locks the gallery out. |
| `HIKARI_ADMIN_USER` | The admin sign-in name, `admin`. |
| `HIKARI_ADMIN_PASSWORD_HASH` | A hash of the admin password. The password itself is stored nowhere. |
| `HIKARI_SESSION_SECRET` | Signs the sign-in cookie. Replacing it signs everyone out. |
| `HIKARI_ANALYZE_TOKEN` | The token this machine's analyze worker uses. |
| `HIKARI_WORKER_TOKENS` | Every analyze worker's `name:token` pair, separated by commas. The gallery accepts results only from these. |

## On a second machine

`.env.rtx-worker` or `.env.cpu-worker`, read only by
`compose.rtx-worker.yaml` or `compose.cpu-worker.yaml` and passed with
`--env-file`.

| Setting | What it is |
|---|---|
| `HIKARI_GALLERY_URL` | The main machine's gallery, by address and port. |
| `HIKARI_WORKER_ID` | This worker's name on Jobs. Must match its pair in the main machine's `HIKARI_WORKER_TOKENS`. |
| `HIKARI_WORKER_TOKEN` | Its token, the other half of that pair. |
| `HIKARI_WORKER_VERSION` | The image's tag and the version printed in its log. Set before building. |
| `HIKARI_WORKER_STANDBY` | `1` makes it a fallback (CPU example only; see [the second-machine page](../install/second-machine.md)). |
| `HIKARI_IMAGE_REPOSITORY` | CPU only: pull the image from a registry of yours instead of building it. |

## HTTPS through a reverse proxy

The gallery serves plain HTTP. If you already run a reverse proxy (Caddy,
nginx, Traefik, Nginx Proxy Manager) for other services on your network,
putting the gallery behind it with HTTPS is worth doing: browsers only
use HTTP/2 over HTTPS, and HTTP/2 fetches the dozens of small images on
a sheet or a search page over one connection instead of a handful at a
time, so those pages fill in faster.

Point the proxy at the gallery's port and set `HIKARI_ORIGIN` to the
address people type, for example `https://hikari.home.example`, or the
sign-in form will refuse them. The sign-in cookie is not yet marked as
HTTPS-only; it works, it is just less strict than it should be.

The admin area is meant for your own network. Do not put an install
where strangers can reach it.
