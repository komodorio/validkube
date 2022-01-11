package routing

import (
	"os"

	"github.com/gin-gonic/gin"
)

// Exporting constants to avoid hardcoding these all over, and ending up with a uppercase "POST" bug in the future.
const (
	GET  = "get"
	POST = "post"
)

func Build() *gin.Engine {
	engine := gin.New()
	engine.Use(gin.Logger())
	engine.Use(gin.Recovery())
	engine.Use(CORS())
	return engine
}
func setMethodHandler(method string, path string, fn gin.HandlerFunc, group *gin.RouterGroup) {
	switch method {
	case POST:
		group.POST(path, fn)
	case GET:
		group.GET(path, fn)
	}
}
func AddRoute(engine *gin.Engine, path string, method string, fn gin.HandlerFunc) *gin.Engine {
	group := engine.Group("/")
	setMethodHandler(method, path, fn, group)
	return engine
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
		c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		// Handle browser preflight requests, where it asks for allowed origin.
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
