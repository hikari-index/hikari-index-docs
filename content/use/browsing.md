---
title: Browsing the library
description: The public pages - Library, a still, Similar, Palette and Techniques - and what the labels mean.
---

# Browsing the library

The gallery has two halves. The **public pages** (Library, Explore,
Palette, Techniques) are what anyone on your network sees. The **admin
area**, behind your sign-in, is where you add and review work. Nothing
you do on the public pages changes anything.

This page covers browsing; [Searching](search.md) covers Explore.

## Library

Everything in the gallery, grouped the way Shoko groups it: a title, its
seasons, their episodes, in order. A work added by path is grouped by the
title you typed, and under the wider title you gave it, if any (the films
here are all filed under "Blender Studio").

Open an episode or a film to get its **sheet**: every still in time
order, numbered, with its timestamp, its palette strip and its main
labels. For an episode, links at the top walk to the episode before and
after.

![A film's sheet: stills in time order with timestamps, palette strips and labels](/shots/sheet.avif "The sheet for Charge. Frames (CC) Blender Foundation | studio.blender.org.")

Only what you have stills for appears. The Library never lists episodes
you have not added, so it says nothing about the rest of your collection.

## A still

Click any still to open it large, with:

- its **palette**: a strip of the colors it is made of, then its
  shadows, midtones and highlights as swatches with hex values, and its
  brightness and saturation. Click a swatch to see every still that
  carries that color.
- its **labels** and **tags**. Each one is a link to Explore narrowed to
  it.
- **Similar by image** and **Similar by palette** (below).

![A still with its palette swatches and labels](/shots/still.avif "A still from Charge. Frame (CC) Blender Foundation | studio.blender.org.")

The left and right arrow keys move to the previous and next still of the
same episode.

## Similar

From a still:

- **Similar by image** finds stills whose whole picture is close by the
  image model: mostly what is in it and how it is drawn. Colors and
  framing count for less here.
- **Similar by palette** finds stills with the closest overall color
  balance, brightness and saturation, whatever is in them.

Both show the 24 nearest, and both can be limited to everything, the
same franchise, the same season or the same episode.

![Stills similar by image to one frame](/shots/similar.avif "Similar by image. Frames (CC) Blender Foundation | studio.blender.org.")

## Palette

Browse by how a frame is graded. The page opens on **common grades**
(pairs like "cool shadows, warm highlights"), then two rows of swatches:
the colors the library's shadows go, and the colors its highlights go.
Pick a shadow, a highlight, or one of each; the counts on the swatches
say how many stills each choice would leave.

![The Palette page with common grades and shadow and highlight swatches](/shots/palette.avif "Palette. Frames (CC) Blender Foundation | studio.blender.org.")

**Browse by a single color instead** shows the colors the library is most
made of. Pick one to see the stills that carry it, then add more colors
to narrow. **strict** wants each color close; **broad** accepts a wider
range.

## Techniques

One tile per named quality: shot scale, camera angle, composition, how
many people, lighting, time of day, weather and setting. A tile opens
Explore with that label set, where you can narrow further. A value gets a
tile once at least five stills carry it; "unknown", "mixed" and "none
visible" never do.

![The Techniques page, one tile per label value](/shots/techniques.avif "Techniques. Frames (CC) Blender Foundation | studio.blender.org.")

## What the labels are

The labels come from models trained on anime. They describe scenes and
framing; they never identify characters or people. Each is a proposal:
when a model has no evidence it leaves the label out rather than guess,
and you can [correct any of them](workbench.md#correcting-labels).

On anything that is not anime, like the Blender films in these
screenshots, the labels are unmeasured. The palettes and Similar work
the same on any video; the people count, for one, mostly reads "zero" on
3D characters, because the face detector was trained on drawn faces.
