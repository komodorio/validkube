package main

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/komodorio/validkube/backend/endpoints"
	"github.com/komodorio/validkube/backend/internal/routing"
)

func main() {
	engine := routing.Build()

	for _, e := range endpoints.Endpoints {
		routing.AddRoute(engine, e.Path, e.Method, e.Function)
	}

	proxy := func(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		adapter := ginadapter.New(engine)
		return adapter.Proxy(req)
	}

	lambda.Start(proxy)
}
