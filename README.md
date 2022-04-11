# validiac

**ValidIaC combines the best open-source tools to help ensure Terraform best
practices, hygiene & security.**

## Contents

<!-- vim-markdown-toc GFM -->

* [Capabilities](#capabilities)
* [Usage](#usage)
    * [CLI Usage](#cli-usage)
    * [HTTP Server Usage](#http-server-usage)
    * [AWS Lambda Usage](#aws-lambda-usage)
* [Development](#development)
    * [Upgrading Dependency Versions](#upgrading-dependency-versions)

<!-- vim-markdown-toc -->

## Capabilities

- **Lint** - Lint your Terraform HCL files with [tflint](https://github.com/terraform-linters/tflint)
- **Secure** - Scan your Terraform templates for security vulnerabilities with [tfsec](https://github.com/aquasecurity/tfsec)
- **Cost** - Get a breakdown of your cloud costs with [infracost](https://github.com/infracost/infracost)
- **Map** - Chart a map of your cloud infrastructure with [inframap](https://github.com/cycloidio/inframap)

ValidIaC is an open-source solution, so please feel free to add more capabilities or tools :)

A free online instance of ValidIaC is available for anyone to use at https://www.validiac.com.
The program can both be deployed as an AWS Lambda function, or be used directly
from the command line.

## Usage

The `validiac` binary can be used in three different ways:

1. As a CLI utility.
2. As an HTTP server.
3. As an AWS Lambda handler.

To compile the binary:

1. Install [Graphviz](https://graphviz.org/download/#executable-packages) via your package manager.
2. Download static dependencies with `make deps`
3. Build validiac with `make build`

### CLI Usage

Run `bin/validiac --help` for complete usage instructions. Example: `bin/validiac --png plan.tf > plan.png`

### HTTP Server Usage

Simply execute `bin/validiac` without any arguments. By default, the server will
listen on all addresses at port 8080. Supply a different port with `--port`.

### AWS Lambda Usage

Build the Docker image with `make docker` and deploy to a Lambda environment.

## Development

- Download static dependencies with `make deps`
- Run unit tests with `make test`
- Run static code analysis with `make lint` (requires [golangci-lint](https://golangci-lint.run/))
- Remove validiac binary with `make clean`
- Remove all binaries (including static dependencies) with `make clean-all`

### Upgrading Dependency Versions

The versions used for the four base tools are defined in the [Makefile](Makefile).
Simply change the version number of the relevant tool and rebuild (the validiac
binary will need to be rebuilt as well).
