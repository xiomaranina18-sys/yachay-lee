import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Activity } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { speechService } from '../../services/speech';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Volume2,
  CheckCircle2,
  XCircle,
  Trophy,
  Star,
  Flame,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
  ThumbsUp
} from 'lucide-react';

export const ActivityPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { studentProfile } = useAuth();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  // General activity progress state
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [feedback, setFeedback] = useState<{ correct: boolean; text: string } | null>(null);

  // Specific state: Syllables builder
  const [assembledSyllables, setAssembledSyllables] = useState<string[]>([]);

  // Specific state: Sentences builder
  const [assembledWords, setAssembledWords] = useState<string[]>([]);

  // Specific state: Memory Game
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  // Specific state: Sight words flashcard
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  // Specific state: Story comprehension
  const [comprehensionAnswers, setComprehensionAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (id) {
      api.activities.getById(Number(id))
        .then(data => {
          setActivity(data);
          // Initialize memory game if category is games
          if (data.category === 'games' && data.content_json?.pairs) {
            const shuffled = [...data.content_json.pairs].sort(() => Math.random() - 0.5);
            setMemoryCards(shuffled);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const speakText = (text: string, rate = 0.85) => {
    speechService.speak(text, { rate });
  };

  const handleFinishActivity = async (finalScore: number, maxScore: number, accuracy: number, wpm: number) => {
    setIsCompleted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    speechService.speak('¡Excelente trabajo! Has completado tu lectura exitosamente.', { rate: 0.95 });

    const studentId = studentProfile ? studentProfile.id : 1;
    const timeSpent = Math.max(15, Math.round((Date.now() - startTime) / 1000));

    try {
      await api.progress.recordAttempt({
        student_id: studentId,
        activity_id: Number(id),
        score: finalScore,
        max_score: maxScore,
        accuracy_percentage: accuracy,
        words_per_minute: wpm,
        time_spent_seconds: timeSpent,
        details_json: { moves, stepCount: currentStep + 1 }
      });
    } catch (e) {
      console.warn('Error al guardar progreso:', e);
    }
  };

  if (loading || !activity) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const content = activity.content_json;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/activities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a actividades</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>+{activity.points} Puntos</span>
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
            Nivel {activity.level}
          </span>
        </div>
      </div>

      {/* Main Activity Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden p-6 sm:p-8">
        
        {/* Activity Header */}
        <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-700/80">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">
            {activity.category.toUpperCase()} • YACHAY LEE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mt-1">
            {activity.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-1">
            {activity.description}
          </p>
        </div>

        {/* FEEDBACK BANNER */}
        {feedback && (
          <div className={`my-4 p-3.5 rounded-2xl flex items-center gap-3 text-xs font-bold ${
            feedback.correct
              ? 'bg-secondary-100 text-secondary-800 border border-secondary-300 dark:bg-secondary-950/50 dark:text-secondary-200'
              : 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/50 dark:text-rose-200'
          }`}>
            {feedback.correct ? <CheckCircle2 className="w-5 h-5 text-secondary-600 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* 1. LETTERS MODULE */}
        {activity.category === 'letters' && !isCompleted && (
          <div className="py-6 space-y-6">
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {content.letters?.map((item: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => speakText(`${item.letter}. ${item.example}`)}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:shadow-glow-blue transition-all group flex flex-col items-center"
                >
                  <span className="text-3xl sm:text-4xl">{item.image}</span>
                  <span className="text-2xl sm:text-3xl font-black text-primary-600 dark:text-primary-400 mt-2">
                    {item.letter}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 mt-1">{item.word}</span>
                  <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-primary-500 mt-2" />
                </button>
              ))}
            </div>

            {content.exercises && (
              <div className="p-6 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-300">
                    Pregunta {currentStep + 1} de {content.exercises.length}
                  </span>
                  {content.exercises[currentStep]?.image && (
                    <span className="text-3xl">{content.exercises[currentStep].image}</span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-4">
                  {content.exercises[currentStep]?.question}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {content.exercises[currentStep]?.options.map((opt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => {
                        const isCorrect = opt === content.exercises[currentStep].correct;
                        if (isCorrect) {
                          setFeedback({ correct: true, text: `¡Correcto! ${opt} es la respuesta indicada.` });
                          setScore(prev => prev + 5);
                          speakText(`¡Muy bien! ${opt}`);
                        } else {
                          setFeedback({ correct: false, text: `Casi lo logras. La respuesta correcta era ${content.exercises[currentStep].correct}.` });
                        }

                        setTimeout(() => {
                          setFeedback(null);
                          if (currentStep + 1 < content.exercises.length) {
                            setCurrentStep(prev => prev + 1);
                          } else {
                            handleFinishActivity(score + (isCorrect ? 5 : 0), 15, isCorrect ? 100 : 75, 35);
                          }
                        }, 1600);
                      }}
                      className="p-4 rounded-xl font-extrabold text-sm sm:text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-all text-slate-800 dark:text-slate-100 shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. SYLLABLES MODULE */}
        {activity.category === 'syllables' && !isCompleted && (
          <div className="py-6 space-y-6">
            {content.exercises && (
              <div>
                <div className="text-center mb-6">
                  <span className="text-5xl">{content.exercises[currentStep]?.image}</span>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mt-2">
                    Palabra objetivo: {content.exercises[currentStep]?.targetWord}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Haz clic en las sílabas en el orden correcto para armar la palabra:
                  </p>
                </div>

                {/* Assembled Syllables Slot */}
                <div className="flex items-center justify-center gap-3 my-6 min-h-[60px]">
                  {content.exercises[currentStep]?.syllablesNeeded.map((_: any, idx: number) => {
                    const syl = assembledSyllables[idx];
                    return (
                      <div
                        key={idx}
                        className={`w-20 h-16 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                          syl
                            ? 'bg-secondary-500 text-white border-secondary-600 shadow-md'
                            : 'border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-400'
                        }`}
                      >
                        {syl || '?'}
                      </div>
                    );
                  })}
                </div>

                {/* Available Syllables Bank */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {content.exercises[currentStep]?.availableSyllables.map((syl: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => {
                        speakText(syl);
                        const nextAssembled = [...assembledSyllables, syl];
                        setAssembledSyllables(nextAssembled);

                        const needed = content.exercises[currentStep].syllablesNeeded;
                        if (nextAssembled.length === needed.length) {
                          const isCorrect = nextAssembled.join('') === needed.join('');
                          if (isCorrect) {
                            setFeedback({ correct: true, text: `¡Brillante! Has formado ${needed.join('')} con éxito.` });
                            setScore(prev => prev + 10);
                            speakText(`¡Genial! ${needed.join('')}`);
                          } else {
                            setFeedback({ correct: false, text: `Vuelve a intentar el orden correcto.` });
                          }

                          setTimeout(() => {
                            setFeedback(null);
                            setAssembledSyllables([]);
                            if (currentStep + 1 < content.exercises.length) {
                              setCurrentStep(prev => prev + 1);
                            } else {
                              handleFinishActivity(25, 25, 95, 40);
                            }
                          }, 1600);
                        }
                      }}
                      className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-secondary-500 text-slate-800 dark:text-white font-extrabold text-lg shadow-sm hover:scale-105 transition-all"
                    >
                      {syl}
                    </button>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={() => setAssembledSyllables([])}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar selección</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. SIGHT WORDS MODULE */}
        {activity.category === 'words' && !isCompleted && content.wordsList && (
          <div className="py-6 space-y-6 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 border border-amber-200 dark:border-slate-700 max-w-md mx-auto shadow-inner">
              <span className="text-6xl sm:text-7xl mb-4 block animate-bounce">
                {content.wordsList[flashcardIndex]?.icon}
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-widest text-slate-800 dark:text-white my-3">
                {content.wordsList[flashcardIndex]?.word}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {content.wordsList[flashcardIndex]?.hint}
              </p>

              <button
                onClick={() => speakText(content.wordsList[flashcardIndex]?.word)}
                className="mt-6 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-amber-500/20"
              >
                <Volume2 className="w-4 h-4" />
                <span>Escuchar Pronunciación</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  speakText(`¡Bien leído! ${content.wordsList[flashcardIndex]?.word}`);
                  setScore(prev => prev + 5);
                  if (flashcardIndex + 1 < content.wordsList.length) {
                    setFlashcardIndex(prev => prev + 1);
                  } else {
                    handleFinishActivity(30, 30, 100, 52);
                  }
                }}
                className="px-6 py-3 rounded-2xl bg-secondary-500 hover:bg-secondary-600 text-white font-extrabold text-sm shadow-lg shadow-secondary-500/25 flex items-center gap-2"
              >
                <ThumbsUp className="w-5 h-5" />
                <span>¡La leí correctamente! (+5 ⭐)</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. SENTENCE ORDERING MODULE */}
        {activity.category === 'sentences' && !isCompleted && content.sentences && (
          <div className="py-6 space-y-6">
            <div className="text-center">
              <span className="text-4xl mb-2 block">{content.sentences[currentStep]?.image}</span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Ordena las palabras para formar una oración correcta:
              </h3>
            </div>

            {/* Assembled Sentence Box */}
            <div className="min-h-[70px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-primary-300 dark:border-primary-800 flex items-center justify-center gap-2 flex-wrap">
              {assembledWords.length === 0 ? (
                <span className="text-xs text-slate-400 font-medium">Toca las palabras de abajo en el orden que corresponden...</span>
              ) : (
                assembledWords.map((word, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl bg-primary-500 text-white font-bold text-sm shadow-sm"
                  >
                    {word}
                  </span>
                ))
              )}
            </div>

            {/* Jumbled Words */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {content.sentences[currentStep]?.jumbledWords.map((w: string, idx: number) => {
                const isSelected = assembledWords.includes(w);
                return (
                  <button
                    key={idx}
                    disabled={isSelected}
                    onClick={() => {
                      speakText(w);
                      const next = [...assembledWords, w];
                      setAssembledWords(next);

                      const target = content.sentences[currentStep].correctSentence.replace('.', '');
                      const currentStr = next.join(' ').replace('.', '');

                      if (next.length === content.sentences[currentStep].jumbledWords.length) {
                        const isCorrect = currentStr === target;
                        if (isCorrect) {
                          setFeedback({ correct: true, text: '¡Excelente! Oración formada correctamente.' });
                          setScore(prev => prev + 12);
                          speakText(content.sentences[currentStep].correctSentence);
                        } else {
                          setFeedback({ correct: false, text: 'El orden no coincide con la oración correcta.' });
                        }

                        setTimeout(() => {
                          setFeedback(null);
                          setAssembledWords([]);
                          if (currentStep + 1 < content.sentences.length) {
                            setCurrentStep(prev => prev + 1);
                          } else {
                            handleFinishActivity(35, 35, 95, 46);
                          }
                        }, 1800);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl font-extrabold text-sm border transition-all ${
                      isSelected
                        ? 'opacity-40 border-slate-200 dark:border-slate-800'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:border-primary-500 shadow-sm'
                    }`}
                  >
                    {w}
                  </button>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setAssembledWords([])}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Borrar y volver a armar</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. STORY COMPREHENSION MODULE */}
        {activity.category === 'comprehension' && !isCompleted && content.paragraphs && (
          <div className="py-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Lectura Guiada • {content.wordCount} Palabras
                </span>
                <button
                  onClick={() => speakText(content.paragraphs.join(' '))}
                  className="px-3 py-1.5 rounded-xl bg-primary-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Escuchar Cuento</span>
                </button>
              </div>

              <div className="space-y-3 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200">
                {content.paragraphs.map((para: string, idx: number) => (
                  <p key={idx} className="indent-4">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Preguntas de Comprensión Lectora:
              </h3>

              {content.questions?.map((q: any, qIdx: number) => (
                <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase">
                    Pregunta {qIdx + 1} ({q.type === 'literal' ? 'Nivel Literal' : 'Nivel Inferencial'})
                  </p>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white mt-1 mb-3">
                    {q.question}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isChosen = comprehensionAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setComprehensionAnswers({ ...comprehensionAnswers, [q.id]: optIdx });
                          }}
                          className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                            isChosen
                              ? 'bg-primary-500 text-white border-primary-600 shadow-md'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    const totalQ = content.questions.length;
                    let correctCount = 0;
                    content.questions.forEach((q: any) => {
                      if (comprehensionAnswers[q.id] === q.correct) {
                        correctCount++;
                      }
                    });
                    const accuracy = Math.round((correctCount / totalQ) * 100);
                    const earned = Math.round((correctCount / totalQ) * 50);
                    handleFinishActivity(earned, 50, accuracy, 48);
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-secondary-500 hover:bg-secondary-600 text-white font-extrabold text-sm shadow-xl shadow-secondary-500/25 inline-flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Enviar Respuestas de Comprensión</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. GAMES MODULE (Memory Card Matching) */}
        {activity.category === 'games' && !isCompleted && (
          <div className="py-6 space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
              <span>Movimientos: {moves}</span>
              <span>Parejas Encontradas: {matchedIds.length} de 6</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
              {memoryCards.map((card, idx) => {
                const isFlipped = flippedIndices.includes(idx) || matchedIds.includes(card.matchId);
                return (
                  <button
                    key={card.id}
                    disabled={isFlipped}
                    onClick={() => {
                      if (flippedIndices.length === 2) return;
                      const nextFlipped = [...flippedIndices, idx];
                      setFlippedIndices(nextFlipped);

                      if (nextFlipped.length === 2) {
                        setMoves(prev => prev + 1);
                        const card1 = memoryCards[nextFlipped[0]];
                        const card2 = memoryCards[nextFlipped[1]];

                        if (card1.matchId === card2.matchId) {
                          setMatchedIds(prev => [...prev, card1.matchId]);
                          setFlippedIndices([]);
                          speakText(card1.type === 'text' ? card1.content : card2.content);
                          if (matchedIds.length + 1 === 6) {
                            handleFinishActivity(40, 40, 100, 50);
                          }
                        } else {
                          setTimeout(() => {
                            setFlippedIndices([]);
                          }, 1000);
                        }
                      }
                    }}
                    className={`h-24 sm:h-28 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isFlipped
                        ? 'bg-white dark:bg-slate-700 border-2 border-accent-500 text-slate-800 dark:text-white rotate-0'
                        : 'bg-gradient-to-br from-primary-500 to-indigo-600 text-white cursor-pointer hover:brightness-105'
                    }`}
                  >
                    {isFlipped ? (
                      card.type === 'image' ? <span className="text-3xl">{card.content}</span> : card.content
                    ) : (
                      <Sparkles className="w-6 h-6 text-white/60" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* COMPLETION MODAL */}
        {isCompleted && (
          <div className="text-center py-10 space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-secondary-100 text-secondary-600 mx-auto flex items-center justify-center text-4xl shadow-glow-green">
              🏆
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white">
                ¡Misión Cumplida!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Completaste "{activity.title}" y tus logros se han guardado en el sistema.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <p className="text-[10px] font-bold text-amber-600 uppercase">Estrellas</p>
                <p className="text-2xl font-black text-amber-600 mt-1">+{activity.points} ⭐</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary-50 dark:bg-secondary-950/40 border border-secondary-200 dark:border-secondary-800">
                <p className="text-[10px] font-bold text-secondary-600 uppercase">Precisión</p>
                <p className="text-2xl font-black text-secondary-600 mt-1">95%</p>
              </div>
              <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800">
                <p className="text-[10px] font-bold text-primary-600 uppercase">Fluidez</p>
                <p className="text-2xl font-black text-primary-600 mt-1">45 PPM</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <Link
                to="/activities"
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Elegir Otra Actividad
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold shadow-lg shadow-primary-500/25 flex items-center gap-2"
              >
                <span>Ir a mi Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
