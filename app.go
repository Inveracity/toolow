package main

import (
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"toolow/volume"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

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

func (a *App) Volume(video string) (volumes []string) {
	v := volume.NewVolume()
	errstring, err := v.Volumedetect(video)
	if err != nil {
		fmt.Println(errstring)
	}

	return []string{v.Max, v.Mean}
}
