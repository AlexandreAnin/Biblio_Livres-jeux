"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBook = exports.getBookBySlug = exports.getBooks = void 0;
const database_1 = __importDefault(require("../config/database"));
// GET /api/books - Liste tous les livres publiés
const getBooks = async (req, res) => {
    try {
        const books = await database_1.default.book.findMany({
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
    }
    catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};
exports.getBooks = getBooks;
// GET /api/books/:slug - Détails d'un livre
const getBookBySlug = async (req, res) => {
    try {
        const slug = Array.isArray(req.params.slug)
            ? req.params.slug[0]
            : req.params.slug;
        const book = await database_1.default.book.findUnique({
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
    }
    catch (error) {
        console.error('Get book error:', error);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
};
exports.getBookBySlug = getBookBySlug;
// POST /api/books - Créer un livre (admin)
const createBook = async (req, res) => {
    try {
        const { title, slug, author, series, seriesIndex, description } = req.body;
        const book = await database_1.default.book.create({
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
    }
    catch (error) {
        console.error('Create book error:', error);
        res.status(500).json({ error: 'Failed to create book' });
    }
};
exports.createBook = createBook;
