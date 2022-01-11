package utils

import (
	"os/exec"
)

func RunCommand(cmd string, args ...string) ([]byte, error) {
	c := exec.Command(cmd, args...)
	res, err := c.Output()
	if err != nil {
		e, ok := err.(*exec.ExitError)
		if ok {
			return e.Stderr, nil
		}
		return nil, err
	}
	return res, nil
}
