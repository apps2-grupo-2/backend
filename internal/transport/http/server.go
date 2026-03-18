package http

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Server struct {
	engine *gin.Engine
	server *http.Server
}

func NewServer(port string, db *sql.DB) *Server {
	router := gin.Default()

	// health
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// TODO: inject handlers con db

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	return &Server{
		engine: router,
		server: srv,
	}
}

func (s *Server) Run() error {
	return s.server.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.server.Shutdown(ctx)
}
