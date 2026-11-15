---
title: On unRAID
description: Install Hikari Index on unRAID from Community Apps, as one container plus an analyze worker.
---

# Install on unRAID

On unRAID you can install from Community Apps instead of Docker Compose.
Two templates:

- **hikari-index**: the gallery, its database, the worker that reads
  your video and the text encoder for mood search, in one container.
- **hikari-index-analyze**: the analyze worker, on CPU. It describes
  each frame and picks the stills. It is the heavy part, which is why it
  is separate: you can pin it to a few cores, or leave it out and run a
  [GPU worker on another machine](second-machine.md) instead.

It is the same software as the [Compose install](index.md), packaged
differently; everything under Use and Reference applies as written. Read
[What you need](../requirements.md) first.

## 1. Install hikari-index

In **Apps**, search for `hikari-index` and choose **Install**. Fill in:

| Field | What to put |
|---|---|
| **Gallery address** | The address you will open the gallery at, exactly as it will be in your browser's address bar: `http://192.0.2.10:5183` with your server's address, or its name if you use one. The admin sign-in refuses a form sent from any other address. |
| **Video** | The folder your video is in. Mounted read-only. |
| **Data** | A folder for the original frames and run records. The largest of the three: about 1 GB an episode until you [finish reviewing](../use/finishing.md) it, about 150 MB after. A share on the array is fine. |
| **Web images** | The images the gallery shows, about 15 MB an episode. They are read on every page view, so keep them on a pool that does not spin down. The default is beside your appdata. |

Under **Show more settings**: **Config** (default
`/mnt/user/appdata/hikari-index`) holds the database, the passwords the
container makes and a daily database dump; **PUID** and **PGID** are the
user that owns the files it writes (99 and 100, unRAID's own).

Choose **Apply**. The first start takes a minute.

## 2. Get the admin password

On the **Docker** tab, click the container's icon and choose **Logs**.
The first start prints your sign-in once:

```
[hikari] Your admin sign-in (shown once; it is not stored anywhere):
[hikari]   user:     admin
[hikari]   password: ...
```

Keep it somewhere safe. If you lose it, put an empty file named
`reset-admin-password` in the Config folder and restart the container:
the log shows a new one.

If the container stops straight away, the last line of its log says what
to change, for example a folder that is not set or a Gallery address
that is not a web address.

## 3. Install hikari-index-analyze

In **Apps**, search for `hikari-index-analyze` and choose **Install**.
Set **Data** to the same folder you gave hikari-index. Leave the rest:
it finds the gallery on this server and reads its own token from the
Config folder, so nothing is pasted. If you changed the gallery's port
or Config folder, change **Gallery** and (under more settings) **Token
folder** to match.

While it works it uses every core you leave it and about 1 GB of memory,
for roughly eight minutes an episode on four cores. unRAID's CPU pinning
on the template page is the way to keep it off cores other things need.
It waits quietly when there is nothing to do.

## 4. Prove it works

Follow [A first run that proves it works](index.md#a-first-run-that-proves-it-works)
on the Compose page; it is the same from here. The source folder is
named `library`, and paths are typed from inside your Video folder.

## Shoko

Set **Shoko address** on the hikari-index template (under more
settings), put the non-admin API key, alone, in a file named
`shoko-api-key` in the Config folder, and set **Source folders** to
Shoko's managed folder id, for example `4=/source`. [Connect
Shoko](shoko.md) explains the key and the folder id; where that page
says `.env` and `secrets/`, use the template fields and the Config
folder.

## Backups

The container dumps the database once a day into `backups/` in the
Config folder and keeps fourteen, and makes one more before an update
changes the database. Those sit on the same disk as the database, so
they guard against a bad update or a mistake, not a dead disk: include
the Config folder, the Data folder and the Web images folder in whatever
backs up your server. [Backups](../run/backups.md) says why all three
belong together.

## Updating

Read the [release notes](https://github.com/hikari-index/hikari-index/releases)
first; each starts with **Action needed**. Then update both containers
from the Docker tab, hikari-index first, and keep them on the same
version. To stay on a release instead of `latest`, put its number at the
end of each template's **Repository** (`ghcr.io/hikari-index/hikari-index:1.5.0`).

## What is different from the Compose install

- The container starts as root so it can make its folders and take the
  user id you give it; each program inside then runs as that user. The
  Compose install's containers never run as root and are read-only.
- The database is inside the container and is not reachable from
  outside it. A move to a new major PostgreSQL version will be a
  release with its own instructions.
- The analyze worker on a GPU is still a [second machine](second-machine.md)
  job. Give that worker's `name:token` to hikari-index in **More analyze
  workers**.
