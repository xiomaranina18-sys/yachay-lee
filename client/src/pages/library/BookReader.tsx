import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Book } from '../../types';
import { speechService } from '../../services/speech';
import { DuoButton } from '../../components/common/DuoButton';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Heart,
  Moon,
  Sun,
  Type,
  CheckCircle2,
  Star,
  BookOpen,
  Info,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const BookReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  // Reader Settings
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [nightMode, setNightMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);

  // Vocabulary Popover
  const [selectedWord, setSelectedWord] = useState<{ word: string; meaning: string } | null>(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (id) {
      api.library.getBookById(Number(id))
        .then(data => {
          setBook(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!book) return;
    try {
      const res = await api.library.toggleFavorite(book.id);
      setBook({ ...book, isFavorite: res.isFavorite });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleReadParagraph = (text: string, index: number) => {
    setActiveParagraphIndex(index);
    setIsPlayingAudio(true);
    speechService.speak(text, {
      rate: 0.85,
      pitch: 1.1,
      onEnd: () => {
        setIsPlayingAudio(false);
        setActiveParagraphIndex(null);
      }
    });
  };

  const handleReadEntireStory = () => {
    if (!book) return;
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
      setActiveParagraphIndex(null);
      return;
    }

    setIsPlayingAudio(true);
    const fullText = book.paragraphs.join('. ');
    speechService.speak(fullText, {
      rate: 0.85,
      pitch: 1.1,
      onEnd: () => {
        setIsPlayingAudio(false);
        setActiveParagraphIndex(null);
      }
    });
  };

  const handleQuizSubmit = () => {
    if (!book) return;
    let correct = 0;
    book.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        correct++;
      }
    });
    const finalScore = Math.round((correct / book.quiz.length) * 100);
    setQuizScore(finalScore);
    setQuizSubmitted(true);

    if (finalScore >= 70) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      speechService.speak('¡Excelente comprensión! Has completado el cuento exitosamente.');
    }
  };

  if (loading || !book) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const fontSizeClass = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-loose',
    huge: 'text-xl sm:text-2xl leading-loose tracking-wide'
  }[fontSize];

  return (
    <div className={`max-w-4xl mx-auto space-y-6 transition-colors duration-300 ${nightMode ? 'text-amber-100' : ''}`}>
      
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/library"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Biblioteca</span>
        </Link>

        {/* Reader Control Actions */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* Audio Narration Button */}
          <button
            onClick={handleReadEntireStory}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isPlayingAudio
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-300 hover:bg-primary-100'
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? 'Detener Voz' : 'Narrar Cuento'}</span>
          </button>

          {/* Font Size Toggle */}
          <button
            onClick={() => {
              setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'huge' : 'normal');
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-1"
            title="Cambiar tamaño de letra"
          >
            <Type className="w-4 h-4" />
            <span className="uppercase text-[10px]">{fontSize}</span>
          </button>

          {/* Night Mode Toggle */}
          <button
            onClick={() => setNightMode(!nightMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Modo lectura nocturna"
          >
            {nightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={handleToggleFavorite}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Favorito"
          >
            <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      {/* Main Reading Card */}
      <article
        className={`rounded-3xl border shadow-xl p-6 sm:p-12 transition-colors duration-300 ${
          nightMode
            ? 'bg-slate-950 border-slate-800 text-amber-100/90'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
        }`}
      >
        {/* Story Header */}
        <header className="text-center pb-8 border-b border-slate-100 dark:border-slate-700/60">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 inline-block mb-3">
            {book.category} • Nivel {book.level}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            {book.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Por {book.author}
          </p>
        </header>

        {/* Story Body Paragraphs */}
        <div className={`mt-8 space-y-6 ${fontSizeClass}`}>
          {book.paragraphs.map((paragraph, index) => {
            const isActive = activeParagraphIndex === index;
            return (
              <div
                key={index}
                className={`p-4 rounded-2xl transition-all duration-200 relative group flex items-start gap-3 ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/40 ring-2 ring-primary-500'
                    : 'hover:bg-slate-50/60 dark:hover:bg-slate-750/40'
                }`}
              >
                <button
                  onClick={() => handleReadParagraph(paragraph, index)}
                  className="mt-1 p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  title="Escuchar este párrafo"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <p className="flex-1 font-serif text-justify leading-relaxed">
                  {paragraph}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interactive Vocabulary Pills */}
        {book.vocabularyWords && book.vocabularyWords.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary-500" />
              <span>Vocabulario Mágico del Cuento (Haz clic para conocer el significado)</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {book.vocabularyWords.map((v) => (
                <button
                  key={v.word}
                  onClick={() => {
                    setSelectedWord(v);
                    speechService.speak(`${v.word}. Significa: ${v.meaning}`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition-colors shadow-sm"
                >
                  ✨ {v.word}
                </button>
              ))}
            </div>

            {selectedWord && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 animate-in fade-in">
                <span className="font-extrabold text-amber-900 dark:text-amber-200 text-sm">
                  {selectedWord.word}:
                </span>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                  {selectedWord.meaning}
                </p>
              </div>
            )}
          </div>
        )}

      </article>

      {/* End of Story Comprehension Challenge */}
      {book.quiz && (
        <section className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">
                ¿Cuánto comprendiste de la historia?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Responde las preguntas para ganar estrellas ⭐ de comprensión
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {book.quiz.map((q, qIndex) => (
              <div key={qIndex} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-primary-600 dark:text-primary-400 mb-1">
                  Pregunta {qIndex + 1}
                </p>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white mb-3">
                  {q.question}
                </h4>

                <div className="space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = quizAnswers[qIndex] === optIndex;
                    const isCorrect = q.correct === optIndex;
                    return (
                      <button
                        key={optIndex}
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswers({ ...quizAnswers, [qIndex]: optIndex })}
                        className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                          isSelected
                            ? quizSubmitted
                              ? isCorrect
                                ? 'bg-secondary-500 text-white border-secondary-600'
                                : 'bg-rose-500 text-white border-rose-600'
                              : 'bg-primary-500 text-white border-primary-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                    💡 <strong>Explicación:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            {!quizSubmitted ? (
              <DuoButton
                variant="green"
                size="lg"
                onClick={handleQuizSubmit}
                icon={<CheckCircle2 className="w-5 h-5" />}
              >
                Comprobar Mis Respuestas (+50 ⭐)
              </DuoButton>
            ) : (
              <div className="p-6 rounded-2xl bg-secondary-50 dark:bg-secondary-950/40 border border-secondary-200 dark:border-secondary-800 space-y-3">
                <h3 className="text-xl font-black text-secondary-800 dark:text-secondary-200">
                  ¡Puntuación de Comprensión: {quizScore}%!
                </h3>
                <p className="text-xs text-secondary-700 dark:text-secondary-300">
                  Has sumado puntos a tu progreso lector. ¡Sigue explorando la biblioteca!
                </p>
                <Link to="/library">
                  <DuoButton variant="blue" size="md">
                    Volver a la Biblioteca de Cuentos
                  </DuoButton>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
};
