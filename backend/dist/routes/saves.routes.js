"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saves_controller_1 = require("../controllers/saves.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Toutes les routes sont protégées
router.use(auth_middleware_1.authMiddleware);
router.get('/', saves_controller_1.getSaves);
router.post('/', saves_controller_1.createSave);
router.put('/:id', saves_controller_1.updateSave);
exports.default = router;
