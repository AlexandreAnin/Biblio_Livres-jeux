import { Request, Response } from 'express';
import prisma from '../config/database';

// GET /api/books - Liste tous les livres publiés
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      where: { isPublished: true },
      orderBy: [{ series: 'asc' }, { seriesIndex: 'asc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        author: true,
        series: true,
        seriesIndex: true,
        coverImage: true,
        description: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// GET /api/books/:slug - Détails d'un livre
export const getBookBySlug = async (req: Request, res: Response) => {
  try {
    const slug = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;

    const book = await prisma.book.findUnique({
      where: { slug },
      include: {
        passages: {
          select: {
            id: true,
            number: true,
            title: true,
            type: true,
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

// POST /api/books - Créer un livre (admin)
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, slug, author, series, seriesIndex, description } = req.body;

    const book = await prisma.book.create({
      data: {
        title,
        slug,
        author,
        series,
        seriesIndex,
        description,
      },
    });

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
};