import { Server } from 'node:http';
import express from 'express';
import type { Express } from 'express';
import { handleExceptions, handleNotFound } from './middlewares/errors.middleware';

export type WebServerConfigOptions = {
  /** Used for local development. Determines what port to use when PORT env variable is not set */
  defaultPort?: number;
};

/**
 * Creates an {@link express} app with default configuration but that can be extended
 * @example
 * ```
 * const server = new WebServer();
 * server.configure(app => { app.get('/greeting', (request, response) => response.send('hi')); });
 * server.start();
 * ```
 */
export class WebServer {
  private httpServer: Server;
  private app: Express;
  private status = { ready: false, configured: false };

  constructor(private options?: WebServerConfigOptions) {
    this.app = express();
    this.httpServer = new Server(this.app);
  }

  private gracefulShutdown(signal: string, reason?: unknown) {
    const gracefulDelayMs = process.env.NODE_ENV === 'production' ? 10_000 : 100;

    console.info('graceful_shutdown_started', `Trying Service graceful shutdown`, {
      signal,
      reason,
      gracefulDelayMs,
    });

    this.status.ready = false;

    setTimeout(() => {
      console.info('graceful_shutdown_completed', `Service graceful shutdown completed. Bye.`, {
        signal,
        reason,
      });
      process.exit(0);
    }, gracefulDelayMs);
  }

  /**
   * Returns if server ready to take requests
   */
  get isReady() {
    return this.status.ready;
  }

  /**
   * Get `express` app instance. Useful for tests.
   */
  get appInstance() {
    return this.app;
  }

  /**
   * Adds default server configuration plus allowing extra configuration from consumers.
   * Ideally should be called before starting the server to have minimum configuration available.
   * @param configFunction Callback function used to pass configuration to web server
   */
  configure(configFunction?: (app: Express) => void) {
    this.app.enable('trust proxy');

    this.app.use(express.json({ limit: '15mb' }));
    this.app.use(express.urlencoded({ extended: false }));

    if (configFunction) {
      configFunction(this.app);
    }

    this.app.use(handleNotFound);
    this.app.use(handleExceptions);

    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
    process.on('unhandledRejection', reason => this.gracefulShutdown('unhandledRejection', reason));
    process.on('uncaughtException', error => this.gracefulShutdown('uncaughtException', error));

    this.status.configured = true;
  }

  /**
   * Starts the HTTP server on `process.env.PORT` or `defaultPort`
   */
  async start(): Promise<void> {
    return new Promise(resolve => {
      if (!this.status.configured) {
        console.warn('server_not_configured', 'WebServer has not been configured. An empty server will execute');
      }

      const port = Number.parseInt(String(process.env.PORT ?? this.options?.defaultPort ?? 3030), 10);

      this.httpServer.listen(port, () => {
        this.status.ready = true;
        console.info('server_started', `Server listening at port: ${port}`);

        resolve();
      });
    });
  }

  /**
   * Stops the HTTP server
   */
  async stop(): Promise<void> {
    return new Promise(resolve => {
      this.httpServer.close(() => {
        this.status.ready = false;
        console.info('server_stopped', `Server manually stopped`);

        resolve();
      });
    });
  }
}
