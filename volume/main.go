package volume

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
)

type Volume struct {
	Max     string
	Mean    string
	output  string
	Outfile string
}

func NewVolume() Volume {
	return Volume{}
}

// Run the volume detection filter and return the mean and max volume in dB
func (v *Volume) Volumedetect(filename string) (Volume, error) {
	cmd := exec.Command("ffmpeg", "-i", filename, "-af", "volumedetect", "-vn", "-sn", "-dn", "-f", "null", "NUL")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return Volume{}, err
	}
	v.output = string(output)
	v.getMean()
	v.getMax()

	return *v, nil
}

// Normalize audio track to -14 LUFS, Loudness Range 11, True Peak -1dB
func (v *Volume) Lufs(filename string) (Volume, error) {
	ext := filepath.Ext(filename)
	outfile := fmt.Sprintf("%s_normalized%s", strings.TrimSuffix(filename, ext), ext)
	cmd := exec.Command("ffmpeg", "-i", filename, "-af", "loudnorm=I=-14:LRA=11:TP=-1", outfile)
	_, err := cmd.CombinedOutput()
	if err != nil {
		return Volume{}, err
	}

	// Analyze after normalization
	v.Volumedetect(outfile)
	v.getMean()
	v.getMax()
	v.Outfile = outfile

	return *v, nil
}

// Loop over ffmpeg output to grab specific lines and split on a delimiter
func getLine(find string, text string, delimiter string) string {
	out := strings.Split(strings.Replace(text, "\r\n", "\n", -1), "\n")
	for _, line := range out {
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
