package api

import (
	"fmt"
	"os"
	"os/exec"
	"strings"

	"github.com/hashicorp/hcl2/hcl/hclsyntax"
	"github.com/hashicorp/hcl2/hclparse"
	"github.com/thoas/go-funk"
)

var TFLintExec = getEnv("TFLINT_EXEC", fmt.Sprintf("%s/tflint", BIN_PATH))
var TFLintConfig = getEnv("TFLINT_config", fmt.Sprintf("%s/.tflint.hcl", BIN_PATH))

func TFLint(in []byte) ([]byte, error) {
	path, err := asTempDir(".tf", in)
	if err != nil {
		return nil, err
	}

	defer os.RemoveAll(path)

	err, hasAWS, hasAzure, hasGoogle := extractActiveProviders(in)
    if err != nil{
        return nil, err
    }

	var args = []string{}
	//Adding config args if one of the providers is enabled
	if hasAWS || hasAzure || hasGoogle {
		args = append(args, fmt.Sprintf("--config=%s", TFLintConfig))
	}

	if hasAWS {
		args = append(args, "--enable-plugin=aws")
	}

	if hasAzure {
		args = append(args, "--enable-plugin=azurerm")
	}

	if hasGoogle {
		args = append(args, "--enable-plugin=google")
	}

	args = append(args, path)
	args = append(args, "--no-color")
	args = append(args, "--force")
	return exec.Command(TFLintExec, args...).CombinedOutput()
}

func tflintInit() ([]byte, error) {
	return exec.Command(TFLintExec, "--init", "-c", TFLintConfig).CombinedOutput()
}

func extractActiveProviders(hcl []byte) (error, bool, bool, bool) {
    parser := hclparse.NewParser()
    f, parseDiags := parser.ParseHCL(hcl, "")
    if parseDiags.HasErrors() {
        return fmt.Errorf("failed creating temp file: %s", parseDiags.Error()), false, false, false
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

    return nil ,hasAWS, hasAzure, hasGoogle
}
