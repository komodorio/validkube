package endpoints

import (
	"github.com/gin-gonic/gin"
	"github.com/komodorio/validkube/backend/api/hello"
	"github.com/komodorio/validkube/backend/api/kubeconform"
	"github.com/komodorio/validkube/backend/api/kubeneat"
	"github.com/komodorio/validkube/backend/api/kubescape"
	"github.com/komodorio/validkube/backend/api/kubeval"
	"github.com/komodorio/validkube/backend/api/polaris"
	"github.com/komodorio/validkube/backend/api/trivy"
)

type Endpoint struct {
	Path     string
	Method   string
	Function gin.HandlerFunc
}

var Endpoints = []Endpoint{
	{
		Path:     hello.Path,
		Method:   hello.Method,
		Function: hello.ProcessRequest,
	},
	{
		Path:     kubeneat.Path,
		Method:   kubeneat.Method,
		Function: kubeneat.ProcessRequest,
	},
	{
		Path:     kubeval.Path,
		Method:   kubeval.Method,
		Function: kubeval.ProcessRequest,
	},
	{
		Path:     trivy.PathConfig,
		Method:   trivy.Method,
		Function: trivy.ProcessRequestConfig,
	},
	{
		Path:     trivy.PathVulnerability,
		Method:   trivy.Method,
		Function: trivy.ProcessRequestVulnerability,
	},
	{
		Path:     trivy.PathSBOM,
		Method:   trivy.Method,
		Function: trivy.ProcessRequestSBOM,
	},
	{
		Path:     polaris.Path,
		Method:   polaris.Method,
		Function: polaris.ProcessRequest,
	},
	{
		Path:     kubescape.Path,
		Method:   kubescape.Method,
		Function: kubescape.ProcessRequest,
	},
	{
		Path:     kubeconform.Path,
		Method:   kubeconform.Method,
		Function: kubeconform.ProcessRequest,
	},
}
