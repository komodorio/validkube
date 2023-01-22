# validkube

[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org)
[![GitHub go.mod Go version of a Go module](https://img.shields.io/github/go-mod/go-version/gomods/athens.svg)](https://github.com/gomods/athens) [![Docker](https://badgen.net/badge/icon/docker?icon=docker&label)](https://https://docker.com/)

## About this project

Validkube combines the best open-source tools to help ensure Kubernetes YAML best practices, hygiene & security.

### Open - Source Contribution

* If you want to contribute, this repository is in build, so feel at home :)

If you like ValidKube, share with your friends and be sure to ⭐ it!

Please read [`contributing guidelines`](/contributing.md) before submitting new Resources.

### Capabilities:

Policies - A combination of security and best practices.

- **Validate** - Verify your Kubernetes configuration files @[kubeconform](https://github.com/yannh/kubeconform)
- **Clean** - Remove clutter from your Kubernetes manifests @[kubectl-neat](https://github.com/itaysk/kubectl-neat)
- **Secure (Trivy)** - Scan your YAML code for security vulnerabilities @[trivy](https://github.com/aquasecurity/trivy)
- **Secure (Kubescape)** - Scan your YAML file for Devops best practices and security vulnerabilities @[kubescape](https://github.com/armosec/kubescape)
- **Audit (Polaris)** - Enforce best practices in your Kubernetes clusters @[polaris](https://github.com/FairwindsOps/polaris)

Validkube is an open-source project, so please feel free to add more tools or capabilities. :)

## Prerequisites

---

### OS tools:
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) with access to your [AWS Console](https://console.aws.amazon.com/)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Serverless CLI](https://www.serverless.com/framework/docs/getting-started/)
- [Golang](https://go.dev/doc/install) >v1.17
- [Netlify-cli](https://docs.netlify.com/cli/get-started/)
### K8s CLI tools:
  - [kubescape](https://github.com/kubescape/kubescape#install-on-windows)
  - [trivy](https://aquasecurity.github.io/trivy/latest/getting-started/installation/)
  - [polaris](https://polaris.docs.fairwinds.com/infrastructure-as-code/#install-the-cli)
  - [kubeconform](https://github.com/yannh/kubeconform#installation)

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

## Local Environment

---

To run locally, set **`ALLOWED_ORIGIN`** environment variable to **`http://localhost:3000`**

Example in Linux:

```bash
export ALLOWED_ORIGIN='http://localhost:3000'
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
