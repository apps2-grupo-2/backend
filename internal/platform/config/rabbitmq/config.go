package rabbitmq

import "backend/internal/platform/env"

type Config struct {
	URL string
}

func Load() Config {
	return Config{
		URL: env.Get("RABBITMQ_URL"),
	}
}
