package kubeconform

import (
	"io/ioutil"
	"net/http"
	"os/exec"

	"github.com/gin-gonic/gin"
	"github.com/komodorio/validkube/backend/api/utils"
	"github.com/komodorio/validkube/backend/internal/routing"
	"sigs.k8s.io/yaml"
)

const Path = "/kubeconform"
const Method = routing.POST

func kubeconformWrapper(inputYaml []byte) ([]byte, error) {
	if err := utils.CreateDirectory("/tmp/yaml"); err != nil {
		return nil, err
	}

	if err := utils.WriteFile("/tmp/yaml/target_yaml.yaml", inputYaml); err != nil {
		return nil, err
	}

	outputFromKubeconformAsJson, _ := exec.Command("kubeconform", "-output", "json", "/tmp/yaml/target_yaml.yaml").Output()
	// We don't wanna check error here because the default error code here is like the error from the kubeconform code
	outputFromKubeconformAsYaml, err := yaml.JSONToYAML(outputFromKubeconformAsJson)
	if err != nil {
		return nil, err
	}
	return outputFromKubeconformAsYaml, nil
}

func ProcessRequest(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	bodyAsMap, err := utils.JsonToMap(body)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	yamlAsInterface := bodyAsMap["yaml"]
	KubeconformOutput, err := kubeconformWrapper(utils.InterfaceToBytes(yamlAsInterface))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": string(KubeconformOutput), "err": nil})
}
