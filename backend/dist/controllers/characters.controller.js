"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCharacter = exports.updateCharacter = exports.createCharacter = exports.getCharacter = exports.getCharacters = void 0;
const database_1 = __importDefault(require("../config/database"));
// GET /api/characters - Liste des personnages de l'utilisateur
const getCharacters = async (req, res) => {
    try {
        const userId = req.userId;
        const characters = await database_1.default.character.findMany({
            where: { userId },
            include: {
                book: {
                    select: {
                        title: true,
                        slug: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({
            success: true,
            data: characters,
        });
    }
    catch (error) {
        console.error('Get characters error:', error);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
};
exports.getCharacters = getCharacters;
// GET /api/characters/:id - Détails d'un personnage
const getCharacter = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        const character = await database_1.default.character.findFirst({
            where: {
                id,
                userId, // Sécurité : uniquement ses personnages
            },
            include: {
                book: true,
            },
        });
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json({
            success: true,
            data: character,
        });
    }
    catch (error) {
        console.error('Get character error:', error);
        res.status(500).json({ error: 'Failed to fetch character' });
    }
};
exports.getCharacter = getCharacter;
// POST /api/characters - Créer un personnage
const createCharacter = async (req, res) => {
    try {
        const userId = req.userId;
        const { bookId, name, skill, skillMax, endurance, enduranceMax, disciplines, masteredWeapon, } = req.body;
        const character = await database_1.default.character.create({
            data: {
                userId,
                bookId,
                name,
                skill,
                skillMax,
                endurance,
                enduranceMax,
                disciplines,
                masteredWeapon,
            },
        });
        res.status(201).json({
            success: true,
            data: character,
        });
    }
    catch (error) {
        console.error('Create character error:', error);
        res.status(500).json({ error: 'Failed to create character' });
    }
};
exports.createCharacter = createCharacter;
// PUT /api/characters/:id - Mettre à jour un personnage
const updateCharacter = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        // Vérifier que le personnage appartient à l'utilisateur
        const existing = await database_1.default.character.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            return res.status(404).json({ error: 'Character not found' });
        }
        const character = await database_1.default.character.update({
            where: { id },
            data: req.body,
        });
        res.json({
            success: true,
            data: character,
        });
    }
    catch (error) {
        console.error('Update character error:', error);
        res.status(500).json({ error: 'Failed to update character' });
    }
};
exports.updateCharacter = updateCharacter;
// DELETE /api/characters/:id - Supprimer un personnage
const deleteCharacter = async (req, res) => {
    try {
        const id = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const userId = req.userId;
        // Vérifier que le personnage appartient à l'utilisateur
        const existing = await database_1.default.character.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            return res.status(404).json({ error: 'Character not found' });
        }
        await database_1.default.character.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: 'Character deleted',
        });
    }
    catch (error) {
        console.error('Delete character error:', error);
        res.status(500).json({ error: 'Failed to delete character' });
    }
};
exports.deleteCharacter = deleteCharacter;
