---
title: Updating and removing
description: Update an install to a newer version, or stop and remove it.
---

# Updating and removing

## Version numbers

Releases are numbered `MAJOR.MINOR.PATCH`, and each number says what an
update asks of you:

- **MAJOR** (`2.0.0`): you have to do something, such as change a
  setting, edit the compose file or your container template, rebuild
  something, or update a worker on another machine at the same time. The
  release notes open with exactly what.
- **MINOR** (`1.5.0`): something new or different, and nothing for you to
  do. If it changes the database in a way that stops you rolling back,
  the notes say so.
- **PATCH** (`1.5.1`): fixes only.

Every part (gallery, workers, text encoder) carries the same number; run
the same version everywhere. Notes for each release are on the
[Releases page](https://github.com/hikari-index/hikari-index/releases),
which starts every entry with **Action needed**.

## Updating

Take a [backup](backups.md) first if you have review work you care
about. Then, in the folder you cloned:

```bash
git pull
```

```bash
docker compose pull
```

```bash
docker compose up -d
```

`git pull` brings the compose file and settings examples up to date;
`docker compose pull` fetches the images for your `HIKARI_VERSION`
(`latest` unless you set it). With `HIKARI_VERSION` set to a release
number, change it to the new release first. If you build your images
from the source, run `docker compose build` instead of `docker compose
pull`.

The gallery applies any database changes itself when it starts. Runs
already on disk stay readable by newer versions. A release that adds or
improves a label changes nothing on works already imported: new labels
reach a work when its analysis runs again (**Re-run** on Jobs, or
**Re-run every finished work**; see [The pool and re-runs](../use/pool.md)).

With the GPU analyze worker, rebuild it after `git pull`:

```bash
docker compose build analyze-gpu
```

Its base is not rebuilt by that. Rebuild the base only when the update
touched it: if the list of changed files that `git pull` prints includes
anything under `containers/inference/`, run this first:

```bash
docker compose build inference-base
```

If you run an analyze worker on [a second machine](../install/second-machine.md),
update it to the same commit and rebuild it as well.

## Stopping and removing

```bash
docker compose down
```

stops everything and keeps your data.

```bash
docker compose down -v
```

also deletes the Docker volumes: the database, the frames and the web
images. It leaves alone any of those you pointed at folders of your own.

Your video is never touched by either.
