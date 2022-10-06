package kubeconform

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

const Path = "/kubeconform"
const Method = routing.POST

func kubeconformWrapper(inputYaml []byte) ([]byte, error) {
	if err := utils.CreateDirectory("/tmp/yaml"); err != nil {
		return nil, err
	}

	if err := utils.WriteFile("/tmp/yaml/target_yaml.yaml", inputYaml); err != nil {
		return nil, err
	}
	cmd := exec.Command("kubeconform", "-output", "json", "/tmp/yaml/target_yaml.yaml")
	stderr, err := cmd.StderrPipe()
	if err != nil {
		fmt.Println(stderr)
		return nil, fmt.Errorf("error in StderrPipe(), err: %s", err.Error())
	}
	outputFromKubeconformAsJson, err := cmd.Output()
	if err != nil {
		return nil, err
	}

	outputFromKubeconformAsYaml, err := yaml.JSONToYAML(outputFromKubeconformAsJson)
	if err != nil {
		return nil, err
	}
	return outputFromKubeconformAsYaml, nil
}

func ProcessRequest(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		fmt.Printf("error has with reading request body: %v", err)
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
		fmt.Printf("got error while parsing result from kubeconform: %s \n", err.Error())
		c.JSON(http.StatusOK, gin.H{"data": "", "err": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": string(KubeconformOutput), "err": nil})
}
