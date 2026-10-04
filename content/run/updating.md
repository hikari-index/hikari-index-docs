---
title: Updating and removing
description: Update an install to a newer version, or stop and remove it.
---

# Updating and removing

## Updating

Take a [backup](backups.md) first if you have review work you care
about. Then, in the folder you cloned:

```bash
git pull
```

```bash
docker compose build
```

```bash
docker compose up -d
```

The gallery applies any database changes itself when it starts. Runs
already on disk stay readable by newer versions.

The model base is not rebuilt by `docker compose build`. Rebuild it only
when the update touched it: if the list of changed files that `git pull`
prints includes anything under `containers/inference/`, run this before
`docker compose build`:

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
