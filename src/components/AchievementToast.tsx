import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Flame, Target, Cpu, CheckCircle, ShieldCheck, Trophy, X } from 'lucide-react';
import { Achievement } from '../types/game';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (achievement) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85, x: 0.85 },
          colors: ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b']
        });
      } catch {}

      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'target':
        return <Target className="w-6 h-6 text-emerald-400" />;
      case 'flame':
        return <Flame className="w-6 h-6 text-amber-400" />;
      case 'cpu':
        return <Cpu className="w-6 h-6 text-cyan-400" />;
      case 'check-circle':
        return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case 'shield-check':
        return <ShieldCheck className="w-6 h-6 text-purple-400" />;
      case 'trophy':
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      default:
        return <Award className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-4 shadow-2xl shadow-cyan-950/50 animate-bounce duration-500">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60 shrink-0">
          {renderIcon(achievement.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Conquista Desbloqueada!
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-sm font-bold text-white mt-0.5 truncate">{achievement.title}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
};
