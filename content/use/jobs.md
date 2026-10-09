---
title: The Jobs page
description: How to read Admin - Jobs - running, waiting and done work, and the buttons on each.
---

# The Jobs page

**Admin → Jobs** shows every piece of work and where it stands. It
refreshes itself while work is moving.

Each work runs in four stages, each on the worker that can do it, and a
stage starts when the one before it has finished. Each worker runs one
stage at a time and finishes it before taking the next, so a ready stage
can wait behind a long one. Different workers run at the same time.

![The Jobs page with one re-run in progress](/shots/jobs.avif "Jobs during a re-run of Charge: the bar's first segment is the stage running now.")

## Needs you

Stages that stopped and wait for a person: gave up after three tries,
blocked on a file that moved, or refused. The reason is on the row, with
**Retry** or **Remove…**. [When something
stops](../run/troubleshooting.md) has what each reason means.

## Running

What a machine is doing now: the work, the stage, which worker took it,
and how long it has been going. Each row has a bar with one segment per
stage. **Cancel** asks the worker to stop it.

## Waiting

Grouped by the worker that runs the next stage, in the order that
worker will take them, with a line on what it is doing:
busy with another stage, free, or not checked in. Waiting for the
analyze worker is normal while it is off; the stage starts when it comes
back.

A row that failed and will try again says when. **Retry now** skips the
wait. **Cancel all waiting** cancels the waiting work, except file
deletions already queued by a removal or by done reviewing.

## Done

One row per work, its newest run on top. From here:

- **Re-run**, with a still count beside it: pick the stills again. See
  [The pool and re-runs](pool.md).
- **Remove…**: take the work out of the gallery. See
  [Finishing an episode](finishing.md#removing-a-title-season-or-episode).
- **Review stills**: its workbench.

Above the list, **Re-run every finished work** does the same for every
work that can be re-run, each at its own still count. **Describe the
palettes again** runs the palette step over every finished work's stills
again, for when the palette tool has changed. Both skip works that are
busy.

## Cancelled

Work you cancelled, kept for the record. A re-run cancelled while it
was still waiting leaves the work's finished run as it was, with its
Re-run button; nothing is lost. One cancelled after its analysis stage
had already finished leaves the work without a Re-run button (neither
the half-done run nor the old one counts as finished); run it through
again from Onboard if you need it re-picked.

## When something goes wrong

Every state is in words on the row. [When something
stops](../run/troubleshooting.md) has what each one means and what to do.
