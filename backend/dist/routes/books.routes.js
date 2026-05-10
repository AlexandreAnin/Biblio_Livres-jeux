"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_controller_1 = require("../controllers/books.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Routes publiques
router.get('/', books_controller_1.getBooks);
router.get('/:slug', books_controller_1.getBookBySlug);
// Routes protégées (admin)
router.post('/', auth_middleware_1.authMiddleware, books_controller_1.createBook);
exports.default = router;
