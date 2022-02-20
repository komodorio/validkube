package kubeneat

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/itaysk/kubectl-neat/cmd"
	"github.com/komodorio/validkube/backend/api/utils"
	"github.com/komodorio/validkube/backend/internal/routing"
	"sigs.k8s.io/yaml"
)

const (
	Path          = "/kubeneat"
	Method        = routing.POST
	yamlSeperator = "---"
)

func neatify(in []byte) (*string, error) {
	injson := string(in)
	outjson, err := cmd.Neat(injson)
	if err != nil {
		return nil, err
	}
	return &outjson, nil
}

func NeatYAMLOrJSONWrapper(in []byte) (out []byte, errrDescription string, err error) {
	itsYaml := !bytes.HasPrefix(bytes.TrimLeftFunc(in, unicode.IsSpace), []byte{'{'})
	if itsYaml {
		var manifests []string
		if strings.Contains(string(in), yamlSeperator) {
			manifests = strings.Split(string(in), yamlSeperator)
		} else {
			manifests = append(manifests, string(in))
		}
		var multiResourceFile string
		for _, manifest := range manifests {
			if strings.TrimSpace(manifest) != "" {
				manifestsBytes, err := yaml.YAMLToJSON([]byte(manifest))
				if err != nil {
					return nil, "error converting from yaml to json", err
				}
				neatManifestJson, err := neatify(manifestsBytes)
				if err != nil {
					return nil, "error neating", err
				}
				neatManifestYaml, err := yaml.JSONToYAML([]byte(*neatManifestJson))
				if err != nil {
					return nil, "error converting from yaml to yaml", err
				}
				if len(manifests) > 1 {
					multiResourceFile += fmt.Sprintf("%s\n%s", yamlSeperator, neatManifestYaml)
				} else {
					multiResourceFile = string(neatManifestYaml)
				}
			}
		}
		out = []byte(multiResourceFile)
	} else {
		inJson := string(in)
		outJson, err := cmd.Neat(inJson)
		if err != nil {
			return nil, "error neating", err
		}
		out = []byte(outJson)
	}
	return out, "", nil
}

func ProcessRequest(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		errDescription := fmt.Sprintf("Erorr has with reading request body: %v", err.Error())
		c.JSON(http.StatusPartialContent, gin.H{"data": "", "err": errDescription})
		return
	}
	bodyAsMap, err := utils.JsonToMap(body)
	if err != nil {
		c.JSON(http.StatusPartialContent, gin.H{"data": "", "err": err.Error()})
		return
	}
	yamlAsInterface := bodyAsMap["yaml"]
	neatYaml, errDescription, err := NeatYAMLOrJSONWrapper(utils.InterfaceToBytes(yamlAsInterface))
	if err != nil {
		fullError := fmt.Sprintf("%v: %v", errDescription, err.Error())
		c.JSON(http.StatusOK, gin.H{"data": "", "err": fullError})
	}
	c.JSON(http.StatusOK, gin.H{"data": string(neatYaml), "err": nil})
}
