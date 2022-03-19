package api

import (
    "fmt"
    "os"
	"os/exec"
)

var TFSecExec = getEnv("TFSEC_EXEC", fmt.Sprintf("%s/tfsec", BIN_PATH))

func TFSec(in []byte) ([]byte, error) {
	path, err := asTempDir(".tf", in)
	if err != nil {
		return nil, err
	}

	defer os.RemoveAll(path) // nolint: errcheck
	return exec.Command(TFSecExec, path, "--concise-output", "--no-color").CombinedOutput()
}
