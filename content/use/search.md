---
title: Searching
description: Explore, the front page - search by tag or by mood, and narrow with the label rail.
---

# Searching

**Explore** is the front page. With nothing typed it shows a small
sample from across the library (it changes once a day), links to
Library, Palette and Techniques, and a link to browse every still, newest
first.

## By tag or by mood

The search box reads what you type in one of two ways, chosen by the
toggle beside it:

- **by tag** (the default) matches what you type against the stills'
  tags: `tree` finds every still with a tag that contains "tree". The box
  takes one tag; add more from the rail. A word that is exactly a label
  value, like `night` or `low key`, is taken as that label, and the page
  says so.
- **by mood** ranks stills by how the picture reads, from a description:
  "a lonely figure in a dark room", "rainy neon street at night". It
  needs the text encoder for any phrase it has not seen before (phrases
  already searched are remembered). When the encoder is not running the
  page says so and offers the same words as a tag search; a tag search
  that finds nothing offers the reverse.

![A mood search ranking stills against a typed phrase](/shots/explore-mood.avif "A mood search. Frames (CC) Blender Foundation | studio.blender.org.")

## Narrowing

Beside the results, the **Narrow** rail (a fold on a narrow window) lists
tags and label values with how many stills each would leave. Click one to
add it; click an active one, or its × above the results, to remove it.
**clear all** starts over. In mood mode the chips narrow first, and the
closest 240 of what is left are shown.

Every state is in the address, so a search can be bookmarked or sent,
and Back undoes the last change. Press <kbd>/</kbd> anywhere on the page
to jump to the search box.

## What it searches

Only the stills that are visible: picked, and not culled or hidden in
[review](review.md). Search never reaches your video, the frames the
picker passed over, or anything outside the gallery.
