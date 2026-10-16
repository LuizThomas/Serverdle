import React, { useState, useEffect } from 'react';
import { GameState, Achievement } from './types/game';
import {
  loadGameState,
  saveGameState,
  checkAndUnlockAchievements,
  getInitialGameState
} from './utils/gameState';
import { sounds } from './utils/sound';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { WordleView } from './components/WordleView';
import { ImageDLEView } from './components/ImageDLEView';
import { NetworkLabSimulatorView } from './components/NetworkLabSimulatorView';
import { HowToPlayModal } from './components/HowToPlayModal';
import { FinalResultsModal } from './components/FinalResultsModal';
import { NetworkEncyclopediaModal } from './components/NetworkEncyclopediaModal';
import { AchievementToast } from './components/AchievementToast';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());
  const [activePhase, setActivePhase] = useState<number | null>(null); // null = Home
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState<boolean>(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    saveGameState(gameState);
    sounds.enabled = gameState.soundEnabled;
  }, [gameState]);

  // Unlock achievements helper
  const triggerAchievementCheck = (
    stateToEvaluate: GameState,
    meta?: { isPerfectSimulation?: boolean; isBackupSimulation?: boolean }
  ) => {
    const { updatedState, newlyUnlocked } = checkAndUnlockAchievements(stateToEvaluate, meta);
    if (newlyUnlocked.length > 0) {
      sounds.playFanfare();
      // Show first unlocked achievement toast
      setCurrentAchievement(newlyUnlocked[0]);
    }
    return updatedState;
  };

  // WordLE challenge completion handler
  const handleWordleComplete = (
    challengeId: string,
    won: boolean,
    xpEarned: number,
    hintsRevealed: number,
    attempts: number,
    solution: string,
    lastGuess: string,
    explanation: string
  ) => {
    setGameState(prev => {
      const alreadyCompleted = prev.completedWordles.includes(challengeId);
      const newCompleted = won && !alreadyCompleted ? [...prev.completedWordles, challengeId] : prev.completedWordles;

      // Unlock stage 2 if at least 1 wordle completed
      const newUnlockedStages = [...prev.unlockedStages];
      if (won && !newUnlockedStages.includes(2)) {
        newUnlockedStages.push(2);
      }

      const newStreak = won ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, newStreak);
      const addedXp = !alreadyCompleted ? xpEarned : 0;

      const newMistakes = !won
        ? [
            ...prev.mistakesHistory,
            {
              phase: 'WordDLE' as const,
              challengeTitle: `Palavra: ${solution}`,
              userAnswer: lastGuess,
              correctAnswer: solution,
              explanation
            }
          ]
        : prev.mistakesHistory;

      const interimState: GameState = {
        ...prev,
        xp: prev.xp + addedXp,
        currentStreak: newStreak,
        bestStreak,
        completedWordles: newCompleted,
        unlockedStages: newUnlockedStages,
        wordleAttemptsRecord: {
          ...prev.wordleAttemptsRecord,
          [challengeId]: attempts
        },
        revealedHints: {
          ...prev.revealedHints,
          [challengeId]: hintsRevealed
        },
        mistakesHistory: newMistakes
      };

      return triggerAchievementCheck(interimState);
    });
  };

  // ImageDLE challenge completion handler
  const handleImageComplete = (
    challengeId: string,
    won: boolean,
    xpEarned: number,
    chosenAnswer: string,
    correctAnswer: string,
    explanation: string
  ) => {
    setGameState(prev => {
      const alreadyCompleted = prev.completedImages.includes(challengeId);
      const newCompleted = won && !alreadyCompleted ? [...prev.completedImages, challengeId] : prev.completedImages;

      // Unlock stage 3 if at least 1 image completed
      const newUnlockedStages = [...prev.unlockedStages];
      if (won && !newUnlockedStages.includes(3)) {
        newUnlockedStages.push(3);
      }

      const newStreak = won ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, newStreak);
      const addedXp = !alreadyCompleted ? xpEarned : 0;

      const newMistakes = !won
        ? [
            ...prev.mistakesHistory,
            {
              phase: 'ImageDLE' as const,
              challengeTitle: `Dispositivo: ${correctAnswer}`,
              userAnswer: chosenAnswer,
              correctAnswer,
              explanation
            }
          ]
        : prev.mistakesHistory;

      const interimState: GameState = {
        ...prev,
        xp: prev.xp + addedXp,
        currentStreak: newStreak,
        bestStreak,
        completedImages: newCompleted,
        unlockedStages: newUnlockedStages,
        mistakesHistory: newMistakes
      };

      return triggerAchievementCheck(interimState);
    });
  };

  // NetSim simulation module completion handler
  const handleSimulationComplete = (
    moduleId: string,
    won: boolean,
    xpEarned: number,
    explanation: string
  ) => {
    setGameState(prev => {
      const alreadyCompleted = prev.completedSimulations.includes(moduleId);
      const newCompleted = won && !alreadyCompleted ? [...prev.completedSimulations, moduleId] : prev.completedSimulations;

      const newStreak = won ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, newStreak);
      const addedXp = !alreadyCompleted ? xpEarned : 0;

      const isBackupModule = moduleId === 'sim_backup_restore_drill';

      const interimState: GameState = {
        ...prev,
        xp: prev.xp + addedXp,
        currentStreak: newStreak,
        bestStreak,
        completedSimulations: newCompleted,
        totalSimulationsRun: prev.totalSimulationsRun + 1
      };

      return triggerAchievementCheck(interimState, {
        isPerfectSimulation: won,
        isBackupSimulation: isBackupModule
      });
    });
  };

  const handleResetGame = () => {
    const fresh = getInitialGameState();
    setGameState(fresh);
    saveGameState(fresh);
    setActivePhase(null);
  };

  const handleToggleSound = () => {
    setGameState(prev => {
      const newSound = !prev.soundEnabled;
      sounds.enabled = newSound;
      return { ...prev, soundEnabled: newSound };
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Application Header */}
      <Header
        gameState={gameState}
        activePhase={activePhase}
        onNavigatePhase={phase => setActivePhase(phase)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
        onToggleSound={handleToggleSound}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activePhase === null && (
          <HomeView
            gameState={gameState}
            onSelectPhase={phase => setActivePhase(phase)}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            onOpenStats={() => setIsStatsOpen(true)}
            onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
          />
        )}

        {activePhase === 1 && (
          <WordleView
            gameState={gameState}
            onChallengeComplete={handleWordleComplete}
            onNavigatePhase={phase => setActivePhase(phase)}
          />
        )}

        {activePhase === 2 && (
          <ImageDLEView
            gameState={gameState}
            onChallengeComplete={handleImageComplete}
            onNavigatePhase={phase => setActivePhase(phase)}
          />
        )}

        {activePhase === 3 && (
          <NetworkLabSimulatorView
            gameState={gameState}
            onSimulationComplete={handleSimulationComplete}
            onNavigatePhase={phase => setActivePhase(phase)}
          />
        )}
      </main>

      {/* Persistent Quiet Educational Footer */}
      <footer className="border-t border-slate-900/80 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <span>ServerDLE · Servidores de Banco de Dados & Redes de Computadores</span>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsEncyclopediaOpen(true)}
              className="hover:text-purple-400 transition-colors"
            >
              Guia de Redes
            </button>
            <span>·</span>
            <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Manual de Instruções
            </button>
            <span>·</span>
            <button
              onClick={() => setIsStatsOpen(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Quadro de Desempenho
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <NetworkEncyclopediaModal
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
        onSelectPhase={phase => {
          setActivePhase(phase);
          setIsEncyclopediaOpen(false);
        }}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <FinalResultsModal
        isOpen={isStatsOpen}
        gameState={gameState}
        onClose={() => setIsStatsOpen(false)}
        onResetGame={handleResetGame}
        onSelectPhase={phase => {
          setActivePhase(phase);
          setIsStatsOpen(false);
        }}
      />

      <AchievementToast
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
    </div>
  );
}
