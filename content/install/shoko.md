---
title: Connect Shoko
description: Give Hikari Index a read-only, non-admin Shoko API key and map Shoko's folders to the worker.
---

# Connect Shoko

With [Shoko](https://shokoanime.com/) connected, the Onboard page lets you
search your series and pick episodes from a list, and the Library groups
works the way Shoko does. This page assumes you already run Shoko and
know your way around it; Shoko itself is covered by
[Shoko's own docs](https://docs.shokoanime.com/).

Hikari Index only ever reads from Shoko. It can reach nine fixed read
addresses and nothing else, and it refuses a key that belongs to an admin
user.

You need three things: an API key for a non-admin Shoko user, Shoko's
address, and a mapping from Shoko's folders to where the worker sees the
same files.

## 1. A non-admin user

Create a Shoko user for Hikari Index, for example `hikari-index`, with a
password and with **Administrator** off. Creating users needs a Shoko
admin; do it the way you normally manage Shoko's users.

Shoko's web interface is for admin users. If you sign in there as this
user, the page sits on a spinner. That is expected: this user only ever
talks to the API.

## 2. Its API key

> **Warning** Shoko's docs do not cover making a key this way, so this
> step is ours, not Shoko's. Only do it if you are comfortable calling an
> API by hand. The command sends the user's password to Shoko, in the
> clear unless Shoko is behind HTTPS, so run it on your own network.
> Anyone who holds the key it returns can read your Shoko library as that
> user, so keep it in the one file below and nowhere else.

Shoko hands a user a key when you sign in to its API with that user's
name and password. No admin key is involved. From any machine that can
reach Shoko (the address is an example; 8111 is Shoko's usual port):

```bash
curl -s -H "Content-Type: application/json" -d '{"user":"hikari-index","pass":"THE-PASSWORD","device":"hikari-index"}' http://192.0.2.20:8111/api/auth
```

In Windows PowerShell, where `curl` is a different command:

```powershell
Invoke-RestMethod -Method Post -Uri http://192.0.2.20:8111/api/auth -ContentType 'application/json' -Body (@{ user = 'hikari-index'; pass = 'THE-PASSWORD'; device = 'hikari-index' } | ConvertTo-Json)
```

The answer is `{"apikey":"..."}` (PowerShell shows a small table with one
`apikey` row). `device` is only a label; it is how the key is named in
Shoko's list of keys.

Put the key, alone, in a file named `shoko-api-key` inside a folder named
`secrets` beside `compose.yaml` (or wherever `HIKARI_SECRETS` points). The
gallery runs as user id 10001 and must be able to read the file.

**Tested on** Shoko Server 5.3.3 (stable) and 6.0.0-dev.495 (a daily
build), October 2026. The same call made the key on both.

**To revoke the key** later, for example if it leaked:

```bash
curl -s -X DELETE -H "apikey: THE-KEY" -H "Content-Type: application/json" -d '"THE-KEY"' http://192.0.2.20:8111/api/auth
```

```powershell
Invoke-RestMethod -Method Delete -Uri http://192.0.2.20:8111/api/auth -Headers @{ apikey = 'THE-KEY' } -ContentType 'application/json' -Body (ConvertTo-Json 'THE-KEY')
```

Then make a new one as above.

## 3. Tell the gallery where Shoko is

In `.env`:

```
HIKARI_SHOKO_BASE_URL=http://192.0.2.20:8111
```

Use an address the gallery's container can reach: the server's address
on your network, not `localhost`. Then:

```bash
docker compose up -d gallery
```

**Check:** open **Admin**, then **Onboard**. With Shoko connected the
page has a series search. Search for a title you have.

| What Onboard says | What to do |
|---|---|
| a list of your series | It works. |
| that Shoko is not configured | `HIKARI_SHOKO_BASE_URL` is missing from `.env`, or the gallery was not restarted. |
| the key file cannot be read | Check the file's name, its folder, and that user 10001 can read it. |
| "the Shoko key belongs to an admin user" | You made the key for an admin. Make it for the non-admin user. |
| that it cannot reach Shoko | The address, the port, or a firewall between the two. |

## 4. Map Shoko's folders to the worker

Shoko knows each file as "folder N, then a path inside it". Shoko's
stable releases call these **import folders**; its newer builds call
them **managed folders**. Hikari Index's own messages say "managed
folder" either way. The worker needs to know where folder N is mounted
in its container. That is `HIKARI_SOURCE_ROOTS`.

**Finding the numbers.** Ask Shoko for its folder list with the key you
just made. On Shoko's stable releases (5.x):

```bash
curl -s -H "apikey: THE-KEY" http://192.0.2.20:8111/api/v3/ImportFolder
```

On newer builds (6.0 dailies) the address ends in `ManagedFolder`
instead:

```bash
curl -s -H "apikey: THE-KEY" http://192.0.2.20:8111/api/v3/ManagedFolder
```

In PowerShell, the same with `Invoke-RestMethod`:

```powershell
Invoke-RestMethod -Uri http://192.0.2.20:8111/api/v3/ImportFolder -Headers @{ apikey = 'THE-KEY' }
```

Each entry has an `ID`, a `Name` and Shoko's `Path`. Whichever address
answers 404 is the one your Shoko does not have; try the other.

**One folder.** Say Shoko's folder 4 is `/mnt/media/anime` on the machine
running Hikari Index:

```
HIKARI_VIDEO=/mnt/media/anime
HIKARI_SOURCE_ROOTS=4=/source
```

`HIKARI_VIDEO` is always mounted at `/source` in the worker, so this says
"folder 4 is /source".

**Several folders under one parent.** Folder 4 is `/mnt/media/anime` and
folder 7 is `/mnt/media/films`:

```
HIKARI_VIDEO=/mnt/media
HIKARI_SOURCE_ROOTS=4=/source/anime,7=/source/films
```

You can add a name for files outside Shoko to the same list, for example
`4=/source/anime,7=/source/films,other=/source/other`.

**Folders with no common parent** need a second mount. Say folder 4 is
`/mnt/media/anime` and folder 7 is `/mnt/other-disk/films`. Keep
`HIKARI_VIDEO=/mnt/media/anime`, and create a file named
`compose.override.yaml` beside `compose.yaml` (Compose reads it by
itself) with the second folder, read-only:

```yaml
services:
  worker:
    volumes:
      - /mnt/other-disk/films:/source-films:ro
```

Then in `.env`:

```
HIKARI_SOURCE_ROOTS=4=/source,7=/source-films
```

What matters is the path below the folder. Shoko may see the folder
under a different name than this machine does (a share, a container
path); only the part inside the folder has to match, and it will,
because it is the same folder.

The list from Shoko has every folder it knows, the ones it imports from
and the ones it moves files to. Map each one that holds files you want to
onboard. If you skip one, nothing breaks: onboard an episode from it and
its first stage stops on Jobs with "managed folder 4 is not mapped on
this worker", which tells you the number. Fix `.env`, restart the worker
and press **Retry**.

After changing `HIKARI_VIDEO` or `HIKARI_SOURCE_ROOTS`:

```bash
docker compose up -d worker
```

**Check:** onboard one episode from the search. Its first stage should
start within a minute. A stage blocked with a message about a managed
folder means the mapping is wrong. "is not at its Shoko location" means
the worker looked where the mapping sent it and found no file: check
what is in the mounted folder, and the path Shoko has for the file (it
may have moved since Shoko last saw it).

## What Hikari Index asks Shoko

Only reads: who the key belongs to, series search, a series and its
episodes, an episode and its files, a file, and the group a series is in.
The list is in
[`gallery/src/lib/server/shoko-client.js`](https://github.com/hikari-index/hikari-index/blob/main/gallery/src/lib/server/shoko-client.js);
a request for anything else is refused before it is sent. The key goes in
the `apikey` header and is never logged or shown on a page.

Before any frame is pulled, the worker checks the file's size and a hash
Shoko recorded against the file on disk, so a file that changed since
Shoko hashed it is caught rather than quietly used.
