---
title: Backups
description: What holds your library, how to take a matching backup of all three parts, and how to restore it.
---

# Backups

Three things hold your library:

1. **The database** holds your review work: what you culled, corrected,
   pinned and hid. Nothing else can rebuild that. A copy of the
   database's folder taken while it runs is not a backup; a dump is.
2. **The data** (`hikari-data`) holds the original frames and the run
   records.
3. **The web images** (`hikari-images`) are what the gallery serves.

Back up all three together. The database alone restores records that
point at files which are not there. And once you have
[finished an episode](../use/finishing.md) and its extra frames are
deleted, the tool cannot re-run it: the way back from lost files is to
remove the work and onboard it again, which loses your review of it.

Your `.env` is part of the backup too: the database was created with the
password in it.

## Folders or volumes

The easy way to back up the files is to keep them in folders of your own
rather than Docker volumes: set `HIKARI_DATA` and `HIKARI_IMAGES` in
`.env` to paths before the first start, and include those folders in
whatever already backs up the machine. The folders must be writable by
user id 10001.

If you leave them as Docker volumes, they are named after the folder you
cloned into (for example `hikari-index_hikari-data`; `docker volume ls`
shows them). Copy a volume's contents out to a backup folder with the
worker image, which is already on the machine; it runs as root here so
that the copy keeps the files' owner, user id 10001:

```bash
docker run --rm --user 0 --entrypoint cp -v hikari-index_hikari-data:/from:ro -v /backup/hikari-data:/to hikari-index/worker:local -a /from/. /to/
```

```bash
docker run --rm --user 0 --entrypoint cp -v hikari-index_hikari-images:/from:ro -v /backup/hikari-images:/to hikari-index/worker:local -a /from/. /to/
```

To put one back, swap the two `-v` sources: the backup folder as
`/from:ro`, the volume as `/to`. These commands were tested on Docker
Desktop for Windows, both ways, into a fresh volume.

## Taking a matching set

Stop everything that writes, leaving only the database up. The gallery
is one of the writers: it runs the last stage itself, stores what the
analyze workers send back, and saves your review.

```bash
docker compose stop gallery worker analyze-cpu analyze-gpu
```

Dump the database to a file inside its container, then copy the file
out. These two steps work in any shell; redirecting the dump with `>`
corrupts it in Windows PowerShell.

```bash
docker compose exec db pg_dump -Fc -U hikari -f /tmp/hikari-backup.dump hikari
```

```bash
docker compose cp db:/tmp/hikari-backup.dump ./hikari-backup.dump
```

Copy the data and web image folders, then start everything again:

```bash
docker compose up -d
```

## Restoring

On a fresh install: put the files back first, start only the database,
copy the dump in, load it, then start the rest.

```bash
docker compose up -d db
```

```bash
docker compose cp ./hikari-backup.dump db:/tmp/hikari-backup.dump
```

```bash
docker compose exec db pg_restore -U hikari -d hikari --no-owner --clean --if-exists /tmp/hikari-backup.dump
```

```bash
docker compose up -d
```
