.PHONY: build clean deploy

clean:
	rm -rf ./bin

test:
	go test ./...

build:
	rm -f bin/*
	env GOOS=linux go build -ldflags="-s -w" -o bin/lambda backend/endpoints/aws/lambda.go

build-image-local: build
	docker build . -t validkube

run-container-local:
	docker run -it --entrypoint /bin/bash validkube

start-local-backend:
	go run backend/development/localdev.go

deploy-backend: clean build
	sls deploy --verbose

deploy-frontend:
	cd frontend && $(MAKE) deploy

deploy: deploy-backend deploy-frontend
	echo "Deploying BE and FE"