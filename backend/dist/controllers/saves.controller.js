"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSave = exports.createSave = exports.getSaves = void 0;
const database_1 = __importDefault(require("../config/database"));
// GET /api/saves - Liste des sauvegardes
const getSaves = async (req, res) => {
    try {
        const userId = req.userId;
        const saves = await database_1.default.saveGame.findMany({
            where: { userId },
            include: {
                character: {
                    include: {
                        book: {
                            select: {
                                title: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        res.json({
            success: true,
            data: saves,
        });
    }
    catch (error) {
        console.error('Get saves error:', error);
        res.status(500).json({ error: 'Failed to fetch saves' });
    }
};
exports.getSaves = getSaves;
// POST /api/saves - Créer une sauvegarde
const createSave = async (req, res) => {
    try {
        const userId = req.userId;
        const { characterId, currentPassage, characterData, gameState } = req.body;
        // Vérifier que le personnage appartient à l'utilisateur
        const character = await database_1.default.character.findFirst({
            where: { id: characterId, userId },
        });
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }
        const save = await database_1.default.saveGame.create({
            data: {
                userId,
                characterId,
                currentPassage,
                characterData,
                gameState,
            },
        });
        res.status(201).json({
            success: true,
            data: save,
        });
    }
    catch (error) {
        console.error('Create save error:', error);
        res.status(500).json({ error: 'Failed to create save' });
    }
};
exports.createSave = createSave;
// PUT /api/saves/:id - Mettre à jour une sauvegarde
const updateSave = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        // Vérifier que la sauvegarde appartient à l'utilisateur
        const existing = await database_1.default.saveGame.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            return res.status(404).json({ error: 'Save not found' });
        }
        const save = await database_1.default.saveGame.update({
            where: { id },
            data: req.body,
        });
        res.json({
            success: true,
            data: save,
        });
    }
    catch (error) {
        console.error('Update save error:', error);
        res.status(500).json({ error: 'Failed to update save' });
    }
};
exports.updateSave = updateSave;
