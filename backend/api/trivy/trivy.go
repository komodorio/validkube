package trivy

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/komodorio/validkube/backend/api/utils"
	"github.com/komodorio/validkube/backend/internal/routing"
	"sigs.k8s.io/yaml"
)

type ScanAction string

const (
	PathConfig                     = "/trivy/config"
	PathVulnerability              = "/trivy/vulnerability"
	PathSBOM                       = "/trivy/sbom"
	Method                         = routing.POST
	ConfigAction        ScanAction = "config"
	VulnerabilityAction ScanAction = "vulnerability"
	SBOMAction          ScanAction = "sbom"
)

func trivyWrapper(inputYaml []byte, action ScanAction) ([]byte, error) {
	tmp, err := os.MkdirTemp(os.TempDir(), "trivy*")
	if err != nil {
		return nil, err
	}
	defer os.RemoveAll(tmp)
	var outputFromTrivy []byte
	switch action {
	case ConfigAction:
		file, err := os.Create(fmt.Sprintf("%s/target_yaml.yaml", tmp))
		if err != nil {
			return nil, err
		} else {
			file.WriteString(string(inputYaml))
		}
		file.Close()
		_, err = utils.RunCommand("trivy", "config", "-f", "json", "-o", fmt.Sprintf("%s/out.json", tmp), tmp)
		if err != nil {
			return nil, err
		}
		outputFromTrivy, err = os.ReadFile(fmt.Sprintf("%s/out.json", tmp))
		if err != nil {
			return nil, err
		}
	case VulnerabilityAction:
		regex := regexp.MustCompile(`image: (.*)`)
		result := regex.FindAllStringSubmatch(string(inputYaml), -1)
		jsonArray := "["
		for _, image := range result {
			_, err = utils.RunCommand("trivy", "image", "-f", "json", "--ignore-unfixed", "-o", fmt.Sprintf("%s/out.json", tmp), image[1])
			if err != nil {
				return nil, err
			}
			output, err := os.ReadFile(fmt.Sprintf("%s/out.json", tmp))
			if err != nil {
				return nil, err
			}
			jsonArray += string(output)
			if len(result) > 1 {
				jsonArray += ","
			}
		}
		jsonArray += "]"
		outputFromTrivy = []byte(jsonArray)
	case SBOMAction:
		regex := regexp.MustCompile(`image: (.*)`)
		result := regex.FindAllStringSubmatch(string(inputYaml), -1)
		jsonArray := "["
		for _, image := range result {
			_, err = utils.RunCommand("trivy", "image", "--format", "cyclonedx", "-o", fmt.Sprintf("%s/out.json", tmp), image[1])
			if err != nil {
				return nil, err
			}
			output, err := os.ReadFile(fmt.Sprintf("%s/out.json", tmp))
			if err != nil {
				return nil, err
			}
			jsonArray += string(output)
			if len(result) > 1 {
				jsonArray += ","
			}
		}
		jsonArray += "]"
		outputFromTrivy = []byte(jsonArray)
	}

	outputAsYaml, err := yaml.JSONToYAML(outputFromTrivy)
	if err != nil {
		return nil, err
	}

	return outputAsYaml, nil
}

func ProcessRequestVulnerability(c *gin.Context) {
	processTrivyRequest(c, VulnerabilityAction)
}

func ProcessRequestConfig(c *gin.Context) {
	processTrivyRequest(c, ConfigAction)
}

func ProcessRequestSBOM(c *gin.Context) {
	processTrivyRequest(c, SBOMAction)
}

func processTrivyRequest(c *gin.Context, action ScanAction) {
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
	kubevalOutput, err := trivyWrapper(utils.InterfaceToBytes(yamlAsInterface), action)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": string(kubevalOutput), "err": nil})
}
