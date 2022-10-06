.PHONY: build clean deploy

clean:
	rm -rf ./bin

test:
	go test ./...

build:
	rm -f bin/*
	env GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o bin/lambda backend/endpoints/aws/lambda.go

build-image-local: build
	docker build . -t validkube

run-container-local:
	docker run -it --entrypoint /bin/bash validkube

start-local-backend:
	export ALLOWED_ORIGIN=http://localhost:3000
	go run backend/development/localdev.go

start-local-frontend:
	cd frontend && yarn start

deploy-backend:
	sls deploy --verbose

deploy-frontend:
	cd frontend && yarn --frozen-lockfile && $(MAKE) deploy

deploy: deploy-backend deploy-frontend
	echo "Deploying BE and FE"