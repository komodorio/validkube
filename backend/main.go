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

type Request struct {
	HCL string `json:"hcl"`
}

func init() {
	router = lmdrouter.NewRouter("", corsMiddleware)
	router.Route("OPTIONS", "/(lint|secure|map|cost)", cors)
	router.Route("POST", "/lint", lint)
	router.Route("POST", "/secure", secure)
	router.Route("POST", "/map", graph)
	router.Route("POST", "/cost", cost)

	if _, ok := os.LookupEnv("AWS_LAMBDA_FUNCTION_NAME"); ok {
		isLambda = true
	}
}

func main() {
	if isLambda {
		// we are running in an AWS Lambda function
		lambda.Start(router.Handler)
	} else {
		// we are running from the command line
		var cli struct {
			Cmd  string `arg:"" optional:"" help:"Command to run (lint, secure, map, cost)"`
			Path string `arg:"" optional:"" help:"Path of file to run on"`
			Port int    `help:"Port to listen on if running as HTTP server" default:8080`
		}

		kong.Parse(&cli)

		if cli.Cmd == "" && cli.Path == "" {
			runLocalServer(cli.Port)
		} else {
			runCLI(cli.Cmd, cli.Path)
		}
	}
}

func runLocalServer(port int) {
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: router,
	}

	if err := srv.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("HTTP server failed: %s", err)
	}
}

func runCLI(cmdName, path string) {
	var cmd api.ToolFunc

	switch cmdName {
	case "lint":
		cmd = api.TFLint
	case "secure":
		cmd = api.TFSec
	case "map":
		cmd = api.InfraMap
	case "cost":
		cmd = api.InfraCost
	default:
		log.Fatalf("Invalid command %s", cmdName)
	}

	in, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("Failed reading %s: %s", path, err)
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

func lint(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	var input Request
	err = lmdrouter.UnmarshalRequest(req, true, &input)
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	out, err := api.TFLint([]byte(input.HCL))
	if err != nil {
		return handleToolError(out, err)
	}

	if len(out) == 0 {
		out = []byte("Success, your file is valid")
	}
	return parseOutput(http.StatusOK, out)
}

func cost(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	var input Request
	err = lmdrouter.UnmarshalRequest(req, true, &input)
	if err != nil {
		return lmdrouter.HandleError(err)
	}
	out, err := api.InfraCost([]byte(input.HCL))
	if err != nil {
		return handleToolError(out, err)
	}

	return parseOutput(http.StatusOK, out)
}

func secure(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	var input Request
	err = lmdrouter.UnmarshalRequest(req, true, &input)
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	out, err := api.TFSec([]byte(input.HCL))
	if err != nil {
		return handleToolError(out, err)
	}

	return parseOutput(http.StatusOK, out)
}

func graph(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	var input Request
	err = lmdrouter.UnmarshalRequest(req, true, &input)
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	out, err := api.InfraMap([]byte(input.HCL))
	if err != nil {
		return handleToolError(out, err)
	}

	return parseOutput(http.StatusOK, out)
}

func handleToolError(out []byte, err error) (
	events.APIGatewayProxyResponse,
	error,
) {
	if len(out) > 0 {
		return parseOutput(http.StatusBadRequest, out)
	}

	return lmdrouter.HandleError(err)
}

func parseOutput(status int, out []byte) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers: map[string]string{
			"Content-Type": "text/plain",
		},
		Body: string(out),
	}, nil
}

func cors(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Access-Control-Allow-Origin":      "*",
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Allow-Headers":     "*",
			"Allow":                            "POST, OPTIONS",
		},
	}, nil
}

func corsMiddleware(next lmdrouter.Handler) lmdrouter.Handler {
	return func(ctx context.Context, req events.APIGatewayProxyRequest) (
		res events.APIGatewayProxyResponse,
		err error,
	) {
		res, err = next(ctx, req)
		res.Headers["Access-Control-Allow-Origin"] = "*"
		res.Headers["Access-Control-Allow-Credentials"] = "true"
		res.Headers["Access-Control-Allow-Headers"] = "*"
		res.Headers["Allow"] = "POST, OPTIONS"
		return res, err
	}
}
