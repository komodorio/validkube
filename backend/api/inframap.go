package api

import (
	"os"
	"os/exec"
)

var InfraMapExec = ""

func InfraMap(in []byte) ([]byte, error) {
	path, err := asTempFile("", "", in)
	if err != nil {
		return nil, err
	}

	defer os.Remove(path) // nolint: errcheck

	return exec.Command(InfraMapExec, "generate", "--raw", "--show-icons=true", "--connections=false", "--clean=false", path).CombinedOutput()
}
