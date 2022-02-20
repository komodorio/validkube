package endpoints

import (
	"github.com/gin-gonic/gin"
	"github.com/komodorio/validkube/backend/api/hello"
	"github.com/komodorio/validkube/backend/api/kubeneat"
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
		Path:     trivy.Path,
		Method:   trivy.Method,
		Function: trivy.ProcessRequest,
	},
	{
		Path:     polaris.Path,
		Method:   polaris.Method,
		Function: polaris.ProcessRequest,
	},
}
