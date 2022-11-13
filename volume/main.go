package volume

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Volume struct {
	ctx     context.Context
	Max     string
	Mean    string
	output  []string
	Outfile string
}

func NewVolume(ctx context.Context) Volume {
	return Volume{ctx: ctx}
}

// Run the volume detection filter and return the mean and max volume in dB
func (v *Volume) Volumedetect(filename string) (Volume, error) {
	out := v.ffmpeg("-i", filename, "-af", "volumedetect", "-vn", "-sn", "-dn", "-f", "null", "NUL")

	v.output = out
	v.getMean()
	v.getMax()

	return *v, nil
}

// Normalize audio track to -14 LUFS, Loudness Range 11, True Peak -1dB
func (v *Volume) Lufs(filename string) (Volume, error) {
	ext := filepath.Ext(filename)
	outfile := fmt.Sprintf("%s_normalized%s", strings.TrimSuffix(filename, ext), ext)
	v.ffmpeg("-n", "-i", filename, "-af", "loudnorm=I=-14:LRA=11:TP=-1", outfile)

	v.Outfile = outfile

	return *v, nil
}

// Loop over ffmpeg output to grab specific lines and split on a delimiter
func getLine(find string, text []string, delimiter string) string {
	for _, line := range text {
		if strings.Contains(line, find) {
			found_line := strings.Split(line, delimiter)
			found_value := strings.Trim(found_line[1], " ")
			return found_value
		}
	}
	return ""
}

func (v *Volume) getMax() string {
	v.Max = getLine("max_volume", v.output, ":")
	return v.Max
}

func (v *Volume) getMean() string {
	v.Mean = getLine("mean_volume", v.output, ":")
	return v.Mean
}

func (v *Volume) ffmpeg(args ...string) []string {
	cmd := exec.Command("ffmpeg", args...)
	cmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow:    true,
		CreationFlags: 0x08000000,
	}

	stderr, _ := cmd.StderrPipe()
	cmd.Start()

	streamScanner := bufio.NewScanner(stderr)
	streamScanner.Split(ScanLinesHack)

	go func() {
		for streamScanner.Scan() {
			m := streamScanner.Text()
			runtime.EventsEmit(v.ctx, "stream", m)
		}
	}()

	scanner := bufio.NewScanner(stderr)
	scanner.Split(bufio.ScanLines)

	out := []string{""}
	for scanner.Scan() {
		m := scanner.Text()

		out = append(out, m)
	}

	cmd.Wait()
	runtime.EventsEmit(v.ctx, "ffmpeg", out)
	return out
}

// dropCR copied from Go src bufio scan.go
func dropCR(data []byte) []byte {
	if len(data) > 0 && data[len(data)-1] == '\r' {
		return data[0 : len(data)-1]
	}
	return data
}

// ScanLines copied and changed from Go src bufio scan.go to be Windows friendly
func ScanLinesHack(data []byte, atEOF bool) (advance int, token []byte, err error) {
	if atEOF && len(data) == 0 {
		return 0, nil, nil
	}
	if i := bytes.IndexByte(data, '\r'); i >= 0 {
		// We have a full newline-terminated line.
		return i + 1, dropCR(data[0:i]), nil
	}
	// If we're at EOF, we have a final, non-terminated line. Return it.
	if atEOF {
		return len(data), dropCR(data), nil
	}
	// Request more data.
	return 0, nil, nil
}
