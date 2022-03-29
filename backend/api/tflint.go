package api

import (
    "fmt"
    "github.com/hashicorp/hcl2/hcl/hclsyntax"
    "github.com/hashicorp/hcl2/hclparse"
    "github.com/thoas/go-funk"
    "log"
    "os"
    "os/exec"
    "strings"
)

var TFLintExec = getEnv("TFLINT_EXEC", fmt.Sprintf("%s/tflint", BIN_PATH))
var TFLintConfig = getEnv("TFLINT_config", fmt.Sprintf("%s/.tflint.hcl", BIN_PATH))

func TFLint(in []byte) ([]byte, error) {
    path, err := asTempDir(".tf", in)
    if err != nil {
        return nil, err
    }

    defer os.RemoveAll(path)

	var hasAWS, hasAzure, hasGoogle = extractActiveProviders(in)

    var args = []string{}
    //Adding config args if one of the providers is enabled
    if hasAWS||hasAzure||hasGoogle{
        args = append(args, fmt.Sprintf("--config=%s", TFLintConfig))
    }

    if hasAWS{
        args = append(args, "--enable-plugin=aws")
    }

    if hasAzure{
        args = append(args, "--enable-plugin=azurerm")
    }

    if hasGoogle{
        args = append(args, "--enable-plugin=google")
    }

    args = append(args, path)
    args = append(args, "--no-color")
    args = append(args, "--force")
	return exec.Command(TFLintExec, args...).CombinedOutput()
}

func tflintInit() ([]byte, error) {
    var cmd = exec.Command(TFLintExec, "--init", "-c", TFLintConfig)
    return cmd.CombinedOutput()
}

func extractActiveProviders(hcl []byte) (bool, bool, bool) {
    parser := hclparse.NewParser()
    f, parseDiags := parser.ParseHCL(hcl, "")
    if parseDiags.HasErrors() {
        log.Fatal(parseDiags.Error())
    }

    var hasAWS = false
    var hasAzure = false
    var hasGoogle = false

    var blocks = funk.GetOrElse(funk.Get(f.Body, "Blocks"), hclsyntax.Blocks{}).(hclsyntax.Blocks)
    funk.ForEach(blocks, func(block *hclsyntax.Block) {
        if block.Type == "resource" && len(block.Labels) > 0 {
            if strings.HasPrefix(block.Labels[0], "aws") {
                hasAWS = true
            }

            if strings.HasPrefix(block.Labels[0], "azure") {
                hasAzure = true
            }

            if strings.HasPrefix(block.Labels[0], "google") {
                hasGoogle = true
            }
        }
    })

    return hasAWS, hasAzure, hasGoogle
}
