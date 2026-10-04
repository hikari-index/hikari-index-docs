---
title: Install
description: Install Hikari Index on one machine from source with Docker Compose, then prove it works with one file.
---

# Install

Everything on one machine, every image built from the source. This page
gets the install running and then proves it with one piece of video; the
setup you keep is the same install, with Shoko connected and your real
library behind it. Read [What you need](../requirements.md) first,
especially the part about file permissions if you are on Linux or a NAS.

> The source repository is not public yet, so the clone below will not
> work for you until it is.

## 1. Get the source

```bash
git clone https://github.com/hikari-index/hikari-index.git
```

```bash
cd hikari-index
```

## 2. Settings

Copy `.env.example` to `.env` (on Windows PowerShell,
`Copy-Item .env.example .env`; elsewhere `cp .env.example .env`). It is
the one settings file, and it stays on your machine. Set three things at
the top:

```
HIKARI_VIDEO=/path/to/your/video
HIKARI_ORIGIN=http://192.0.2.10:5183
COMPOSE_PROFILES=gpu
```

- `HIKARI_VIDEO` is the folder your video is in. Only the worker that
  reads video sees it, and only read-only.
- `HIKARI_ORIGIN` is the address you will open the gallery at, exactly as
  it will appear in your browser's address bar. The sign-in form refuses
  anything sent from another address. To use the gallery from other
  computers on your network, this is the server's address, not
  `localhost`.
- `COMPOSE_PROFILES` picks the analyze worker: `gpu` for an NVIDIA card,
  `cpu` for anything else.

Everything else in the file is optional and explained there and on the
[settings page](../reference/settings.md).

## 3. Build

The first command builds the model base. It downloads about 5 GB of
model weights and takes a while; you do it once.

```bash
docker compose build inference-base
```

Then the rest:

```bash
docker compose build
```

## 4. Make the secrets

```bash
docker compose run --rm --no-deps gallery node scripts/first-run.js
```

This prints six lines (the database password, the admin sign-in, a
session secret and the analyze worker's token) and then your admin
password. Paste the six lines at the end of `.env`, and keep the password
somewhere safe: it is shown once and not stored anywhere.

Paste rather than redirect the output into the file. Windows PowerShell 5
writes `>>` output as UTF-16, which Compose cannot read.

## 5. Start it

```bash
docker compose up -d
```

This starts five containers: the gallery, its database, the worker that
reads video, the analyze worker you picked, and the text encoder that
makes mood search work. The encoder needs no settings.

Open the gallery at the address you set in `HIKARI_ORIGIN`. The pages
are empty until you add something.

## 6. Connect Shoko

If you use Shoko, [connect it](shoko.md) now, before the first run. Then
the first run can be an episode you pick from Shoko's list.

## A first run that proves it works

With Shoko connected: choose **Admin**, sign in as `admin` with the
password from step 4, choose **Onboard**, search for a series, tick one
episode and confirm. Then skip to step 4 below.

Without Shoko, you need one video file in the `HIKARI_VIDEO` folder. If
you would rather not start with your own library, the
[Blender Studio open films](https://studio.blender.org/films/) are free
to download, licensed for reuse, and are what these docs' screenshots use.

1. Choose **Admin** in the header and sign in as `admin` with the
   password from step 4.
2. Choose **Onboard**, then **add a file by its path** (with Shoko not
   connected, that is the only choice besides a folder).
3. Pick the source folder (`library`), type the file's path inside your
   video folder, say whether it is an episode or a film, give it a title,
   and choose **Add it**.

   ![The form for adding a file by its path, filled in for a film](/shots/onboard-local.avif "Adding a file by its path.")

4. Open **Jobs**. The work moves through four stages: find the shots and
   pull frames, describe each frame and pick the stills, make the web
   images, add them to the gallery.

**It works when** all four stages finish and the stills appear under
**Library**, opening to pages with palettes and labels (a black or nearly
blank frame can have neither). Then type a phrase you have not searched
before into **Explore** with **by mood** chosen. If the stills come back
ranked, the text encoder is up too.

**It does not work when** a stage sits waiting for a worker that is "not
checked in": that container is not running. [When something
stops](../run/troubleshooting.md) has the fixes, starting from what the
Jobs page says.

## Next

- [Connect Shoko](shoko.md), if you skipped step 6.
- [Adding work](../use/adding.md) and [reviewing](../use/review.md).
- [Backups](../run/backups.md): worth setting up before you have hours of
  review in the database.
