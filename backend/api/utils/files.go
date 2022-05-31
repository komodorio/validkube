package utils

import (
	"os"
)

func WriteFile(path string, data []byte) error {
	file, err := os.Create(path)
	if err != nil {
		return err
	} else {
		file.WriteString(string(data))
	}
	file.Close()
	return nil
}

func CreateDirectory(path string) error {
	_, err := RunCommand("mkdir", "-p", path)
	if err != nil {
		return err
	}
	return nil
}
