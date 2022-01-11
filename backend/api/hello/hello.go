package hello

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/komodorio/validkube/backend/internal/routing"
)

const Path = "/hello"
const Method = routing.GET

func ProcessRequest(c *gin.Context) {
	name := c.Query("name")
	c.JSON(http.StatusOK, gin.H{"msg": fmt.Sprintf("Hello %v!", name)})
}
