---
title: What you need
description: Hardware, disk, permissions and software for a Hikari Index install, with measured sizes and times.
---

# What you need

Hikari Index runs as a handful of containers. The simplest install puts
them all on one machine, the one that has your video.

## The machine

- **Docker with Compose**, on a 64-bit x86 machine (amd64). ARM machines,
  including Apple Silicon, are not supported: the worker pins an amd64
  FFmpeg build. Linux, or Docker Desktop on Windows.
- **Your video**, on that machine or mounted there. It is mounted
  read-only into one container and nothing writes to it.
- **Internet for the build and the first start.** The build downloads
  base images, Python and Node packages, FFmpeg and the model weights; the
  first start pulls the database image. After that nothing is
  downloaded, and nothing is ever uploaded.

Most of the testing so far is on Docker Desktop for Windows. The gallery,
its database and the worker that reads video also run on a Linux NAS
day to day. Other Linux hosts should work, and the one thing most likely to
trip them up is file permissions, below.

## File permissions (read this on Linux and NAS hosts)

Every Hikari Index container runs as **user id 10001**, not as root (the
database runs as its own image's user and looks after its own folder).
That matters in two places:

- **Your video folder.** Mounting it read-only does not grant access. User
  10001 needs read permission on the video files and permission to enter
  every folder above them. NAS media folders are often owned by something
  like `1026:100` or `nobody:users` with mode `750` or an ACL, which
  shuts 10001 out. Give that user read access (a wider mode, a group it
  can join, or an ACL entry) before the first run.
- **Data folders you choose yourself.** By default the library lives in
  Docker volumes and this sorts itself out. If you point `HIKARI_DATA` or
  `HIKARI_IMAGES` at folders of your own (see [Backups](run/backups.md)
  for why you might), those folders must be writable by 10001.

To check the video folder once the install is built, list it as the
worker sees it:

```bash
docker compose run --rm --no-deps --entrypoint ls worker -la /source
```

A list of your files means user 10001 can get in; "Permission denied"
means it cannot. On Docker Desktop for Windows this has not been a
problem.

## Disk

**For the images: about 12 GB with the CPU analyze worker, about 24 GB
with the GPU one**, measured on the built images, plus room for the build
itself. The GPU worker is built on an 18 GB base that holds CUDA and the
models; keep that base, because updates rebuild the GPU worker from it.
The CPU worker is a 6 GB image of its own and never needs the base.

**For the library**, measured on one 24-minute 1080p episode:

| Stage | Size |
|---|---|
| While it waits for your review | about 1 GB (the picked frames and the ones the picker passed over, as lossless PNG) |
| After you finish reviewing it | about 160 MB of original frames |
| Web images, always | about 14 MB |

A 4K film is several times that. The extra frames are what let you bring
in a frame the picker passed over; [finishing an episode](use/finishing.md)
deletes them.

## Somewhere to run the models

The analyze worker describes the frames and picks the stills. It comes in
two kinds:

- **GPU:** an NVIDIA card and the NVIDIA Container Toolkit (Docker
  Desktop on Windows has it built in through WSL 2).
- **CPU:** works on any machine, and is slower.

It never needs your video, so it can also run on
[a second machine](install/second-machine.md), for example a desktop with
a GPU while the video lives on a NAS.

How long a 24-minute 1080p episode took on the maintainer's machines:

| Stage | Time |
|---|---|
| Find shots and pull frames | about 4 minutes |
| Describe and pick, RTX 4070 | about 2.5 minutes |
| Describe and pick, CPU (Core i7-13700K, all 24 threads) | about 4 minutes |
| Web images | about 2.5 minutes |

And one CPU run held to **4 cores** of the same processor, to get closer to
a NAS: describing and picking Big Buck Bunny (10 minutes of 4K, 129
candidate frames) took 8 minutes, and the analyze worker's memory peaked
just under **1 GB**.

These are single measurements on one desktop, not a benchmark. A NAS
processor with 4 slower cores will take longer; how much longer has not
been measured.

## Shoko: optional, strongly recommended

[Shoko](https://shokoanime.com/) is a free anime collection manager that
identifies your files and keeps series, episodes and files in order.
Hikari Index is built to lean on it. With Shoko connected you search for
a series, tick episodes or a whole season, and the library is grouped the
way Shoko groups it; you never type a path.

Without Shoko it still works: you add files and folders by path and type
the titles and episode numbers yourself. That is fine for a few films and
slow for a large collection. [Connect Shoko](install/shoko.md) right
after installing.
