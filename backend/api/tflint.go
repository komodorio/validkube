package api

import (
    "os"
    "os/exec"
)

var TFLintExec = ""
const TFLINT_CONFIG_FILE = ".tflint.hcl"
func TFLint(in []byte) ([]byte, error) {
	path, err := asTempFile("", ".tf", in)
	if err != nil {
		return nil, err
	}

	defer os.Remove(path) // nolint: errcheck
	//return exec.Command(TFLintExec, fmt.Sprintf("-c %s", TFLINT_CONFIG_FILE), "--enable-plugin=aws", "--enable-plugin=google", "--enable-plugin=azurerm", path, "--no-color").CombinedOutput()
    return exec.Command(TFLintExec, "--enable-plugin=aws", "--enable-plugin=google", "--enable-plugin=azurerm", path, "--no-color").CombinedOutput()
}
