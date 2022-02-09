# validkube

## About this project

Validkube combines the best open-source tools to help ensure Kubernetes YAML best practices, hygiene & security.

---

### Prerequisites

- AWS CLI with access to your AWS
- Yarn
- NPM
- Serverless CLI

---

### Deploy backend serverless

```bash
    make deploy
```

In order to update web domain:

```bash
    aws ssm put-parameter --name /validkube/config/allowed_origin --type String --value {frontend-domain} --overwrite
```

In order to deploy frontend:

```bash
    cd frontend
    netlify deploy --prod
```

# Local environment

In order to run this locally, specify 'ALLOWED_ORIGIN' environment variable to 'http://localhost:3000'

Example in Linux:

```bash
    export ALLOWED_ORIGIN=http://localhost:3000
```

In order to start backend run:

```bash
    go run backend/development/localdev.go
```

In order to start frontend run:

```bash
    cd frontend
    yarn install
    yarn start
```
