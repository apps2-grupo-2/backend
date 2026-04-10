require('module-alias/register');
const { createApp } = require('../app');
const { logger } = require('@/utils/logger.util');

const PORT = process.env.PORT || 3000;

function startServer() {
  const app = createApp();

  const server = app.listen(PORT, () => {
    logger.info(`[SERVER] Running on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  function shutdown() {
    console.log('[SERVER] Shutting down gracefully...');
    server.close(() => {
      console.log('[SERVER] Closed successfully');
      process.exit(0);
    });
  }
}

startServer();