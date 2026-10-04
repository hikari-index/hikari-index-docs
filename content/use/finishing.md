---
title: Finishing an episode
description: Free the disk once an episode is reviewed, remove a title, season or episode, and see what was removed.
---

# Finishing an episode

## Done reviewing: free the disk

The pool is most of an episode's disk use: about 1 GB for a 24-minute
episode, against about 160 MB once trimmed ([What you
need](../requirements.md#disk) has the figures).

**done reviewing…** on a workbench (or on Review, for an episode or a
season) opens a page that shows how many extra frames would go and how
much space that frees. When you confirm, the worker that reads your
video deletes them as its next job (Jobs shows it). It is offered
once nothing there is left to review; until then the page says what is
in the way.

![The done-reviewing page, listing the extra frames to delete and the space they take](/shots/discard.avif "Done reviewing, for a film with nothing left to review.")

The picked stills, their full-size originals, any frame you locked, and
every record stay. What goes is the choice: **after this the episode
cannot be re-run** with a different count or new locks, because the
picker could choose a frame that is gone. The way back is to remove the
episode and add it again, which loses your review of it. It is refused
while a frame you locked from the pool still waits for its re-run.

## Removing a title, season or episode

**remove…** on Review (a title or a season), **remove this episode…** (or
**remove this film…**) on a workbench, or **Remove…** on a Jobs row
takes it out of the gallery at once and deletes everything the pipeline
made for it: its stills with your marks and corrections and its job
history straight away, its web images and folder of frames as a job for
the worker that reads your video. Your video is not touched.

The confirm page lists what goes, with sizes, and takes an optional
reason. It is refused while a worker is running a stage of it; cancel
that on Jobs first.

**Removed**, in the admin bar, lists the newest fifty removals. Every one
is recorded. To bring something back, add it again; the pipeline runs
from the start. Its work id stays taken until the file cleanup has run,
so with the worker stopped or outside its hours, wait for that first.

## Hiding the Admin link

The header's Admin link is on by default. `HIKARI_ADMIN_LINK=0` in `.env`
removes the link only; `/admin` typed into the address bar still reaches
the sign-in page.
