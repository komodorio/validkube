package main

import (
	"log"

	"github.com/komodorio/validkube/backend/endpoints"
	"github.com/komodorio/validkube/backend/internal/routing"
)

func main() {
	engine := routing.Build()
	for _, e := range endpoints.Endpoints {
		routing.AddRoute(engine, e.Path, e.Method, e.Function)
	}

	if err := engine.Run(); err != nil {
		log.Printf("Error starting gin %v", err)
	}

	log.Printf("Application exiting.")
}
