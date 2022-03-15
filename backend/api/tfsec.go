package api

import (
	"os"
	"os/exec"
)

var TFSecExec = "./bin/tfsec-1.5.0"

func TFSec(in []byte) ([]byte, error) {
	path, err := asTempDir(".tf", in)
	if err != nil {
		return nil, err
	}

	defer os.RemoveAll(path) // nolint: errcheck
	return exec.Command(TFSecExec, path, "--concise-output", "--no-color").CombinedOutput()
}
