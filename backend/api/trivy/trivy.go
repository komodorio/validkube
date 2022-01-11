package trivy

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/komodorio/validkube/backend/api/utils"
	"github.com/komodorio/validkube/backend/internal/routing"
	"sigs.k8s.io/yaml"
)

const Path = "/trivy"
const Method = routing.POST

func trivyWrapper(inputYaml []byte) ([]byte, error) {
	_, err := utils.RunCommand("mkdir", "-p", "/tmp/yaml")
	if err != nil {
		return nil, err
	}

	file, err := os.Create("/tmp/yaml/target_yaml.yaml")
	if err != nil {
		return nil, err
	} else {
		file.WriteString(string(inputYaml))
	}
	file.Close()

	outputFromTrivy, err := utils.RunCommand("trivy", "config", "-f", "json", "/tmp/yaml")
	if err != nil {
		return nil, err
	}

	jsonStartIndex := strings.Index(string(outputFromTrivy), "{")
	outputAsJson := string(outputFromTrivy)[jsonStartIndex:]

	outputAsYaml, err := yaml.JSONToYAML([]byte(outputAsJson))
	if err != nil {
		return nil, err
	}

	return outputAsYaml, nil
}

func ProcessRequest(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Printf("Erorr has with reading request body: %v", err)
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	bodyAsMap, err := utils.JsonToMap(body)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	yamlAsInterface := bodyAsMap["yaml"]
	kubevalOutput, err := trivyWrapper(utils.InterfaceToBytes(yamlAsInterface))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": string(kubevalOutput), "err": nil})
}
