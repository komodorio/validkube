.PHONY: build clean deploy

build:
	rm -f build/*
	yarn build

clean:
	rm -rf ./build

deploy: clean build
	netlify deploy --prod