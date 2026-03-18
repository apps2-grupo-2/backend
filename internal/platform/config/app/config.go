package app

import "backend/internal/platform/env"

type Config struct {
	Port string
}

func Load() Config {

	return Config{
		Port: env.Get("APP_PORT"),
	}
}
