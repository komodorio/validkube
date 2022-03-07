package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/alecthomas/kong"
	"github.com/aquasecurity/lmdrouter"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/gofireflyio/validiac/backend/api"
)

var router *lmdrouter.Router
var isLambda bool

func init() {
	if _, ok := os.LookupEnv("AWS_LAMBDA_FUNCTION_NAME"); ok {
		isLambda = true
		router = lmdrouter.NewRouter("/")
		router.Route("POST", "/lint", lint)
		router.Route("POST", "/secure", secure)
		router.Route("POST", "/map", graph)
		router.Route("POST", "/cost", cost)
	}
}

func main() {
	if isLambda {
		// we are running in an AWS Lambda function
		lambda.Start(router.Handler)
	} else {
		// we are running from the command line
		var cli struct {
			Cmd  string `arg:"" required:"" help:"Command to run (lint, secure, map, cost)"`
			Path string `arg:"" required:"" help:"Path of file to run on"`
		}

		kong.Parse(&cli)

		var cmd api.ToolFunc

		switch cli.Cmd {
		case "lint":
			cmd = api.TFLint
		case "secure":
			cmd = api.TFSec
		case "map":
			cmd = api.InfraMap
		case "cost":
			cmd = api.InfraCost
		default:
			log.Fatalf("Invalid command %s", cli.Cmd)
		}

		in, err := os.ReadFile(cli.Path)
		if err != nil {
			log.Fatalf("Failed reading %s: %s", cli.Path, err)
		}

		out, err := cmd(in)

		if err != nil {
			fmt.Fprintf(os.Stderr, "Fatal error: %s\n", err)
			if len(out) > 0 {
				os.Stderr.Write(out)
			}
			os.Exit(1)
		} else {
			os.Stdout.Write(out)
		}
	}
}

func lint(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	out, err := api.TFLint([]byte(req.Body))
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	return lmdrouter.MarshalResponse(http.StatusOK, nil, out)
}

func cost(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	out, err := api.InfraCost([]byte(req.Body))
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	return lmdrouter.MarshalResponse(http.StatusOK, nil, out)
}

func secure(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	out, err := api.TFSec([]byte(req.Body))
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	return lmdrouter.MarshalResponse(http.StatusOK, nil, out)
}

func graph(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	out, err := api.InfraMap([]byte(req.Body))
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	return lmdrouter.MarshalResponse(http.StatusOK, nil, out)
}
