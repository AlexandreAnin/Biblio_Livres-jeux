import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/books/:bookSlug/passages/:number
export const getPassage = async (req: Request, res: Response) => {
  try {
    const bookSlug = Array.isArray(req.params.bookSlug)
      ? req.params.bookSlug[0]
      : req.params.bookSlug;
      const number = Array.isArray(req.params.number)
      ? req.params.number[0]
      : req.params.number;
    const passageNumber = parseInt(number);

    // Trouver le livre
    const book = await prisma.book.findUnique({
      where: { slug: bookSlug },
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Trouver le passage
    const passage = await prisma.passage.findUnique({
      where: {
        bookId_number: {
          bookId: book.id,
          number: passageNumber,
        },
      },
      include: {
        choices: true,
      },
    });

    if (!passage) {
      return res.status(404).json({ error: 'Passage not found' });
    }

    res.json({
      success: true,
      data: passage,
    });
  } catch (error) {
    console.error('Get passage error:', error);
    res.status(500).json({ error: 'Failed to fetch passage' });
  }
};

// POST /api/books/:bookId/passages - Créer un passage
export const createPassage = async (req: Request, res: Response) => {
  try {
    const bookId = Array.isArray(req.params.bookId)
      ? req.params.bookId[0]
      : req.params.bookId;
    const {
      number,
      title,
      content,
      type,
      enemyName,
      enemySkill,
      enemyEndurance,
      isPsychic,
      canFlee,
      choices,
    } = req.body;

    const passage = await prisma.passage.create({
      data: {
        bookId,
        number,
        title,
        content,
        type,
        enemyName,
        enemySkill,
        enemyEndurance,
        isPsychic,
        canFlee,
        choices: {
          create: choices || [],
        },
      },
      include: {
        choices: true,
      },
    });

    res.status(201).json({
      success: true,
      data: passage,
    });
  } catch (error) {
    console.error('Create passage error:', error);
    res.status(500).json({ error: 'Failed to create passage' });
  }
};