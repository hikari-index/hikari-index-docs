---
title: Hikari Index
description: An anime-first cinematography reference library. Pick an episode or a film from your own collection and get a few dozen stills that stand for it, with palette, framing, tags and likeness search.
---

# Hikari Index

<p class="lead">An anime-first reference library of stills from video you
already have. You pick an episode, a film or a season; Hikari Index pulls
a few dozen frames that stand for it, describes each one, and serves them
from a gallery on your own network. It reads only the files you choose,
never changes them, and never sends them anywhere.</p>

![The Explore page of a gallery holding five Blender Studio films](/shots/explore.avif "Explore, the front page. Frames from Blender Studio open films, (CC) Blender Foundation | studio.blender.org.")

Each still can carry:

- its **palette**: the colors it is made of, and the color of its shadows,
  midtones and highlights;
- **labels** for how it is framed and lit: shot scale, camera angle,
  composition, how many people, lighting, time of day, weather, setting;
- **tags** for what is in it;
- an **image vector**, so you can find stills that look alike, or search
  by mood with a phrase like "rainy neon street at night".

The models behind the labels were trained on anime. It runs on other
video too, like the Blender films in these screenshots: the palettes and
likeness search work the same, and the labels are unmeasured.

## Where to start

1. [What you need](requirements.md): a machine with Docker and your video,
   somewhere to run the models, and ideally Shoko.
2. [Install](install/index.md): everything on one machine, from the
   published images.
3. [Connect Shoko](install/shoko.md), if you use it. You then pick series
   and episodes from a list and never have to type a path.
4. [Adding work](use/adding.md) and [reviewing](use/review.md) once it runs.

## What it is not

- Not a media server or a player. It never streams your video.
- Not a scanner. Nothing runs until you choose an episode, a season or a
  film, and it never looks through the rest of your library.
- Not a character or face recognizer. The models describe scenes and
  framing; they never name anyone.
- Not finished. It is one person's working install, opened up.

## Status

The source is at [github.com/hikari-index/hikari-index](https://github.com/hikari-index/hikari-index)
under the AGPL-3.0-or-later. Current version is v1.3.0.
