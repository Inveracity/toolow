# TOO 🔈LOW

> ⚠️ Work In Progress

![](https://i.imgur.com/NzPQe0o.gif)

The gif above shows a video file where the peak volume is -7.9dB, and after normalization it's raised to -1.1dB peak volume.

## Quickstart (Windows)

Install ffmpeg

```powershell
choco install ffmpg
```

Run `toolow.exe`

1. Press the Select video file button.
2. Press the Analyze button to get the current values.
3. Press Normalize Audio to normalize the audio. If the file already exists nothing will happen.

## About

This is a desktop application that wraps [ffmpeg](https://ffmpeg.org/) commands that I use from time to time.

To run this application, the `ffmpeg` binary needs to be available in _PATH_

Features:
  - Get the max and mean volume levels in dB
  - Normalize/raise volume of the audio on a video file

Goals:
  - Replace the audio track of a video with another audio file
  - Configurable path to ffmpeg binary
  - Cancel a normalization

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
