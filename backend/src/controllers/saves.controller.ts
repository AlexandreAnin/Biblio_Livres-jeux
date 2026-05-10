import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../types';

// GET /api/saves - Liste des sauvegardes
export const getSaves = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const saves = await prisma.saveGame.findMany({
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
  } catch (error) {
    console.error('Get saves error:', error);
    res.status(500).json({ error: 'Failed to fetch saves' });
  }
};

// POST /api/saves - Créer une sauvegarde
export const createSave = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { characterId, currentPassage, characterData, gameState } = req.body;

    // Vérifier que le personnage appartient à l'utilisateur
    const character = await prisma.character.findFirst({
      where: { id: characterId, userId },
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    const save = await prisma.saveGame.create({
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
  } catch (error) {
    console.error('Create save error:', error);
    res.status(500).json({ error: 'Failed to create save' });
  }
};

// PUT /api/saves/:id - Mettre à jour une sauvegarde
export const updateSave = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const userId = req.userId!;

    // Vérifier que la sauvegarde appartient à l'utilisateur
    const existing = await prisma.saveGame.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Save not found' });
    }

    const save = await prisma.saveGame.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: save,
    });
  } catch (error) {
    console.error('Update save error:', error);
    res.status(500).json({ error: 'Failed to update save' });
  }
};