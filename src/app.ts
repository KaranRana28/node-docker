import express, { Request, Response, NextFunction } from 'express';
import Logger from './core/Logger.js';
import cors from 'cors';
import { corsUrl, environment, port } from './config.js';
import './database/index.js'; // initialize nongo database
import './cache/index.js'; // initialize redis cache
import { NotFoundError, ApiError, InternalError, ErrorType } from './core/ApiError.js';
import routes from './routes/index.js';
import path from 'path';
const __dirname = path.resolve();

process.on('uncaughtException', (e) => { Logger.error(e); });

const app = express();

app.use(trackRequestTime);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.enable('trust proxy');

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);

app.get('/test-server', async (req: Request, res: Response) => {
  console.log(`Server running in ${environment} mode on port ${port}.`)
  res.status(200).send(`<h2>Server running in ${environment} mode on port ${port} !!!!</h2>`)
});

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

function trackRequestTime(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${elapsed}ms`);
  });
  next();
}

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
    if (err.type === ErrorType.INTERNAL)
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
  } else {
    Logger.error(
      `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    );
    Logger.error(err);
    if (environment === 'development') {
      return res.status(500).send(err);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
