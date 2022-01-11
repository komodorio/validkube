package kubeneat

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/itaysk/kubectl-neat/cmd"
	"github.com/komodorio/validkube/backend/api/utils"
	"github.com/komodorio/validkube/backend/internal/routing"
	"sigs.k8s.io/yaml"
)

const Path = "/kubeneat"
const Method = routing.POST

func NeatYAMLOrJSONWrapper(in []byte) (out []byte, errrDescription string, err error) {
	var injson, outjson string

	itsYaml := !bytes.HasPrefix(bytes.TrimLeftFunc(in, unicode.IsSpace), []byte{'{'})
	if itsYaml {
		injsonbytes, err := yaml.YAMLToJSON(in)
		if err != nil {
			return nil, "error converting from yaml to json", err
		}
		injson = string(injsonbytes)
	} else {
		injson = string(in)
	}

	outjson, err = cmd.Neat(injson)
	if err != nil {
		return nil, "error neating", err
	}

	if itsYaml {
		out, err = yaml.JSONToYAML([]byte(outjson))
		if err != nil {
			return nil, "error converting from json to ymls", err
		}
	} else {
		out = []byte(outjson)
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
