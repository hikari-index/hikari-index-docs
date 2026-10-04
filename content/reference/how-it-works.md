---
title: How it works
description: The parts of Hikari Index, what happens to an episode on the way in, and the rules the tool keeps.
---

# How it works

This page is for people using Hikari Index. If you want to change the
code, the repository's
[HOW_IT_WORKS.md](https://github.com/hikari-index/hikari-index/blob/main/docs/HOW_IT_WORKS.md)
goes further: what is on disk, and worked examples of changing it.

## The parts

- **The gallery.** A web app on your network. Its public pages show the
  stills; its admin area, behind a sign-in, is where you choose what to
  add, watch the jobs, review the stills and fix labels. It owns the
  database and the job table, and it runs the last stage itself: adding
  finished stills to the library.
- **The worker that reads your video.** It runs on the machine that has
  the files. It finds the shots and pulls frames, and later makes the web
  images. It is the only part that opens source video.
- **The analyze worker.** It runs the models: tags for what is in a
  frame, faces for how it is framed, an image vector for likeness and
  mood search, and the picker that chooses the final set. It needs a GPU
  to be quick and a CPU to be possible. It never sees your video, only
  the frames the first stage prepared.
- **The text encoder.** A small service that turns a typed phrase into
  the same kind of vector the frames carry, so "rainy neon street at
  night" finds frames. Without it, tag search still works.
- **Shoko**, if you run it, is where the gallery looks up series,
  episodes and files, and how it groups them. It is read and never
  changed.

## What happens to an episode

1. **You choose it.** From Shoko's list, or by naming a file or a folder.
   Nothing runs before you confirm.
2. **Shots and frames.** The worker checks the file (against Shoko's
   recorded size and hash, or takes its own fingerprint for a file
   without Shoko), finds where each shot starts and ends, samples
   candidate frames across every shot, drops near twins, blank frames and
   fades, and pulls the chosen frames exactly, by timestamp. Colors are
   converted following the video's own color tags.
3. **Describing and picking.** The analyze worker describes the frames
   and picks the final set, spread across the episode with variety inside
   each stretch. How many is your choice: fewer, balanced or more.
4. **Web images.** Each picked frame is encoded as AVIF at up to four
   widths, never larger than the source.
5. **Into the library.** The gallery reads the records and adds the
   stills with their palette, labels, tags and vectors. From then on they
   show up in Library, Explore, Palette and Techniques.
6. **Review.** You cull what you do not want, correct labels, bring in
   frames the picker passed over, and hide stills from the public pages.
   Openings and endings that repeat across a season are marked for you so
   one action culls them.

Everything keeps a note of what made it: which build, which model
versions, which settings. A re-run reuses the extraction and makes a new
pick without touching your review.

## The rules it keeps

**About your files and your library.** These do not bend.

- Shoko is read-only. The tool never changes anything in it.
- Your video is read-only and stays on your network. Nothing goes to a
  cloud service.
- Only the worker that mounts the video opens it.
- A worker stage finishes or it did not happen: it writes into a staging
  folder and renames it into place, so a half-written stage is ignored
  and made again, never read.
- Every frame in the prepared set is checked against its checksum before
  the analyze worker reads it, because frames may cross a network share
  between machines.
- The original frames are kept. The extra frames the picker did not use
  are deleted only when you say you have finished reviewing.

**About what the tool is.** These are choices.

- Nothing is scanned. Work starts from an explicit choice, never a sweep
  of your library.
- A still is visible on your network from the moment it is imported.
  Review is yours to do; do it before you show the gallery around.
- The gallery is a curated subset of stills, never a mirror of your
  library. It does not list what else you have.
- The models describe scenes and framing. They do not identify
  characters or people. They were trained on anime; on anything else the
  labels are unmeasured.
- A label comes from a fixed list that includes "unknown". A model with
  no evidence says so instead of guessing.

## Default visibility

The **public pages** (Library, Explore, Palette, Techniques, a still, its
similar stills) open without signing in, for anyone who can reach the
gallery. On your own network that is mostly you and whoever shares it,
so it may not matter much; it is why a still you have not reviewed yet
can already be seen there. The admin area is always behind your sign-in.
