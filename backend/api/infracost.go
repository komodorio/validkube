package api

import (
    "fmt"
    "github.com/thoas/go-funk"
    "os"
    "os/exec"
)

var InfraCostExec = ""

func InfraCost(in []byte) ([]byte, error) {
    var infraCostApiKey = funk.GetOrElse(os.Getenv("INFRACOST_API_KEY"), "infracost-api-key")
	path, err := asTempDir(".tf", in)
	if err != nil {
		return nil, err
	}

	defer os.Remove(path) // nolint: errcheck

	cmd := exec.Command(InfraCostExec, "breakdown", "--path", path, "--terraform-parse-hcl", "--no-color")
	cmd.Env = append(cmd.Env, fmt.Sprintf("INFRACOST_API_KEY=%s", infraCostApiKey))
	return cmd.CombinedOutput()
}
