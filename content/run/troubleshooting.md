---
title: When something stops
description: What the Jobs page's messages mean and what to do about each, plus the problems that show up outside it.
---

# When something stops

Start with the **Jobs** page. It says what each stage is doing or why it
is not, in words, and it has the buttons that fix most things.
[The Jobs page](../use/jobs.md) explains how to read it.

## What Jobs says

| What Jobs says | What it means | What to do |
|---|---|---|
| waiting for a worker "(not checked in)" | That worker's container is stopped or cannot reach the gallery. | `docker compose ps`, then `docker compose logs --tail 50 worker` (or `analyze-cpu`, `analyze-gpu`). Start it with `docker compose up -d`. The stage picks up by itself. |
| "to retry", with tries used | The stage failed in a way that may pass next time (a network blip, a restart). It waits 15 minutes, longer each time, and tries up to three times. | Nothing, or press **Retry now**. |
| "gave up" | Three tries failed. The reason is printed under the row. | Fix what the reason names, then **Retry**. |
| "refused" | The input can never work: an identity with a missing field, a video whose color tags the tool does not know, a path outside the source folder. | Read the reason. For a wrong path or title, **Remove…** the work and add it again. |
| "blocked, needs a human" | The file is not where the job says, or it changed since it was chosen. | Put the file back or fix the mount, then **Retry**. |
| a stage still "running" although its worker was stopped or restarted | The worker died mid-stage. | Nothing: once the worker's hold on the stage runs out (about ten minutes without a heartbeat) the stage is handed out again. A stage that is merely slow keeps its heartbeat and is left alone. |

## Other things that go wrong

- **The database will not start**, and its log says a superuser password
  is not specified: the first-run lines are not in `.env` yet
  ([Install](../install/index.md), step 4).
- **Sign-in fails with the right password**, or the form does nothing:
  `HIKARI_ORIGIN` is not the address in your browser's address bar. Fix
  it in `.env`, then `docker compose up -d`.
- **"No worker has reported a source folder yet"** on the Onboard page:
  the worker that reads video has not started. It waits for the gallery
  to be healthy first, which takes about half a minute.
- **The worker cannot write** to a data folder you chose yourself
  (`HIKARI_DATA`, `HIKARI_IMAGES` set to paths): the containers run as
  user id 10001, and the folder must be writable by it.
- **The worker cannot read your video** (Linux, NAS): mounting it
  read-only does not grant access. User 10001 needs read permission on
  the files and permission to enter every folder above them
  ([What you need](../requirements.md#file-permissions-read-this-on-linux-and-nas-hosts)).
- **An analyze worker says it cannot read a bundle, and to update
  whichever worker is behind:** usually the worker that reads video and
  the analyze worker were built from different versions. Rebuild both
  from the same version.
- **You lost the admin password:** run the first-run step again and
  replace three lines in `.env` with the new ones: `HIKARI_ADMIN_USER`,
  `HIKARI_ADMIN_PASSWORD_HASH` and `HIKARI_SESSION_SECRET`. Keep the
  database password line as it is. Then `docker compose up -d gallery`.
- **"unsupported source color metadata; refusing to guess"**: the
  video's color tags are only partly set, for example a color matrix
  but no transfer or primaries. The tool converts color by the file's own
  tags and treats only a file with no tags at all as ordinary HD video;
  it will not guess for a half-tagged one. This is not damage, and there
  is no setting to override it. (The Blender film Sintel, as Blender
  publishes it at 720p, is one such file.)
- **Worker hours seem off by some hours:** `HIKARI_WORKER_HOURS` is read
  on the container's clock, which is UTC.

## Logs

For any part:

```bash
docker compose logs --tail 100 gallery
```

The services are `gallery`, `worker`, `analyze-cpu` or `analyze-gpu`,
`text-encoder` and `db`. Each work also keeps its own stage logs beside
its frames (`extract.log`, `derive.log` in its folder on the data
volume).

Normal operation needs no shell beyond these commands, and no SQL. If you
find yourself editing the database by hand, that is a bug worth
reporting.
