package volume

import (
	"fmt"
	"os/exec"
	"strings"
)

type Volume struct {
	Max    string
	Mean   string
	output string
}

func NewVolume() Volume {
	return Volume{}
}

func (v *Volume) Volumedetect(filename string) (string, error) {
	cmd := exec.Command("ffmpeg", "-i", filename, "-af", "volumedetect", "-vn", "-sn", "-dn", "-f", "null", "NUL")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Sprintf("%+v: %s", err.Error(), string(v.output)), err
	}
	v.output = string(output)
	v.getMean()
	v.getMax()

	return "", nil
}

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
