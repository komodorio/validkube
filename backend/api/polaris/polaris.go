package polaris

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os/exec"

	"github.com/gin-gonic/gin"
	"github.com/komodorio/validkube/backend/api/utils"
	"github.com/komodorio/validkube/backend/internal/routing"
	"sigs.k8s.io/yaml"
)

const Path = "/polaris"
const Method = routing.POST

func polarisWrapper(inputYaml []byte) ([]byte, error) {
	err := utils.CreateDirectory("/tmp/yaml")

	if err != nil {
		return nil, err
	}

	err = utils.WriteFile("/tmp/yaml/target_yaml.yaml", inputYaml)
	if err != nil {
		return nil, err
	}

	outputFromPolarisAsJson, _ := exec.Command("polaris", "audit", "--audit-path", "/tmp/yaml/target_yaml.yaml", "-f=json").Output()

	outputFromPolarisAsYaml, err := yaml.JSONToYAML(outputFromPolarisAsJson)
	if err != nil {
		return nil, err
	}
	return outputFromPolarisAsYaml, nil
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
	polarisOutput, err := polarisWrapper(utils.InterfaceToBytes(yamlAsInterface))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": string(polarisOutput), "err": nil})
}
