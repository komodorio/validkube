package api

import (
    "fmt"
    "os"
    "os/exec"
)

var TFLintExec = getEnv("TFLINT_EXEC", fmt.Sprintf("%s/tflint", BIN_PATH))
var TFLintConfig = getEnv("TFLINT_config", fmt.Sprintf("%s/.tflint.hcl", BIN_PATH))

func tflintInit() ([]byte, error){
    var cmd = exec.Command(TFLintExec, "--init", "-c", TFLintConfig)
    return cmd.CombinedOutput()
}

func TFLint(in []byte) ([]byte, error) {
	path, err := asTempFile("", ".tf", in)
	if err != nil {
		return nil, err
	}

	defer os.Remove(path) // nolint: errcheck
    return exec.Command(TFLintExec, fmt.Sprintf("--config=%s", TFLintConfig), "--enable-plugin=aws", "--enable-plugin=azurerm", "--enable-plugin=google", path, "--no-color").CombinedOutput()
}
