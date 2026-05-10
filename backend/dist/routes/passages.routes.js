"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passages_controller_1 = require("../controllers/passages.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Routes publiques
router.get('/:bookSlug/passages/:number', passages_controller_1.getPassage);
// Routes protégées (admin)
router.post('/:bookId/passages', auth_middleware_1.authMiddleware, passages_controller_1.createPassage);
exports.default = router;
