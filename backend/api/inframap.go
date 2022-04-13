package api

import (
	"fmt"
	"os"
	"os/exec"
	"regexp"
)

var InfraMapExec = getEnv("INFRAMAP_EXEC", fmt.Sprintf("%s/inframap", BIN_PATH))

type InfraMapOpts struct {
	Png bool
}

func InfraMap(in []byte, opts InfraMapOpts) ([]byte, error) {
	path, err := asTempFile("", "", in)
	if err != nil {
		return nil, err
	}

	defer os.Remove(path) // nolint: errcheck

	args := []string{
		"generate",
		"--show-icons=true",
		"--connections=false",
		"--clean=false",
	}

	if !opts.Png {
		args = append(args, "--raw")
	}

	out, err := exec.Command(InfraMapExec, append(args, path)...).CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("inframap failed: %s", string(out))
	}

	if opts.Png {
		// InfraMap can return empty graphs under certain conditions (see
		// https://github.com/cycloidio/inframap#why-is-my-graph-generated-empty
		// for more information). Since we cannot currently anticipate ahead of
		// time which HCL/state files will trigger this, we will work around
		// this by falling back to using --raw, which will usually return a
		// graph, but will not have fancy icons and such.
		if emptyGraph.Match(out) {
			args = append(args, "--raw")
			out, err = exec.Command(InfraMapExec, append(args, path)...).CombinedOutput()
			if err != nil {
				return nil, fmt.Errorf("inframap failed: %s", string(out))
			}
		}

		// put the output into a temporary file
		graphPath, err := asTempFile("", "", out)
		if err != nil {
			return nil, fmt.Errorf("failed creating temp file for png generation: %w", err)
		}

		defer os.Remove(graphPath) // nolint: errcheck

		out, err = exec.Command("dot", "-Tpng", graphPath).Output()
		if err != nil {
			return nil, parseExitError(err, "dot failed")
		}
	}

	return out, nil
}

var emptyGraph = regexp.MustCompile(`^\s*strict digraph G {\s*}\s*$`)
