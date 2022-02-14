.PHONY: build clean deploy

clean:
	rm -rf ./bin

test:
	go test ./...

build:
	rm -f bin/*
	env GOOS=linux go build -ldflags="-s -w" -o bin/lambda backend/endpoints/aws/lambda.go

deploy: clean build
	sls deploy --verbose