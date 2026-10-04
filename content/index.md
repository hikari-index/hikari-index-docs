---
title: Hikari Index
description: A local-first anime cinematography reference library. Pick an episode or a film from your own collection and get a few dozen stills that stand for it, with palette, framing, tags and likeness search.
---

# Hikari Index

<p class="lead">A reference library of stills from video you already have.
You pick an episode, a film or a season; Hikari Index pulls a few dozen
frames that stand for it, describes each one, and serves them from a
gallery on your own network. Your video is never changed, scanned as a
whole, or sent anywhere.</p>

![The Explore page of a gallery holding three Blender Studio films](/shots/explore.avif "Explore, the front page. Frames from Big Buck Bunny, Charge and Hero, (CC) Blender Foundation | studio.blender.org.")

Each still can carry:

- its **palette**: the colors it is made of, and the color of its shadows,
  midtones and highlights;
- **labels** for how it is framed and lit: shot scale, camera angle,
  composition, how many people, lighting, time of day, weather, setting;
- **tags** for what is in it;
- an **image vector**, so you can find stills that look alike, or search
  by mood with a phrase like "rainy neon street at night".

It was built for anime, and the models behind the labels were trained on
it. It runs on other video too: the palettes and likeness search work the
same, and the labels are unmeasured.

## Where to start

1. [What you need](requirements.md): a machine with Docker and your video,
   and somewhere to run the models.
2. [Install](install/index.md): everything on one machine, built from
   source.
3. [Adding work](use/adding.md) and [reviewing](use/review.md) once it runs.

If you use [Shoko](https://shokoanime.com/), [connect it](install/shoko.md)
after your first file has gone through without it.

## What it is not

- Not a media server or a player. It never streams your video.
- Not a scraper. Nothing runs until you choose a file, and it never walks
  your whole library.
- Not a character or face recognizer. The models describe scenes and
  framing; they never name anyone.
- Not finished. It is one person's working install, opened up. Images are
  not on a registry yet, so you build them yourself.

## Status

The source is at [github.com/hikari-index/hikari-index](https://github.com/hikari-index/hikari-index)
under the AGPL-3.0-or-later. Until that repository is public, its links
from these pages will not open for you.
