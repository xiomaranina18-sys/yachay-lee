import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { GamificationProfile } from '../../types';
import { DuoButton } from '../../components/common/DuoButton';
import confetti from 'canvas-confetti';
import {
  Award,
  Sparkles,
  Trophy,
  Flame,
  Star,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Target,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const GamificationPage: React.FC = () => {
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'badges' | 'goals' | 'store'>('badges');
  const [purchaseMsg, setPurchaseMsg] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    api.gamification.getProfile()
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimGoal = async (goalId: number) => {
    try {
      const res = await api.gamification.claimGoal(goalId, profile?.studentId || 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      alert(res.message);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al reclamar meta');
    }
  };

  const handlePurchaseItem = async (itemId: number) => {
    try {
      const res = await api.gamification.purchaseItem(itemId, profile?.studentId || 1);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setPurchaseMsg(res.message);
      setTimeout(() => setPurchaseMsg(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al canjear elemento');
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tierColors = {
    Bronce: 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
    Plata: 'border-slate-400 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    Oro: 'border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-200',
    Diamante: 'border-cyan-400 bg-cyan-50 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200'
  };

  const xpPercent = Math.round((profile.xpInLevel / profile.nextLevelXP) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Gamification Hero Card (Duolingo Style) */}
      <div className="rounded-3xl bg-gradient-to-r from-accent-500 via-orange-500 to-secondary-500 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl border-2 border-white/40 shadow-inner">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase bg-white/25">
                  Nivel {profile.level}
                </span>
                <span className="text-xs font-bold text-amber-100">
                  {profile.rankTitle}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {profile.studentName}
              </h1>
              <p className="text-xs text-orange-100 mt-0.5">
                {profile.totalXP} XP totales acumulados
              </p>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white text-slate-800 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{profile.totalStars} Estrellas</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white text-slate-800 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{profile.streakDays} Días Racha</span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-xs font-black mb-1.5">
            <span>Progreso hacia Nivel {profile.level + 1}</span>
            <span>{profile.xpInLevel} / {profile.nextLevelXP} XP ({xpPercent}%)</span>
          </div>
          <div className="w-full h-4 rounded-full bg-black/20 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-white transition-all duration-500 shadow-sm"
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === 'badges'
              ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Insignias y Medallas ({profile.badges.filter(b => b.unlocked).length}/{profile.badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === 'goals'
              ? 'bg-secondary-500 text-white shadow-md shadow-secondary-500/25'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Metas Semanales</span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === 'store'
              ? 'bg-accent-500 text-white shadow-md shadow-accent-500/25'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Tienda de Recompensas</span>
        </button>
      </div>

      {purchaseMsg && (
        <div className="p-4 rounded-2xl bg-secondary-100 text-secondary-800 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-secondary-600" />
          <span>{purchaseMsg}</span>
        </div>
      )}

      {/* 1. BADGES TAB */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.badges.map((badge) => {
            const isUnlocked = badge.unlocked;
            const tColor = tierColors[badge.tier] || tierColors.Bronce;
            const percent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

            return (
              <div
                key={badge.id}
                className={`p-6 rounded-3xl border-2 transition-all duration-200 flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-800 border-primary-300 dark:border-primary-800 shadow-md'
                    : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40'
                        : 'bg-slate-200 dark:bg-slate-800 grayscale'
                    }`}>
                      {badge.icon}
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${tColor}`}>
                      Rango {badge.tier}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-800 dark:text-white">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                    <span>{isUnlocked ? '¡Desbloqueada!' : 'En progreso'}</span>
                    <span>{badge.progress} / {badge.maxProgress}</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-secondary-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>

                  <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 mt-2">
                    +{badge.rewardXP} XP de recompensa
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. WEEKLY GOALS TAB */}
      {activeTab === 'goals' && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">
              Objetivos de la Semana
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cumple cada meta para reclamar estrellas ⭐ extras para la tienda de recompensas
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {profile.weeklyGoals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));

              return (
                <div key={goal.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                        {goal.title}
                      </h4>
                      {goal.completed && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300">
                          Completada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {goal.description}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 max-w-xs h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${goal.completed ? 'bg-secondary-500' : 'bg-primary-500'}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                  </div>

                  <div>
                    {goal.completed ? (
                      <DuoButton
                        variant="green"
                        size="sm"
                        onClick={() => handleClaimGoal(goal.id)}
                        icon={<Sparkles className="w-3.5 h-3.5" />}
                      >
                        Reclamar +{goal.rewardStars} ⭐
                      </DuoButton>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        +{goal.rewardStars} ⭐ al completar
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. REWARDS STORE TAB */}
      {activeTab === 'store' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white">
                Tienda de Recompensas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Canjea tus estrellas ganadas por avatares, marcos y fondos especiales
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-black text-xs flex items-center gap-1.5 shadow-sm">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>Balance: {profile.totalStars} ⭐</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profile.storeItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between text-center"
              >
                <div>
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center text-4xl shadow-inner mb-3">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    {item.category}
                  </span>
                  <h3 className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                    {item.name}
                  </h3>
                </div>

                <div className="mt-5">
                  {item.unlocked ? (
                    <div className="py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 text-xs font-black flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary-500" />
                      <span>Desbloqueado</span>
                    </div>
                  ) : (
                    <DuoButton
                      variant="orange"
                      size="sm"
                      fullWidth
                      onClick={() => handlePurchaseItem(item.id)}
                      disabled={profile.totalStars < item.costStars}
                      icon={<Star className="w-3.5 h-3.5" />}
                    >
                      {item.costStars} ⭐ Canjear
                    </DuoButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
