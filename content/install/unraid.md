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

It is the same software as the [Compose install](index.md): the same
programs from the same images, the same settings under the same names,
the same daily database dump. Everything under Use and Reference applies
as written. What differs is where you type things, and a short list of
things one container does differently from four; both are
[at the end of this page](#what-is-different-from-the-compose-install).
Read [What you need](../requirements.md) first.

## 1. Install hikari-index

In **Apps**, search for `hikari-index` and choose **Install**. Fill in:

| Field | What to put |
|---|---|
| **Gallery address** | The address you will open the gallery at, exactly as it will be in your browser's address bar: `http://192.0.2.10:5183` with your server's address, or its name if you use one. The admin sign-in refuses a form sent from any other address. The container does not start without it. |
| **Video** | The folder your video is in. Mounted read-only. |
| **Data** | A folder for the original frames and run records. The largest of the three: about 1 GB an episode until you [finish reviewing](../use/finishing.md) it, about 150 MB after. A share on the array is fine. |
| **Web images** | The images the gallery shows, about 15 MB an episode. They are read on every page view, so keep them on a pool that does not spin down. The default is beside your appdata. |

Choose **Apply**. The first start takes a minute.

## 2. Get the admin password

On the **Docker** tab, click the container's icon and choose **Logs**.
The first start prints your sign-in:

```
[hikari] Your admin sign-in. Only a hash of the password is kept: the
[hikari] password itself is in this log and nowhere else, and the log goes
[hikari] when the container is removed or updated. Write it down now.
[hikari]   user:     admin
[hikari]   password: ...
```

If you lose it, put an empty file named `reset-admin-password` in the
Config folder and restart the container: the log shows a new one.

If the container stops straight away, a line near the end of its log
that starts `[hikari] cannot start:` says what to change, for example a
folder that is not set or a Gallery address that is not a web address.

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

## The settings, as template fields

These are the settings on the [Settings](../reference/settings.md) page,
with the same names and defaults. On unRAID each is a field on the
hikari-index template; the ones past the first four are under **Show
more settings**. A field left empty means the default.

| Field | Setting | Default |
|---|---|---|
| **Gallery address** | `HIKARI_ORIGIN` | none: required |
| **Shoko address** | `HIKARI_SHOKO_BASE_URL` | empty: Shoko is off |
| **Source folders** | `HIKARI_SOURCE_ROOTS` | `library=/source` |
| **Working hours** | `HIKARI_WORKER_HOURS` | empty: any time |
| **Time zone** | `HIKARI_TZ` | empty: this server's own time zone |
| **Check for work every** | `HIKARI_POLL_SECONDS` | `30` |
| **More analyze workers** | `HIKARI_WORKER_TOKENS` | empty |
| **Footer notice** | `HIKARI_NOTICE` | empty |
| **Admin link** | `HIKARI_ADMIN_LINK` | `1` |
| **Admin name** | `HIKARI_ADMIN_USER` | empty: `admin` |
| **PUID**, **PGID** | `PUID`, `PGID` | `99`, `100` on the template (unRAID's own user) |

**Working hours** are on your server's clock: unRAID gives the container
its time zone. To use another, set **Time zone**. (On the Compose
install an empty time zone is UTC.)

**More analyze workers** takes the `name:token` pairs of workers on
other machines. The analyze container on this server needs nothing
there: the hikari-index container makes its token and gives it to the
gallery itself. A different token for the name `analyze` in the list
stops the container, with a line that says so.

The passwords and tokens the Compose install's first-run step prints
(`HIKARI_DB_PASSWORD`, `HIKARI_ADMIN_PASSWORD_HASH`,
`HIKARI_SESSION_SECRET`, `HIKARI_ANALYZE_TOKEN`) are made by the
container on its first start and kept in `hikari.env` in the Config
folder. There is nothing to paste.

On hikari-index-analyze: **Standby** is `HIKARI_WORKER_STANDBY` and
**Check for work every** is `HIKARI_POLL_SECONDS`, as for a worker on
[a second machine](second-machine.md).

## Shoko

Set **Shoko address**, put the non-admin API key, alone, in a file named
`shoko-api-key` in the Config folder, and set **Source folders** to
Shoko's managed folder id, for example `4=/source`. [Connect
Shoko](shoko.md) explains the key and the folder id; where that page
says `.env` and `secrets/`, use the template fields and the Config
folder.

## Backups

The container dumps the database once a day into `backups/` in the
Config folder and keeps fourteen, as every install does
([Backups](../run/backups.md) has what the dump is good for and how to
restore one). To restore one here, open the hikari-index container's
**Console**. First stop the two programs that write to the database:

```bash
/command/s6-svc -wD -d /run/service/worker
```

```bash
/command/s6-svc -wD -d /run/service/gallery
```

Then load the dump, with the file's date:

```bash
pg_restore -U hikari -d hikari --no-owner --clean --if-exists --exit-on-error /config/backups/hikari-2026-11-15.dump
```

Then restart the container, which starts both again.

Those dumps sit on the same disk as the database, so they guard against
a bad update or a mistake, not a dead disk: include the Config folder,
the Data folder and the Web images folder in whatever backs up your
server.

## Updating

Read the [release notes](https://github.com/hikari-index/hikari-index/releases)
first; each starts with **Action needed**. Then update both containers
from the Docker tab, hikari-index first, and keep them on the same
version. To stay on a release instead of `latest`, put its number at the
end of each template's **Repository** (`ghcr.io/hikari-index/hikari-index:1.5.0`).

## What is different from the Compose install

Where you type things:

| | Compose | unRAID |
|---|---|---|
| Settings | lines in `.env` | template fields |
| Folders and the port | `.env` lines (`HIKARI_VIDEO`, `HIKARI_DATA`, `HIKARI_IMAGES`, `HIKARI_BACKUPS`, `HIKARI_GALLERY_PORT`), Docker volumes by default | the template's path and port fields; the database and its dumps are inside the Config folder |
| Passwords and tokens | made by the first-run step, pasted into `.env` | made on the first start, kept in the Config folder; the admin password is in the container's log |
| Which analyze worker | `COMPOSE_PROFILES` | whether you install hikari-index-analyze |
| Version | `HIKARI_VERSION`, and `git pull` for the compose file | the tag at the end of **Repository** |

What one container cannot do the way four can:

- It starts as root, so it can make its folders and take the user id
  you give it, and each program inside then runs as that user. The
  Compose install's gallery, workers and text encoder never run as root,
  run read-only and with no extra privileges.
- The programs share one user and one filesystem, so each could read the
  others' files. Each is still given only its own settings and
  passwords, and your video is still mounted read-only.
- There is one health status, the gallery's and the text encoder's
  together, and one stop. unRAID gives a container its **Docker Stop
  Timeout** to stop (Settings, Docker; ten seconds unless you changed
  it). In that time the worker hands back what it is doing and the
  database shuts down; a stage that was running starts again at the next
  start.
- The database is inside the container and is not reachable from outside
  it. It is the same PostgreSQL and pgvector version as the Compose
  install's, installed from packages. Its folder cannot be swapped with
  a Compose install's, or with a separate database container's; moving
  between them is a dump from one and a restore into the other. Given a
  Config folder that already holds another install's database, the
  container stops before it touches anything and its log says so.
- The database's version moves with the container's, in the one update.
  Before the first start on a new version the container makes one extra
  dump (`before-...` in `backups/`, five kept), which the Compose
  install does not.
- **Gallery address** has no default here. Compose publishes the port
  itself, so it can assume `http://localhost:5183`; a single container
  cannot know what address it was given.
- **PUID** and **PGID** exist only here: the Compose install's images
  run as a fixed user, 10001.
