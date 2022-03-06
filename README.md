# validiac

### About this project

ValidIaC combines the best open-source tools to help ensure Terraform best
practices, hygiene & security.

### Capabilities:

- **Lint** - Lint your Terraform HCL files with [tflint](https://github.com/terraform-linters/tflint)
- **Secure** - Scan your Terraform templates for security vulnerabilities with [tfsec](https://github.com/aquasecurity/tfsec)
- **Cost** - Get a breakdown of your cloud costs with [infracost](https://github.com/infracost/infracost)
- **Map** - Chart a map of your cloud infrastructure with [inframap](https://github.com/cycloidio/inframap)

ValidIaC is an open-source solution, so please feel free to add more capabilities or tools :)

A free online instance of ValidIaC is available for anyone to use at https://www.validiac.com.
The program can both be deployed as an AWS Lambda function, or be used directly
from the command line.

## Prerequisites

---

- AWS CLI with access to your AWS
- Yarn
- NPM
- Serverless CLI
- Golang v1.17

## CLI/Local Server Usage

The `validiac` binary can be used in three different ways:

1. As a CLI utility.
2. As an HTTP server.
3. As an AWS Lambda handler.

To compile the binary:

1. Download dependencies with `make deps`
2. Build validiac with `make build`
3. Run validiac: `bin/validiac --help`

Other make tasks:
- run unit tests: `make test`
- run static code analysis: `make lint` (requires [golangci-lint](https://golangci-lint.run/))
- clean validiac binary: `make clean`
- clean all binaries, including dependencies: `make clean-all`

## Upgrading Dependency Versions

The versions used for the four base tools are defined in the [Makefile](Makefile).
Simply change the version number of the relevant tool and rebuild (the validiac
binary will need to be rebuilt as well).
