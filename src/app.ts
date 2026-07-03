import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import AppError from './utils/AppError';
import authRouter from './routes/auth.routes';
import postRouter from './routes/post.routes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import rateLimit from 'express-rate-limit';

const app: Application = express();

// Trust the reverse proxy (Render) so we can get the actual client IP for rate limiting
app.set('trust proxy', 1);

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger API Documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #1e293b; font-weight: 800; }
    .swagger-ui .info { margin: 30px 0; }
    body { background-color: #f8fafc; font-family: 'Inter', sans-serif; }
    .swagger-ui .opblock.opblock-post { background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.4); border-radius: 8px; }
    .swagger-ui .opblock.opblock-get { background: rgba(59, 130, 246, 0.05); border-color: rgba(59, 130, 246, 0.4); border-radius: 8px; }
    .swagger-ui .opblock.opblock-patch { background: rgba(245, 158, 11, 0.05); border-color: rgba(245, 158, 11, 0.4); border-radius: 8px; }
    .swagger-ui .opblock.opblock-delete { background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.4); border-radius: 8px; }
    .swagger-ui .btn { border-radius: 6px; font-weight: 600; }
  `,
  customSiteTitle: "Blog API | Interactive Documentation",
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Basic Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Blog API Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fira+Code&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background-color: #0a0a0a;
          color: #ededed;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          text-align: left;
          background: #0a0a0a;
          padding: 3rem;
          border-radius: 8px;
          border: 1px solid #27272a;
          max-width: 600px;
          width: 90%;
        }
        h1 {
          font-size: 2.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #fafafa;
          letter-spacing: -0.02em;
        }
        p {
          font-size: 1rem;
          color: #a1a1aa;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #0a0a0a;
          background: #ededed;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.2s ease, color 0.2s ease;
          border: 1px solid #ededed;
        }
        .btn:hover {
          background: transparent;
          color: #ededed;
        }
        .badges {
          display: flex;
          gap: 8px;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .badge {
          background: transparent;
          color: #a1a1aa;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-family: 'Fira Code', monospace;
          border: 1px solid #27272a;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="badges">
          <span class="badge">node.js</span>
          <span class="badge">express</span>
          <span class="badge">mongodb</span>
          <span class="badge">typescript</span>
        </div>
        <h1>Blog API Backend</h1>
        <p>Core API service powering the blogging platform. Built with robust authentication, secure routing, and structured database interactions.</p>
        <a href="/api-docs" class="btn">View API Documentation &rarr;</a>
      </div>
    </body>
    </html>
  `);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after an hour',
});

// Apply rate limiting to all /api routes
app.use('/api', limiter);

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;
