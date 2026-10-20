import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { speechService } from '../../services/speech';
import {
  Sparkles,
  Flame,
  Star,
  Trophy,
  Volume2,
  Play,
  ArrowRight,
  BookOpen,
  Gamepad2,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const StudentDashboard: React.FC = () => {
  const { studentProfile } = useAuth();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const student = studentProfile || {
    id: 1,
    first_name: 'Almudena',
    last_name: 'Gomez Nina',
    avatar: '🦊',
    reading_level: 'Básico',
    streak_days: 6,
    total_stars: 160,
    grade: '1° Primaria'
  };

  const handlePlayGreeting = () => {
    setIsPlayingAudio(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    speechService.speak(
      `¡Hola, ${student.first_name}! ¡Qué alegría verte en Yachay Lee! Hoy es un gran día para descubrir nuevas palabras y ganar muchas estrellas. ¿Listo para leer?`,
      {
        rate: 0.9,
        pitch: 1.15,
        onEnd: () => setIsPlayingAudio(false)
      }
    );
  };

  const activityAdventures = [
    {
      id: 1,
      title: '1. Reconocimiento de Letras',
      subtitle: 'Descubre los sonidos y las formas mágicas',
      category: 'letters',
      icon: '🔤',
      color: 'from-blue-500 to-indigo-600',
      tag: 'Fonemas y Vocales',
      stars: 20
    },
    {
      id: 2,
      title: '2. Sílabas Mágicas',
      subtitle: 'Arma sílabas con palmadas y ritmo',
      category: 'syllables',
      icon: '🧩',
      color: 'from-emerald-500 to-teal-600',
      tag: 'Construcción Silábica',
      stars: 25
    },
    {
      id: 3,
      title: '3. Palabras en Acción',
      subtitle: 'Reconoce palabras veloces como un lince',
      category: 'words',
      icon: '⚡',
      color: 'from-amber-500 to-orange-500',
      tag: 'Lectura Rápida',
      stars: 30
    },
    {
      id: 4,
      title: '4. Oraciones Divertidas',
      subtitle: 'Ordena palabras y crea historias',
      category: 'sentences',
      icon: '✍️',
      color: 'from-purple-500 to-pink-500',
      tag: 'Estructura Oracional',
      stars: 35
    },
    {
      id: 5,
      title: '5. Cuentos y Comprensión',
      subtitle: 'El Colibrí Valiente y la Montaña Dorada',
      category: 'comprehension',
      icon: '📖',
      color: 'from-rose-500 to-red-500',
      tag: 'Cuento Ilustrado',
      stars: 50
    },
    {
      id: 6,
      title: '6. Juegos Interactivos',
      subtitle: 'Memoria de cartas y atrapa la sílaba',
      category: 'games',
      icon: '🎮',
      color: 'from-cyan-500 to-blue-600',
      tag: 'Lúdico y Desafíos',
      stars: 40
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Kid Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-accent-500 via-orange-500 to-secondary-500 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl sm:text-6xl shadow-inner border-2 border-white/40 animate-float">
              {student.avatar || '🦊'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/25 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Nivel Lector: {student.reading_level}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                ¡Hola, {student.first_name}! 🚀
              </h1>
              <p className="text-xs sm:text-sm text-orange-100 font-medium mt-0.5">
                ¿Qué aventura de lectura exploraremos hoy?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayGreeting}
              disabled={isPlayingAudio}
              className="px-5 py-3 rounded-2xl bg-white text-orange-600 font-extrabold text-xs sm:text-sm hover:bg-orange-50 active:scale-95 transition-all shadow-lg flex items-center gap-2"
            >
              <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce text-orange-500' : ''}`} />
              <span>{isPlayingAudio ? '¡Hablando...!' : 'Escuchar Voz de Yachay'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reward Badges Bar */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-500 flex items-center justify-center text-2xl">
            ⭐
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Mis Estrellas</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{student.total_stars}</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-500 flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Racha Diaria</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{student.streak_days} Días</p>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600 flex items-center justify-center text-2xl">
            🏆
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Medallas</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">4 Ganadas</p>
          </div>
        </div>
      </div>

      {/* Adventures Grid (6 Modules) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-500" />
              <span>Mi Ruta del Saber - Actividades de Lectura</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completa cada misión interactiva para ganar estrellas y subir de nivel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {activityAdventures.map((adv) => (
            <div
              key={adv.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${adv.color} text-white flex items-center justify-center text-2xl shadow-md`}>
                    {adv.icon}
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                    +{adv.stars} ⭐
                  </span>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  {adv.tag}
                </span>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                  {adv.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {adv.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700">
                <Link
                  to={`/activities/${adv.id}`}
                  className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs bg-gradient-to-r ${adv.color} hover:brightness-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Jugar y Leer Ahora</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
