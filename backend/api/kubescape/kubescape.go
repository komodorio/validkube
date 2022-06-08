package kubescape

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gopkg.in/yaml.v2"

	"github.com/komodorio/validkube/backend/api/utils"
	"github.com/komodorio/validkube/backend/internal/routing"
)

const Path = "/kubescape"
const Method = routing.POST

func kubescapeWrapper(inputYaml []byte) ([]byte, error) {

	tmpDir := filepath.Join("/tmp", "yaml")
	err := utils.CreateDirectory(tmpDir)
	if err != nil {
		return nil, err
	}

	file, err := ioutil.TempFile(tmpDir, "target_*.yaml")
	if err != nil {
		return nil, err
	}
	defer os.Remove(file.Name())

	if _, err := file.Write(inputYaml); err != nil {
		return nil, err
	}

	outputFile := filepath.Join(tmpDir, fmt.Sprintf("%s.json", uuid.NewString()))
	exec.Command("kubescape", "scan", "framework", "AllControls", file.Name(), "-o", outputFile, "--format", "json", "--format-version", "v2").Output()
	defer os.Remove(outputFile)

	outputFromKubescapeAsJson, err := ioutil.ReadFile(outputFile)
	if err != nil {
		return nil, err
	}

	results := &KubescapeResults{}

	if err := json.Unmarshal(outputFromKubescapeAsJson, results); err != nil {
		return nil, err
	}

	yamlData, err := yaml.Marshal(resultsToDisplay(results))
	if err != nil {
		return nil, err
	}
	return yamlData, nil
}

// resultsToDisplay convert reults object to a display object
func resultsToDisplay(results *KubescapeResults) *Display {
	display := &Display{}

	for _, res := range results.Results {
		resourceID := strings.Split(res.ResourceID, "/")
		if len(resourceID) < 4 { // not supported
			continue
		}
		r := Resource{
			ApiVersion: resourceID[0],
			Kind:       resourceID[1],
			Namespace:  resourceID[2],
			Name:       resourceID[3],
		}

		r.ControlsSummary = listFailedControls(res.AssociatedControls)

		r.Summary = Summary{
			Failed: len(r.ControlsSummary),
			All:    len(res.AssociatedControls),
			Passed: len(res.AssociatedControls) - len(r.ControlsSummary),
		}
		display.Resources = append(display.Resources, r)
	}
	return display
}

// listFailedControls list the failed controls
func listFailedControls(controls []ResourceAssociatedControl) []Control {

	var failedControls []Control
	for _, c := range controls {
		control := Control{
			ControlName: c.Name,
			Docs:        fmt.Sprintf("https://hub.armo.cloud/docs/%s", strings.ToLower(c.ControlID)),
		}

		if !isFailed(c) {
			continue // controls passed, ignore results
		}

		for i := range c.ResourceAssociatedRules {
			if c.ResourceAssociatedRules[i].Status != "failed" {
				continue
			}
			for _, p := range c.ResourceAssociatedRules[i].Paths {
				if p.FailedPath != "" {
					control.Paths = append(control.Paths, p.FailedPath)
				}
				if p.FixCommand != "" {
					control.Paths = append(control.Paths, p.FixCommand)
				}
				if p.FixPath.Path != "" {
					control.Paths = append(control.Paths, fmt.Sprintf("%s=%s", p.FixPath.Path, p.FixPath.Value))
				}
			}

		}
		failedControls = append(failedControls, control)
	}
	return failedControls
}

// isFailed did the control fail
func isFailed(control ResourceAssociatedControl) bool {
	for i := range control.ResourceAssociatedRules {
		if control.ResourceAssociatedRules[i].Status == "failed" {
			return true
		}
	}
	return false
}

// ProcessRequest process kubescape request
func ProcessRequest(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Printf("Error has with reading request body: %v", err)
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	bodyAsMap, err := utils.JsonToMap(body)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	yamlAsInterface := bodyAsMap["yaml"]
	kubescapeOutput, err := kubescapeWrapper(utils.InterfaceToBytes(yamlAsInterface))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": string(kubescapeOutput), "err": nil})
}
