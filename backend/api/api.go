package api

import (
	"fmt"
	"io/ioutil"
    "os"
)

type Tool string

const (
	ToolTFLint    Tool = "tflint"
	ToolTFSec     Tool = "tfsec"
	ToolInfracost Tool = "infracost"
	ToolInframap  Tool = "inframap"
)

type ToolFunc func(in []byte) (out []byte, err error)

func asTempFile(dir, ext string, in []byte) (path string, err error) {
	tmpfile, err := ioutil.TempFile(dir, fmt.Sprintf("validiac-*%s", ext))
	if err != nil {
		return "", fmt.Errorf("failed creating temp file: %w", err)
	}

	if _, err := tmpfile.Write(in); err != nil {
		return "", fmt.Errorf("failed writing content: %w", err)
	}
	if err := tmpfile.Close(); err != nil {
		return "", fmt.Errorf("failed closing tempfile: %w", err)
	}

	return tmpfile.Name(), nil
}

func asTempDir(ext string, in []byte) (path string, err error) {
	dir, err := ioutil.TempDir("", "validiac-*")
	if err != nil {
		return "", fmt.Errorf("failed creating temp dir: %w", err)
	}

	_, err = asTempFile(dir, ext, in)
	if err != nil {
		return "", err
	}

	return dir, nil
}

func getEnv(key, defaultValue string) string {
    value := os.Getenv(key)
    if len(value) == 0 {
        return defaultValue
    }
    return value
}
