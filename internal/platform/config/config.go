package config

import (
	"backend/internal/platform/config/app"
	"backend/internal/platform/config/database"
	"backend/internal/platform/config/rabbitmq"

	"github.com/joho/godotenv"
)

type Config struct {
	App      app.Config
	Database database.Config
	RabbitMQ rabbitmq.Config
}

func Load() *Config {
	_ = godotenv.Load()

	return &Config{
		App:      app.Load(),
		Database: database.Load(),
		RabbitMQ: rabbitmq.Load(),
	}
}
