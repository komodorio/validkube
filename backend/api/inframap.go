package api

import (
	"fmt"
	"io"
	"os"
	"os/exec"
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
		"--raw",
	}

	cmd := exec.Command(InfraMapExec, append(args, path)...)

	if opts.Png {
		// get a pipe of stdout, we're going to pipe output to dot (from graphviz)
		stdout, err := cmd.StdoutPipe()
		if err != nil {
			return nil, fmt.Errorf("failed getting stdout pipe of inframap: %w", err)
		}

		if err = cmd.Start(); err != nil {
			return nil, fmt.Errorf("failed starting inframap: %w", err)
		}

		dot := exec.Command("dot", "-Tpng")
		stdin, err := dot.StdinPipe()
		if err != nil {
			return nil, fmt.Errorf("failed getting stdin pipe for dot: %w", err)
		}

		var pipeErr error

		go func() {
			defer stdin.Close()

			// copy from inframap's stdout to dot's stdin
			r := io.TeeReader(stdout, stdin)
			if _, err := io.ReadAll(r); err != nil {
				pipeErr = fmt.Errorf("failed reading from inframap: %w", err)
				return
			}

			// wait for inframap to exit
			if err = cmd.Wait(); err != nil {
				pipeErr = fmt.Errorf("inframap failed: %w", err)
				return
			}
		}()

		out, err := dot.CombinedOutput()
		if err != nil {
			return nil, fmt.Errorf("dot failed: %w", err)
		}

		if pipeErr != nil {
			return nil, pipeErr
		}

		return out, nil
	}

	return cmd.CombinedOutput()
}
