package main

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"toolow/volume"
)

// App struct
type App struct {
	ctx context.Context
	v   volume.Volume
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.v = volume.NewVolume(a.ctx)
}

// Get path to video file
func (a *App) Videofile() string {
	video, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Videos (*.mov;*.mp4)",
				Pattern:     "*.mov;*.mp4",
			},
		},
	})

	if err != nil {
		return err.Error()
	}
	return video
}

// Detect volume levels on video
func (a *App) Volume(video string) (volume.Volume, error) {
	v, err := a.v.Volumedetect(video)
	if err != nil {
		return volume.Volume{}, err
	}
	return v, nil
}

// Normalize audio on the video
func (a *App) Normalize(video string) (volume.Volume, error) {
	v, err := a.v.Lufs(video)
	if err != nil {
		return volume.Volume{}, err
	}
	return v, nil
}
