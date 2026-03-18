package database

import (
	"fmt"
	"time"

	"backend/internal/platform/env"
)

type Config struct {
	Host               string
	Port               string
	User               string
	Password           string
	Name               string
	MaxOpenConnections int
	MaxIdleConnections int
	ConnMaxLifetime    time.Duration
}

func Load() Config {

	return Config{
		Host:               env.Get("DB_HOST"),
		Port:               env.Get("DB_PORT"),
		User:               env.Get("DB_USER"),
		Password:           env.Get("DB_PASSWORD"),
		Name:               env.Get("DB_NAME"),
		MaxOpenConnections: env.GetAsInt("DB_MAX_CONNECTIONS"),
		MaxIdleConnections: env.GetAsInt("DB_MAX_IDLE_CONNECTIONS"),
		ConnMaxLifetime:    env.GetAsDuration("DB_MAX_CONNECTIONS_LIFETIME"),
	}
}

func (c Config) DSN() string {

	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true",
		c.User,
		c.Password,
		c.Host,
		c.Port,
		c.Name,
	)
}
