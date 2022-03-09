package api

import (
	"fmt"
	"os"
	"os/exec"
)

var InfraCostExec = ""

const InfraCostAPIKey = "infracost-api-key"

func InfraCost(in []byte) ([]byte, error) {
	path, err := asTempFile("", "", in)
	if err != nil {
		return nil, err
	}

	defer os.Remove(path) // nolint: errcheck

	cmd := exec.Command(InfraCostExec, "breakdown", "--path", path)
	cmd.Env = append(cmd.Env, fmt.Sprintf("INFRACOST_API_KEY=%s", InfraCostAPIKey))
	return cmd.CombinedOutput()
}
