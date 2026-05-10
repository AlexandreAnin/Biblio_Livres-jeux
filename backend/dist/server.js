"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = require("./middleware/error.middleware");
// Importer les routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const books_routes_1 = __importDefault(require("./routes/books.routes"));
const passages_routes_1 = __importDefault(require("./routes/passages.routes"));
const characters_routes_1 = __importDefault(require("./routes/characters.routes"));
const saves_routes_1 = __importDefault(require("./routes/saves.routes"));
// Charger les variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// CORS
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logger simple (développement)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}
;
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/books', books_routes_1.default);
app.use('/api/books', passages_routes_1.default); // /api/books/:slug/passages/:number
app.use('/api/characters', characters_routes_1.default);
app.use('/api/saves', saves_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Error handler (doit être le dernier)
app.use(error_middleware_1.errorHandler);
app.listen(port, () => {
    console.log(`
        ╔═══════════════════════════════════════════════════════╗
        ║                                                       ║
        ║   🚀 Server running on http://localhost:${port}          ║
        ║   📚 Environment: ${process.env.NODE_ENV || 'development'}                         ║
        ║   🔐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}               ║
        ║                                                       ║
        ╚═══════════════════════════════════════════════════════╝
        `);
});
exports.default = app;
