import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Book } from '../../types';
import { DuoButton } from '../../components/common/DuoButton';
import {
  BookMarked,
  Heart,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  Filter,
  Layers,
  Star
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.library.getBooks()
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent, bookId: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.library.toggleFavorite(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, isFavorite: res.isFavorite } : b));
    } catch (e) {
      console.warn('Error al alternar favorito:', e);
    }
  };

  const categories = [
    'all',
    'Cuentos Andinos',
    'Fábulas y Valores',
    'Aventuras Mágicas',
    'Ciencia para Niños'
  ];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || b.level === selectedLevel;
    const matchesFav = !showOnlyFavorites || b.isFavorite;
    return matchesSearch && matchesCategory && matchesLevel && matchesFav;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 p-6 sm:p-8 text-white shadow-xl shadow-primary-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Biblioteca Digital Infantil Yachay</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Cuentos y Aventuras Ilustradas
          </h1>
          <p className="text-xs sm:text-sm text-primary-100 mt-1 max-w-xl">
            Lectura guiada con narración por voz, vocabulario interactivo, preguntas de comprensión y favoritos.
          </p>
        </div>

        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-md ${
            showOnlyFavorites
              ? 'bg-rose-500 text-white shadow-rose-500/30'
              : 'bg-white text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-white' : 'text-rose-500'}`} />
          <span>{showOnlyFavorites ? 'Ver Todos los Cuentos' : 'Mis Cuentos Favoritos'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o autor..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="all">Todos los Niveles</option>
            <option value="Inicial">Nivel Inicial</option>
            <option value="Básico">Nivel Básico</option>
            <option value="Intermedio">Nivel Intermedio</option>
            <option value="Avanzado">Nivel Avanzado</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Cargando biblioteca digital...</div>
      ) : filteredBooks.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          No se encontraron cuentos con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Book Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white backdrop-blur-md shadow-sm">
                      {book.level}
                    </span>
                    <button
                      onClick={(e) => handleToggleFavorite(e, book.id)}
                      className="p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 hover:scale-110 active:scale-95 transition-all shadow-sm"
                      title={book.isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                    >
                      <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  {/* Reading Time */}
                  <div className="absolute bottom-3 left-3 text-white text-[11px] font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{book.readTimeMinutes} min de lectura</span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="p-5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    {book.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white mt-1 leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Por {book.author}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <Link to={`/library/${book.id}`} className="block w-full">
                  <DuoButton variant="blue" fullWidth size="md" icon={<BookOpen className="w-4 h-4" />}>
                    Leer Cuento Interactivo
                  </DuoButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
