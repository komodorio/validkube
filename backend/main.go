package main // Important: Packages with endpoints must be named 'main'

import (
	"log"

	"github.com/komodorio/kubetools/backend/api/hello"
	"github.com/komodorio/kubetools/backend/internal/routing"
)

func main() {
	engine := routing.Build()
	routing.AddRoute(engine, hello.Path, hello.Method, hello.ProcessRequest)

	if err := engine.Run(); err != nil {
		log.Printf("Error starting gin %v", err)
	}

	log.Printf("Application exiting.")
}
