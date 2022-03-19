package api

import (
    "fmt"
    "os"
    "os/exec"
)

var InfraMapExec = getEnv("INFRAMAP_EXEC",  fmt.Sprintf("%s/inframap", BIN_PATH))

func InfraMap(in []byte) ([]byte, error) {
	path, err := asTempFile("", "", in)
	if err != nil {
		return nil, err
	}

	defer os.Remove(path) // nolint: errcheck

	return exec.Command(InfraMapExec, "generate", "--raw", "--show-icons=true", "--connections=false", "--clean=false", path).CombinedOutput()
}
