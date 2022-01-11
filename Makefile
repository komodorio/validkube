.PHONY: build clean deploy

clean:
	rm -rf ./bin

build:
	rm -f bin/*
	env GOOS=linux go build -ldflags="-s -w" -o bin/lambda backend/endpoints/aws/lambda.go

deploy: clean build
	sls deploy --verbose