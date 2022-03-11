package api

import (
	"os"
	"os/exec"
)

var TFLintExec = ""

func TFLint(in []byte) ([]byte, error) {
	path, err := asTempFile("", ".tf", in)
	if err != nil {
		return nil, err
	}

	defer os.Remove(path) // nolint: errcheck
	return exec.Command(TFLintExec, "--enable-plugin=aws", path, "--no-color").CombinedOutput()
}
