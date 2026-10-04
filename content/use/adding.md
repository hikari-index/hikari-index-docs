---
title: Adding work
description: Onboard an episode, a season or a film - from Shoko, one file by its path, or a folder of episodes.
---

# Adding work

Everything starts on **Admin → Onboard**. Nothing is scanned and nothing
runs on its own: you choose what to add, confirm it, and it waits in
[Jobs](jobs.md) for the machines that do the work.

There are three ways in.

## From Shoko

With [Shoko connected](../install/shoko.md), Onboard opens on a series
search.

1. Search for the series by its title as Shoko has it, and open it.
2. The series page lists its episodes that have files. Credits, trailers
   and other extras are left out of the list. Tick the episodes you want,
   or use **Select all ready**. You can take up to 60 at once; for a
   longer series, **Select the next 60 ready** takes them in order.
3. **Review and onboard** opens the confirm page: what will run, the
   still count (below), and any file that cannot be added and why.
4. **Onboard** queues them. They run one after another, in that order.

## One file by its path

For a video that is not in Shoko, or an install without Shoko: **add a
file by its path**.

![The form for adding a file by its path, filled in for a film](/shots/onboard-local.avif "Adding a file by its path.")

- **Source folder**: which of the worker's folders the file is in
  (`library` unless you set `HIKARI_SOURCE_ROOTS`).
- **Path inside it**: the file itself, exactly as the worker sees it,
  capitals included. Either kind of slash works.
- **What it is**: an episode of a series (title and episode number) or a
  film (title). Episodes typed with the same series title are one series:
  they sit together and are checked against each other for repeated
  openings and endings. Give each season its own series title.
- **File it under** (optional): a wider title that gathers several series
  or films in the Library, the way a show's seasons sit under the show.
  Typed for a series that is already there, it moves the whole series.
- **Work id** (optional): the name used in addresses and folders. Made
  from the title when left empty.

The page does not look at the file when you submit. The first stage
checks it: a wrong path, a file with no video, or one with more than one
video stream stops there, and its row on Jobs says why. The same folder
and path can be queued only once.

## A folder of episodes

For a season outside Shoko: **add a folder of episodes**. Name the folder
(only that folder is listed, not its subfolders). The worker that reads
your video lists its files, which takes a few seconds; the page refreshes
itself. You then get the files with a guessed episode number each to
fix, untick or confirm, a series title, and the same choices as for one
file.

## How many stills

Every way in asks for a still count:

- **Fewer**: about 60% of balanced.
- **Balanced**: worked out from the number of shots. A 24-minute episode
  gets a few dozen; the three short films in these screenshots got 35
  each.
- **More**: about 150% of balanced, at most 300 (plus any frames you
  [lock](pool.md), which are always kept).

The pick chooses from every frame the extraction kept, so a bigger count
costs no extra decoding. You can change it later with a
[re-run](pool.md).

## What runs

Each work goes through four stages:

1. **Find the shots and pull frames from the video**, on the worker that
   reads your video.
2. **Describe each frame and pick the stills**, on an analyze worker.
3. **Make the web images for the picked stills**, back on the first
   worker.
4. **Add them to the gallery**, in the gallery itself.

Color is taken from the video's own color tags. When the last stage
finishes, the stills are on the public pages at once, before you have
reviewed them; see [Reviewing](review.md).
