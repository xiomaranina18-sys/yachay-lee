import { Request, Response } from 'express';
import { db } from '../database/db.js';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, level } = req.query;
    const books = await db.books.getAll(category as string, level as string);
    res.json(books);
  } catch (err: any) {
    console.error('Error al consultar libros:', err);
    res.status(500).json({ error: 'Error al consultar la biblioteca digital.' });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const book = await db.books.getById(id);
    if (!book) {
      res.status(404).json({ error: 'Libro no encontrado en la biblioteca.' });
      return;
    }
    res.json(book);
  } catch (err: any) {
    console.error('Error al consultar libro:', err);
    res.status(500).json({ error: 'Error al obtener el libro interactivo.' });
  }
};

export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const isFavorite = await db.books.toggleFavorite(id);
    res.json({ id, isFavorite });
  } catch (err: any) {
    console.error('Error al alternar favorito:', err);
    res.status(500).json({ error: 'Error al actualizar favorito.' });
  }
};
