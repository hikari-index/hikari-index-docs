---
title: Reviewing
description: The marks, the Review page, Worth a look, and culling repeated openings and endings.
---

# Reviewing

A still is on the public pages from the moment it is imported. Review is
how you take out what should not be there (credits, title cards, a black
frame) and fix what the models got wrong. You do not have to look at
every still: cull what should go and accept the rest in bulk.

Sign in through **Admin**. The admin bar has **Review**, **Worth a
look**, **Onboard**, **Jobs** and **Removed**.

## The marks

| Mark | What it means | On the public pages |
|---|---|---|
| **unreviewed** | a picked still nobody has marked yet | shown |
| **kept** | you looked at it and it stays; stays editable | shown |
| **culled** | you threw it out | gone from every page, its address answers "not found"; **restore** brings it back as unreviewed |
| **hidden** | set aside without a verdict | gone, as for culled; **show** brings it back |
| **locked** | a pin: a [re-run](pool.md) must keep this frame | no change |
| **corrected** | you changed a label or tag; your value shows instead of the model's and survives re-runs | your value shows |
| **not picked** | a still a re-run dropped that you had marked, or a pool frame you locked that waits for a re-run | not shown |
| **sensitive** | the tagger's rating score was high enough to flag (see Worth a look); a note only | no change |

A still is one of unreviewed, kept or culled. Locked, hidden, corrected
and sensitive sit alongside that.

Culled and hidden look the same to a visitor. The difference is for you:
a culled still counts as reviewed (you decided against it); a hidden one
is set aside without a verdict.

A culled or hidden still's images can keep answering for up to half a
minute, and a browser that already loaded one keeps its copy.

## The Review page

**Admin → Review** is your library as a tree, grouped the way the Library
is, with counts at every level (picked, to review, culled, hidden,
corrected) and a bar for how much is reviewed.

![The Review page: the library as a tree with counts](/shots/review.avif "Review, part way through the films in these screenshots.")

- **needs a look first** puts anything with stills to review at the top,
  newest first; **a–z** sorts by title. The box filters by title or
  episode.
- **Continue reviewing** opens the next episode with unreviewed stills,
  showing only those.
- **Mark the rest kept (N)**, on an episode or a season, marks every
  unreviewed still there as kept. Culled, hidden and already kept stills
  are not touched. It asks first, and the message after it has an
  **Undo** for that batch.
- **Cull the repeats (N)**, on a season: see Repeats, below.
- **remove…**: see [Finishing an episode](finishing.md).

A typical pass over a new season: start on Worth a look, let the repeats
check finish and cull the repeats, open each episode and cull what else
should go, then mark the rest of the season kept.

## Worth a look

The picked, unreviewed stills the run records give a reason to check:

- **text on the frame**: the tagger saw credits, a title card, subtitles
  or a logo.
- **rating**: the tagger's scores for questionable and explicit add up to
  0.10 or more. Some shows trip this on every episode; it is a prompt,
  nothing more.
- **unsure scene label**: a setting, time of day or weather label
  proposed with low confidence (the score is shown).
- **shot size from a head**: no face was found, so a shot size was read
  from the height of a head. It is a suggestion: the still has no shot
  size, and Techniques does not count it, until you press **accept** on
  the card or pick it in edit labels. On fresh shows about two
  suggestions in three were right; this reason is how you find the third
  without the gallery asserting any of them.
- **face and head disagree**: the shot size came from the size of a face,
  but the same person's head points to another size. The face's size was
  wrong about half the time on such frames, mostly head and shoulders it
  called close-up.
- **unsure shot scale**: a shot size proposed from weak evidence (the
  scenery tag, or tags that pointed two ways); the reason says which. Off
  until you pick it, because it marks many stills that are fine. Shot
  sizes the machine left empty are not listed.

When you correct a shot size: close-up means a face or head filling most
of the frame, with little or no shoulder. Head and shoulders, waist up and
knees up are all medium; a whole figure is wide. Extreme close-up is a
detail (eyes, a hand) filling the frame, extreme wide a place with figures
tiny or absent.

![Worth a look, listing stills with text on the frame and unsure labels](/shots/worth-a-look.avif "Worth a look: end credits and title cards are the usual catch. Frames (CC) Blender Foundation | studio.blender.org.")

A reason hides nothing. Each still has cull, keep, hide and edit labels
(and **accept** where a shot size is suggested), and the page filters by
reason; **unreviewed only** can be switched off
to include stills you already marked. Works imported before these
reasons existed have none until you press **Read the run records
again…**, which queues one import per imported work on Jobs (busy works
are skipped) and changes none of your marks.

Reading the run records again re-reads what analysis already wrote: it
refreshes the reasons and labels from those records (your corrections
stay) but runs no analysis, so it adds nothing new. (If you ran a
development build before 1.3.0: do it once, so shot sizes from a head
that were imported as labels become suggestions. Releases before 1.3.0
never made them.) New labels from an
update (a camera angle, a shot size from a head) reach a work only when
its analysis runs again: **Re-run** on Jobs, or **Re-run every finished
work** for all of them (see [The pool and re-runs](pool.md)). A re-run
picks the stills again, and a work whose extra frames were discarded
cannot be re-run, so it keeps the labels it has.

## Repeats

After an import, once it has no other import waiting, the gallery
compares every episode of a season with the others and marks stills whose frame appears elsewhere:
an opening, an ending, a studio logo, a recap. Nothing is culled or
hidden by the mark.

On Review, a season shows **checking for repeats…** until that is done,
then **Cull the repeats (N)**. That culls every unreviewed still that is
not locked or hidden and repeats in at least half of the season's other episodes (and
in at least two), and offers Undo. To save one of them, lock it or keep
it first.

Stills that repeat in fewer episodes (a recap, a reused shot) are only
marked; the workbench's **repeats** filter lists them. A season with one
entry gets no marks, and one with two entries gets marks but never the
button (a frame can repeat in only one other episode there), so cull
those by hand. **repeats not checked (records unreadable)** means an
episode's run records could not be read; hover over it for why.
