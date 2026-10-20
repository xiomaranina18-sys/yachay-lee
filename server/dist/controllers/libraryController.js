import { db } from '../database/db.js';
export const getBooks = async (req, res) => {
    try {
        const { category, level } = req.query;
        const books = await db.books.getAll(category, level);
        res.json(books);
    }
    catch (err) {
        console.error('Error al consultar libros:', err);
        res.status(500).json({ error: 'Error al consultar la biblioteca digital.' });
    }
};
export const getBookById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const book = await db.books.getById(id);
        if (!book) {
            res.status(404).json({ error: 'Libro no encontrado en la biblioteca.' });
            return;
        }
        res.json(book);
    }
    catch (err) {
        console.error('Error al consultar libro:', err);
        res.status(500).json({ error: 'Error al obtener el libro interactivo.' });
    }
};
export const toggleFavorite = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const isFavorite = await db.books.toggleFavorite(id);
        res.json({ id, isFavorite });
    }
    catch (err) {
        console.error('Error al alternar favorito:', err);
        res.status(500).json({ error: 'Error al actualizar favorito.' });
    }
};
