package bootstrap

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"backend/internal/platform/config"
	"backend/internal/platform/database"
	httptransport "backend/internal/transport/http"
)

type App struct {
	cfg *config.Config
	db  *sql.DB
	srv *httptransport.Server
}

func New() (*App, error) {
	// -------------------------
	// Load config
	// -------------------------
	cfg := config.Load()
	log.Println("cfg loaded")

	// -------------------------
	// Database
	// -------------------------
	db, err := database.NewMySQL(cfg.Database)
	if err != nil {
		return nil, fmt.Errorf("bootstrap.database: %w", err)
	}

	log.Println("database connected")

	// -------------------------
	// HTTP server
	// -------------------------
	srv := httptransport.NewServer(cfg.App.Port, db)

	return &App{
		cfg: cfg,
		db:  db,
		srv: srv,
	}, nil
}

func (a *App) Run() error {
	// Canal para errores del server
	serverErr := make(chan error, 1)

	go func() {
		log.Println("server running on port:", a.cfg.App.Port)
		serverErr <- a.srv.Run()
	}()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	select {
	case err := <-serverErr:
		return fmt.Errorf("server error: %w", err)

	case <-ctx.Done():
		log.Println("shutdown signal received")
		return a.shutdown()
	}
}

func (a *App) shutdown() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// HTTP shutdown
	if err := a.srv.Shutdown(ctx); err != nil {
		log.Printf("http shutdown error: %v", err)
	}

	// DB close
	if err := a.db.Close(); err != nil {
		log.Printf("db close error: %v", err)
	}

	log.Println("application stopped")
	return nil
}
