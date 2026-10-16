import React from 'react';
import { Volume2, VolumeX, HelpCircle, BarChart2, Shield, Flame, Terminal, Home, BookOpen } from 'lucide-react';
import { GameState } from '../types/game';
import { getPlayerLevel, getLevelProgress } from '../utils/gameState';
import { sounds } from '../utils/sound';

interface HeaderProps {
  gameState: GameState;
  activePhase: number | null; // null = home, 1 = wordle, 2 = image, 3 = netfix
  onNavigatePhase: (phase: number | null) => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onOpenEncyclopedia?: () => void;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameState,
  activePhase,
  onNavigatePhase,
  onOpenHowToPlay,
  onOpenStats,
  onOpenEncyclopedia,
  onToggleSound
}) => {
  const level = getPlayerLevel(gameState.xp);
  const progress = getLevelProgress(gameState.xp);

  return (
    <header className="sticky top-0 z-40 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigatePhase(null)}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-950/40 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white flex items-center gap-1.5">
                SERVER<span className="text-cyan-400">DLE</span>
              </span>
              <span className="hidden sm:block text-[11px] text-slate-400 -mt-1 font-mono">
                Redes & SGBDs
              </span>
            </div>
          </button>
        </div>

        {/* Phase Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => onNavigatePhase(null)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activePhase === null
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Início
          </button>

          <button
            onClick={() => onNavigatePhase(1)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activePhase === 1
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            1. WordDLE
            {gameState.completedWordles.length > 0 && (
              <span className="text-[10px] font-mono text-cyan-400/80 ml-0.5">
                ({gameState.completedWordles.length})
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (gameState.unlockedStages.includes(2)) {
                onNavigatePhase(2);
              } else {
                sounds.playError();
              }
            }}
            disabled={!gameState.unlockedStages.includes(2)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activePhase === 2
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : gameState.unlockedStages.includes(2)
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 opacity-60 cursor-not-allowed'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                gameState.unlockedStages.includes(2) ? 'bg-purple-400' : 'bg-slate-600'
              }`}
            />
            2. ImageDLE
            {!gameState.unlockedStages.includes(2) && (
              <span className="text-[10px] uppercase font-mono ml-0.5 text-slate-500">🔒</span>
            )}
            {gameState.completedImages.length > 0 && (
              <span className="text-[10px] font-mono text-purple-400/80 ml-0.5">
                ({gameState.completedImages.length})
              </span>
            )}
          </button>

          <button
            onClick={() => {
              if (gameState.unlockedStages.includes(3)) {
                onNavigatePhase(3);
              } else {
                sounds.playError();
              }
            }}
            disabled={!gameState.unlockedStages.includes(3)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activePhase === 3
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : gameState.unlockedStages.includes(3)
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 opacity-60 cursor-not-allowed'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                gameState.unlockedStages.includes(3) ? 'bg-emerald-400' : 'bg-slate-600'
              }`}
            />
            3. NetSim (Lab)
            {!gameState.unlockedStages.includes(3) && (
              <span className="text-[10px] uppercase font-mono ml-0.5 text-slate-500">🔒</span>
            )}
            {gameState.completedSimulations.length > 0 && (
              <span className="text-[10px] font-mono text-emerald-400/80 ml-0.5">
                ({gameState.completedSimulations.length}/7)
              </span>
            )}
          </button>
        </nav>

        {/* Player Stats & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Streak indicator */}
          {gameState.currentStreak > 0 && (
            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs font-bold font-mono"
              title="Sequência de acertos atual"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{gameState.currentStreak}x</span>
            </div>
          )}

          {/* Level & XP */}
          <div className="hidden lg:flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-white">{level}</span>
              <span className="text-slate-400 font-mono">· {gameState.xp} XP</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSound}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title={gameState.soundEnabled ? 'Silenciar áudio' : 'Ativar áudio'}
              aria-label="Controle de som"
            >
              {gameState.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {onOpenEncyclopedia && (
              <button
                onClick={onOpenEncyclopedia}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-300 hover:text-white hover:border-purple-500/50 transition-colors"
                title="Enciclopédia de Redes & SGBDs"
                aria-label="Abrir enciclopédia"
              >
                <BookOpen className="w-4 h-4 text-purple-400" />
              </button>
            )}

            <button
              onClick={onOpenHowToPlay}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Como jogar"
              aria-label="Instruções do jogo"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenStats}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 rounded-lg transition-colors flex items-center gap-1.5"
              aria-label="Abrir estatísticas"
            >
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Estatísticas</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
