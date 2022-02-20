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

deploy: clean build
	sls deploy --verbose