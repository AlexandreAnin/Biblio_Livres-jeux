import express,{Express, Response, Request} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware';

// Importer les routes
import authRoutes from './routes/auth.routes';

// Charger les variables d'environnement
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// Logger simple (développement)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
 
// Error handler (doit être le dernier)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`
        ╔═══════════════════════════════════════════════════════╗
        ║                                                       ║
        ║   🚀 Server running on http://localhost:${port}      ║
        ║   📚 Environment: ${process.env.NODE_ENV || 'development'}              ║
        ║   🔐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'} ║
        ║                                                       ║
        ╚═══════════════════════════════════════════════════════╝
        `);
});

export default app;