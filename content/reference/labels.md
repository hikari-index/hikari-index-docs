---
title: How the labels are made
description: Which model or rule makes each label, how often it was right on the maintainer's stills, and where it is known to fail.
---

# How the labels are made

This page is for anyone who wants the detail behind the labels: what
produces each one, what it was measured against, and what it gets wrong.
The short version is on [How it works](how-it-works.md); this is the
long one.

Two things to hold on to while reading:

- **Every number here comes from the maintainer's own library**: a few
  hundred stills from a handful of shows, graded by one person against
  written rules, most of it blind (the July review showed the
  proposals; the search measurement used a model as judge, checked by
  a human audit). Your shows, your art styles and your eye will differ.
  The numbers show the shape of each label, not a promise.
- **Color, palette, tags and mood search are the strong part**, and what
  the tool was built for. The framing labels (shot size, composition,
  camera angle) are a help, not an answer, and the gallery is built so
  that they can be checked, corrected and, where they are guesses,
  held back until you accept them.

## The signals

Everything below is made from these, on the frames the first stage
pulled from the video; the label models read those frames, never the
video.

| Signal | What it is | Used for |
|---|---|---|
| Color measurement | The frame's own pixels: hue, saturation and brightness, and a palette | color bias, saturation, lighting (part), the palette |
| Tag reader | A model trained on illustration tags, kept behind a fixed allow-list of about 180 names | setting, time, weather, tags, part of shot size, text and rating reasons |
| Face detector | Finds anime faces and their boxes | shot size, composition, people (as a floor) |
| Head and person detectors | Find heads (including backs and profiles) and whole figures | heads: shot size and composition where no face was found, and a second opinion where one was; person boxes are recorded but make no label yet |
| Angle classifier | Reads the whole frame and names a camera angle | camera angle |
| Image and text vectors | One vector per still and per typed phrase, in the same space | likeness, mood search |

Most of the models were trained on anime or illustration (the angle
classifier on live-action stills); on anything else the labels are
unmeasured. None of them was trained on this tool's own
definitions (the five shot sizes, the composition classes), which is
where most of the remaining errors come from.

## Each label

### Color bias and saturation

Measured from the pixels, with fixed bands; the tag reader's monochrome
tag can override color bias to neutral. When the maintainer reviewed 200
stills in July, these were left as proposed on 99 and 100 of every 100.
Defined bands beat guessing here, so there is no model.

### Setting, time of day, weather

From the tag reader's tags, taken at a cut the model's own card calls
balanced (0.2653) rather than the stricter default used elsewhere. On the
same 200-still review, proposals were accepted about nine times in ten
(setting 92, time 91, weather 95 of 100). The cost is coverage: on the
maintainer's library, time of day and weather were proposed on about a
quarter of stills in the reviewed set and a fifth across the rest,
because the tagger names them only when they are plain to see. When the
strongest scene proposal on a still falls under the usual cut of 0.35,
it is listed on Worth a look as **unsure scene label** with its score.

### Lighting

Partly from the color measurement (high key, low key) and partly from two
tags (backlit, silhouette). It is proposed on roughly a fifth of stills
and accepted 88 times in 100 when it is. The gap is a real limit, not a
cut-off: nothing in the stack sees light direction.

### People

Counted from the tag reader's count tags, with the number of detected
faces as a floor (a face count can raise the number, never lower it,
because the detector misses more faces than it invents). On a blind grade
of 72 stills the label was right 59 times. Non-human characters are the
usual argument: the grader counted a penguin.

### Shot size

Four methods, tried in this order; the first that applies answers and the
rest stay quiet.

1. **The tag reader names it** (close-up, upper body, full body and so
   on). Right 27 times in 29 on a blind grade of faceless stills.
2. **The size of the largest face.** The face's area as a share of the
   frame, with cuts at 0.14 (close-up) and 0.009 (wide). On 74 stills
   with a face from eleven shows the cuts were never fitted on, 64 were
   right (86 in 100). Most misses are head and shoulders called close-up.
3. **Scenery.** No face, and the tag reader's scenery tag is on: wide.
   Right 28 times in 42 on the faceless grade; the maintainer accepts
   the misses (a close-up of leaves is "wide" by this rule).
4. **The height of the largest head**, for stills nothing above
   answered. Cuts at 0.72 and 0.19 of frame height. On three blind grades
   of fresh works it was right on 8 of 11, 14 of 22 and 20 of 30 of the
   stills it filled: about two in three. Two whole-frame shot-size
   classifiers and a second face detector were tested on the same
   stills against bars written down first, and none cleared them (the
   best, as a second opinion, agreed with the head on 22 of 30 and was
   right on 16 of those). So the gallery holds it as a **suggestion**:
   listed on Worth a look as **shot size from a head**, not the still's
   size and not counted in Techniques until you accept it or set one.

Head and shoulders counts as **medium**, not close-up; that was decided
on the first blind grade, where it was a third of all frames and the
face method already called most of them medium. No cut on face area or
head height separates the two (the ranges overlap), which is the one
seam every method shares.

Where the face method answered and the same person's head reads a
different size, the still is listed as **face and head disagree**. The
label stays the face's. On two blind grades the face's size was wrong on
7 of 15 such stills against 9 of 69 where the two agreed; on the random
sample alone it was 3 of 10 against 6 of 45. Read it as "two to three
times as likely to be wrong", and the reason shows both readings.

### Composition

The horizontal position of the subject: the largest face, or, with no
face, the largest head, against the center and the thirds lines (within
0.06 of the frame width). A mirror check names **symmetrical** on the
rare frame that is. On the blind grade, the class from the face matched
the grader's on 22 of 27 stills, and from the largest head on 30 of 42
(faced and faceless stills together). Stills with neither have no
composition unless the mirror check names symmetrical. Earlier attempts
to find the subject
without a detector (edges, saliency, contrast) did not reach a usable
agreement and were dropped.

### Camera angle

A classifier (aslakey/camera_angle, a fine-tune of DINOv2 trained on
live-action stills) reads the whole frame, squeezed to 224 by 224. On 148
stills from eleven shows graded blind, it agreed with the grader on 117
(79 in 100) on the frames as the worker sees them; always answering eye
level would have scored 79. It finds low and high angles well (about
three in four and nearly all), overhead and dutch badly (about a third
and a quarter), and about one call in ten is a low-versus-eye-level
split that a second reader would argue either way. It abstains only on a
flat title card.

### Tags

The tag reader's tags, kept only if they are on the allow-list: places
and things, actions, weather and time words. The list was culled by hand
from the model's vocabulary to leave out identity, age and anything the
tool should not say about a character. A tag is matched by its exact
name, never by substring, because the vocabulary is full of traps.

### Mood search and likeness

One image vector per still and one text vector per typed phrase, from the
same model (SigLIP 2), so a phrase finds frames by what is in them, not
by tags. Measured against 250 judged queries on the maintainer's library
(149 typed phrases, 101 find-more-like-this), semantic search beat tag
matching on every count, and on mood phrases
(a feeling rather than a thing) tag matching could not answer at all.
Likeness between stills uses the same vectors; it finds the same subject
and style, not the same framing.

## The samples behind the numbers

| Sample | Stills | From | Graded by |
|---|---|---|---|
| July review | 200 | 9 works | the maintainer, with the proposals shown (not blind) |
| Blind grade, October | 72 | 8 works, chosen to stress the close-up border | the maintainer, blind, film terms |
| Angle test | 154 | 11 shows never used for fitting, random | the maintainer, blind |
| Faceless test | 150 | 23 shows, random, faceless only | the maintainer, blind, pass/fail rules written first |

One grader throughout. Where two readings were plausible the rules on
the grading page decided, and the notes record the toss-ups. The search
measurement is the exception: a model judged 250 queries and the
maintainer audited 374 of its judgments; the two agreed on the ranking
of every system.

## Known limits

- **The face detector misses faces.** On about one "faceless" still in
  five a person can see a face it did not, stylized faces and some
  studios' styles most of all. The head detector covers nearly all of
  those, which is why the head method exists.
- **Head and shoulders versus close-up** is the boundary behind most
  shot-size errors, on faced and faceless stills alike.
- **Close-ups of objects, hands and food** are mostly read as wide by
  the classifiers tried, and about half of the stills still blank after
  every method are these; they are left blank or listed for you.
- **Dutch and overhead** angles are found about a third of the time.
- **Title cards and text** are found by the tag reader and listed as
  **text on the frame**; a title over a real shot keeps its labels.
- **Anything that is not anime** is unmeasured.

Getting past these means a model trained on this tool's own
definitions, on stills graded in the gallery; nothing available off the
shelf does it. Until then the override mechanisms are the answer: every
label can be corrected, a head-guessed size waits for you, a scenery
guess is listed when you turn that chip on, and the label report under
Admin measures the models on your own reviews.

## Models and licenses

Each model is pinned to one published revision and checked by hash when
the image is built; the images run with no network access to model
hosts.

| Model | License | Role |
|---|---|---|
| SmilingWolf/wd-swinv2-tagger-v3 | Apache-2.0 | tag reader |
| hysts/anime-face-detector (Faster R-CNN, HRNetV2) | MIT | faces |
| deepghs/anime_head_detection, anime_person_detection | MIT | heads, figures |
| aslakey/camera_angle (on facebook/dinov2-with-registers-large) | Apache-2.0 | camera angle |
| google/siglip2-base-patch16-224 | Apache-2.0 | vectors |

The repository's
[NOTICE](https://github.com/hikari-index/hikari-index/blob/main/NOTICE)
has the full list, including what the images download at build time.
