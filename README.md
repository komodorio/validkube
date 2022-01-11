# validkube

### Prerequisite

- aws CLI with access to your AWS
- yarn
- npm
- serverless CLI

---

### Deploy backend server less

```bash
    make deploy
```

Serverless endpoint: https://gtgmn58dh9.execute-api.us-east-1.amazonaws.com/production

Frontend-domain: https://validkube.com

In order to update web domin:

```bash
    aws ssm put-parameter --name /validkube/config/allowed_origin --type String --value {frontend-domain} --overwrite
```

In order to deploy frontend:

```bash
    cd frontend
    netlify deploy --prod
```

# Local environment

Set local env of allowed origin, example in Unix-like:

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
    yarn insatll
    yarn start
```
