package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/alecthomas/kong"
	"github.com/aquasecurity/lmdrouter"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/gabriel-vasile/mimetype"
	"github.com/gofireflyio/validiac/backend/api"
)

var router *lmdrouter.Router
var isLambda bool
var isDebug bool

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

	if _, ok := os.LookupEnv("IS_DEBUG"); ok {
		isDebug = true
	}
}

type cliOpts struct {
	Lint struct {
		Path string `arg:"" help:"Path of file to run on"`
	} `cmd help:"Lint using tflint"`
	Secure struct {
		Path string `arg:"" help:"Path of file to run on"`
	} `cmd help:"Check for security issues using tfsec"`
	Map struct {
		Path string `arg:"" help:"Path of file to run on"`
		Png  bool   `help:"Generate a png representation (writes to stdout)"`
	} `cmd help:"Generate a graph using inframap"`
	Cost struct {
		Path string `arg:"" help:"Path of file to run on"`
	} `cmd help:"Calculate cloud costs using infracost"`
	Server struct {
		Port int `help:"Port to listen on" default:8080`
	} `cmd default:"1" help:"Run as an HTTP server"`
}

func main() {
	if isLambda {
		// we are running in an AWS Lambda function
		lambda.Start(router.Handler)
	} else {
		// we are running from the command line

		var _, err = api.Init()
		if err != nil {
			fmt.Fprintf(os.Stderr, "failed initializing binaries: %s\n", err)
		}

		var cli cliOpts

		ctx := kong.Parse(&cli)

		if ctx.Command() == "server" {
			runLocalServer(cli.Server.Port)
		} else {
			runCLI(ctx, cli)
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

func runCLI(ctx *kong.Context, cli cliOpts) {
	var out []byte
	var err error

	switch ctx.Command() {
	case "lint <path>":
		in, err := os.ReadFile(cli.Lint.Path)
		if err != nil {
			log.Fatalf("Failed reading %s: %s", cli.Lint.Path, err)
		}

		out, err = api.TFLint(in)
	case "secure <path>":
		in, err := os.ReadFile(cli.Secure.Path)
		if err != nil {
			log.Fatalf("Failed reading %s: %s", cli.Secure.Path, err)
		}

		out, err = api.TFSec(in)
	case "map <path>":
		in, err := os.ReadFile(cli.Map.Path)
		if err != nil {
			log.Fatalf("Failed reading %s: %s", cli.Map.Path, err)
		}

		out, err = api.InfraMap(in, api.InfraMapOpts{
			Png: cli.Map.Png,
		})
	case "cost <path>":
		in, err := os.ReadFile(cli.Cost.Path)
		if err != nil {
			log.Fatalf("Failed reading %s: %s", cli.Cost.Path, err)
		}

		out, err = api.InfraCost(in)
	default:
		log.Fatalf("Invalid command %s", ctx.Command())
	}

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
	if isDebug {
		log.Printf(req.Body)
	}

	var input Request
	err = lmdrouter.UnmarshalRequest(req, true, &input)
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	out, err := api.TFLint([]byte(input.HCL))
	if err != nil {
		if err != nil {
			if exitError, ok := err.(*exec.ExitError); ok && exitError.Stderr == nil {
				// TfLint exits while detecting lint error
				// In this case we prefer to return status OK and return the result
				return parseOutput(http.StatusOK, out)
			}
			return handleToolError(out, err)
		}
		return handleToolError(out, err)
	}

	if len(out) == 0 {
		out = []byte("Success, your IaC is valid!")
	}
	return parseOutput(http.StatusOK, out)
}

func cost(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	if isDebug {
		log.Printf(req.Body)
	}

	var input Request
	err = lmdrouter.UnmarshalRequest(req, true, &input)
	if err != nil {
		return lmdrouter.HandleError(err)
	}
	out, err := api.InfraCost([]byte(input.HCL))
	if err != nil {
		return handleToolError(out, err)
	}

	//Trimming empty lines
	var outputTxt = strings.Trim(string(out), "\n")
	//Removing the first line
	outputTxt = strings.Join(strings.Split(outputTxt, "\n")[1:], "\n")
	//Trimming empty lines
	outputTxt = strings.Trim(outputTxt, "\n")
	return parseOutput(http.StatusOK, []byte(outputTxt))
}

func secure(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	if isDebug {
		log.Printf(req.Body)
	}

	var input Request
	err = lmdrouter.UnmarshalRequest(req, true, &input)
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	out, err := api.TFSec([]byte(input.HCL))
	if err != nil {
		if exitError, ok := err.(*exec.ExitError); ok && exitError.Stderr == nil {
			// TfSec exits while detecting security vulnerabilities
			// In this case we prefer to return status OK and return the TfSec result
			return parseOutput(http.StatusOK, out)
		}
		return handleToolError(out, err)
	}

	return parseOutput(http.StatusOK, out)
}

type InfraMapRequest struct {
	Png bool `json:"png"`
	*Request
}

func graph(ctx context.Context, req events.APIGatewayProxyRequest) (
	res events.APIGatewayProxyResponse,
	err error,
) {
	if isDebug {
		log.Printf(req.Body)
	}

	var input InfraMapRequest
	err = lmdrouter.UnmarshalRequest(req, true, &input)
	if err != nil {
		return lmdrouter.HandleError(err)
	}

	out, err := api.InfraMap([]byte(input.HCL), api.InfraMapOpts{
		Png: input.Png,
	})
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
	mtype := mimetype.Detect(out)

	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers: map[string]string{
			"Content-Type": mtype.String(),
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
