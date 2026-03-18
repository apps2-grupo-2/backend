package env

import (
	"os"
	"strconv"
	"time"
)

func Get(key string) string {
	value := os.Getenv(key)
	return value
}

func GetAsInt(key string) int {
	value := Get(key)
	parsed, err := strconv.Atoi(value)

	if err != nil {
		return -1
	}

	return parsed
}
func GetAsDuration(key string) time.Duration {
	value := Get(key)
	duration, err := time.ParseDuration(value)

	if err != nil {
		return -1
	}

	return duration
}
