package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func AntherHandler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "Hello World!",
	}, nil
}

func Handler(request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	name := request.QueryStringParameters["name"]
	response := fmt.Sprintf("Hello %s!", name)

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "text/html; charset=UTF-8"},
		Body:       response,
	}, nil
}

func main() {
	// Initiate AWS Lambda handler
	lambda.Start(Handler)
	lambda.Start(AntherHandler)
}
