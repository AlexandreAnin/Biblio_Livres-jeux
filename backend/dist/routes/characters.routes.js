"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const characters_controller_1 = require("../controllers/characters.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Toutes les routes sont protégées
router.use(auth_middleware_1.authMiddleware);
router.get('/', characters_controller_1.getCharacters);
router.get('/:id', characters_controller_1.getCharacter);
router.post('/', characters_controller_1.createCharacter);
router.put('/:id', characters_controller_1.updateCharacter);
router.delete('/:id', characters_controller_1.deleteCharacter);
exports.default = router;
