# validkube

[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org)
[![GitHub go.mod Go version of a Go module](https://img.shields.io/github/go-mod/go-version/gomods/athens.svg)](https://github.com/gomods/athens) [![Docker](https://badgen.net/badge/icon/docker?icon=docker&label)](https://https://docker.com/)

### About this project

Validkube combines the best open-source tools to help ensure Kubernetes YAML best practices, hygiene & security.

### Capabilities:

Policies - combination of security and best practices.

- **Validate** - Verify your Kubernetes configuration files @[kubeval](https://github.com/instrumenta/kubeval)
- **Clean** - Remove clutter from your Kubernetes manifests @[kubectl-neat](https://github.com/itaysk/kubectl-neat)
- **Secure (Trivy)** - Scan your YAML code for security vulnerabilities @[trivy](https://github.com/aquasecurity/trivy)
- **Audit (Polaris)** - Enforce best practices in your Kubernetes clusters @[polaris](https://github.com/FairwindsOps/polaris)

Validkube is an open-source site, so please feel free to add more tools or capabilities. :)

## Prerequisites

---

- AWS CLI with access to your AWS
- Yarn
- NPM
- Serverless CLI
- Golang v1.17

## Deploy

---

Full deploy:

```bash
    make deploy
```

Deploy backend:

```bash
    make deploy-backend
```

In order to update web domain:

```bash
    aws ssm put-parameter --name /validkube/config/allowed_origin --type String --value {frontend-domain} --overwrite
```

Deploy frontend:

```bash
    make deploy-frontend
```

## Local environment

---

In order to run this locally, specify 'ALLOWED_ORIGIN' environment variable to 'http://localhost:3000'

Example in Linux:

```bash
    export ALLOWED_ORIGIN=http://localhost:3000
```

In order to start backend:

```bash
    go mod download
    go run backend/development/localdev.go
```

In order to start frontend:

```bash
    cd frontend
    yarn install
    yarn start
```
