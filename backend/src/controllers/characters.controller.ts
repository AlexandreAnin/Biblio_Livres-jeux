import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

// GET /api/characters - Liste des personnages de l'utilisateur
export const getCharacters = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const characters = await prisma.character.findMany({
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
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
};

// GET /api/characters/:id - Détails d'un personnage
export const getCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const userId = req.userId!;

    const character = await prisma.character.findFirst({
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
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
};

// POST /api/characters - Créer un personnage
export const createCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      bookId,
      name,
      skill,
      skillMax,
      endurance,
      enduranceMax,
      disciplines,
      masteredWeapon,
    } = req.body;

    const character = await prisma.character.create({
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
  } catch (error) {
    console.error('Create character error:', error);
    res.status(500).json({ error: 'Failed to create character' });
  }
};

// PUT /api/characters/:id - Mettre à jour un personnage
export const updateCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const userId = req.userId!;

    // Vérifier que le personnage appartient à l'utilisateur
    const existing = await prisma.character.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Character not found' });
    }

    const character = await prisma.character.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: character,
    });
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({ error: 'Failed to update character' });
  }
};

// DELETE /api/characters/:id - Supprimer un personnage
export const deleteCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const userId = req.userId!;

    // Vérifier que le personnage appartient à l'utilisateur
    const existing = await prisma.character.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Character not found' });
    }

    await prisma.character.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Character deleted',
    });
  } catch (error) {
    console.error('Delete character error:', error);
    res.status(500).json({ error: 'Failed to delete character' });
  }
};