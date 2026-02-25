import http from 'http';
import app from './app';
import { PORT } from './config';
import { logger } from './utils/logger-advanced';

let server: http.Server | null = null;

function startServer() {
  server = http.createServer(app);
  server.listen(PORT, () => {
    logger.info(`✅ Backend running on http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

export { server, startServer };
