# TOO 🔈LOW

> ⚠️ Work In Progress

![](docs/toolow.png)

## About

This is a desktop application that wraps [ffmpeg](https://ffmpeg.org/) commands that I use from time to time.

To run this application, the `ffmpeg` binary needs to be available in _PATH_

Features:
  - Get the max and mean volume levels in dB

Goals:
  - Normalize/raise volume of the audio on a video file
  - Replace the audio track of a video with another audio file
  - Configurable path to ffmpeg binary

## Development

As of this writing it's built and run with
  - Go 1.19
  - ffmpeg 5.1
  - Wails 2.1.0


live development mode:

```sh
wails dev
```

there is also a dev server that runs on http://localhost:34115.

## Build

Build for Windows

```sh
wails build -platform "windows/amd64"
```
