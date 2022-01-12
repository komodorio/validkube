package main_test

import (
	"log"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	main "github.com/komodorio/kubetools"
	"github.com/stretchr/testify/assert"
)

func TestHandler(t *testing.T) {
	tests := []struct {
		request events.APIGatewayProxyRequest
		expect  string
		err     error
	}{
		{
			// Test name has value
			request: events.APIGatewayProxyRequest{QueryStringParameters: map[string]string{"name": "Paul"}},
			expect:  "Hello Paul!",
			err:     nil,
		},
		{
			// Test name is null
			request: events.APIGatewayProxyRequest{},
			expect:  "Hello !",
			err:     nil,
		},
	}

	for i, test := range tests {
		response, err := main.Handler(test.request)
		assert.IsType(t, test.err, err)
		assert.Equal(t, test.expect, response.Body)
		log.Printf("Test %d: %s", i, response.Body)
	}
}
