import { Achievement, GameState, PlayerLevel } from '../types/game';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'Primeiro Acerto',
    description: 'Acerte seu primeiro desafio em qualquer uma das fases.',
    icon: 'target'
  },
  {
    id: 'streak_5',
    title: 'Sequência Imbatível',
    description: 'Mantenha uma sequência de 5 acertos consecutivos sem errar.',
    icon: 'flame'
  },
  {
    id: 'hardware_pro',
    title: 'Especialista em Dispositivos',
    description: 'Identifique com precisão 5 equipamentos de rede no ImageDLE.',
    icon: 'cpu'
  },
  {
    id: 'perfect_diagnosis',
    title: 'Mestre do Simulador',
    description: 'Complete uma simulação interativa de rede acertando o desafio de primeira.',
    icon: 'check-circle'
  },
  {
    id: 'backup_master',
    title: 'Mestre do Backup',
    description: 'Execute com sucesso a simulação de integridade, checksum e restauração.',
    icon: 'shield-check'
  },
  {
    id: 'complete_journey',
    title: 'Jornada Completa',
    description: 'Conclua com sucesso desafios nas três fases do ServerDLE.',
    icon: 'trophy'
  }
];

const STORAGE_KEY = 'serverdle_gamestate_v3';

export function getPlayerLevel(xp: number): PlayerLevel {
  if (xp >= 1600) return 'Mestre das Redes';
  if (xp >= 800) return 'Especialista';
  if (xp >= 300) return 'Técnico';
  return 'Novato';
}

export function getLevelProgress(xp: number): { current: number; max: number; percent: number; nextLevel: string } {
  if (xp >= 1600) {
    return { current: xp, max: 1600, percent: 100, nextLevel: 'Nível Máximo Alcançado!' };
  }
  if (xp >= 800) {
    const current = xp - 800;
    const max = 800;
    return { current, max, percent: Math.round((current / max) * 100), nextLevel: 'Mestre das Redes (1600 XP)' };
  }
  if (xp >= 300) {
    const current = xp - 300;
    const max = 500;
    return { current, max, percent: Math.round((current / max) * 100), nextLevel: 'Especialista (800 XP)' };
  }
  return { current: xp, max: 300, percent: Math.round((xp / 300) * 100), nextLevel: 'Técnico (300 XP)' };
}

export function getInitialGameState(): GameState {
  return {
    xp: 0,
    currentStreak: 0,
    bestStreak: 0,
    unlockedStages: [1], // Stage 1 starts unlocked
    completedWordles: [],
    completedImages: [],
    completedSimulations: [],
    wordleAttemptsRecord: {},
    revealedHints: {},
    mistakesHistory: [],
    achievements: INITIAL_ACHIEVEMENTS,
    soundEnabled: true,
    startedAt: new Date().toISOString(),
    totalSimulationsRun: 0
  };
}

export function loadGameState(): GameState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getInitialGameState();
    const parsed = JSON.parse(data) as GameState;
    const mergedAchievements = INITIAL_ACHIEVEMENTS.map(initialAch => {
      const existing = parsed.achievements?.find(a => a.id === initialAch.id);
      return existing || initialAch;
    });
    return {
      ...getInitialGameState(),
      ...parsed,
      completedSimulations: parsed.completedSimulations || (parsed as unknown as { completedMissions?: string[] }).completedMissions || [],
      achievements: mergedAchievements
    };
  } catch {
    return getInitialGameState();
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // LocalStorage protection
  }
}

export function checkAndUnlockAchievements(
  state: GameState,
  meta?: {
    isPerfectSimulation?: boolean;
    isBackupSimulation?: boolean;
  }
): { updatedState: GameState; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const updatedAchievements = state.achievements.map(ach => {
    if (ach.unlockedAt) return ach; // Already unlocked

    let shouldUnlock = false;

    if (ach.id === 'first_win') {
      shouldUnlock = (
        state.completedWordles.length > 0 ||
        state.completedImages.length > 0 ||
        state.completedSimulations.length > 0
      );
    } else if (ach.id === 'streak_5') {
      shouldUnlock = state.currentStreak >= 5;
    } else if (ach.id === 'hardware_pro') {
      shouldUnlock = state.completedImages.length >= 5;
    } else if (ach.id === 'perfect_diagnosis') {
      shouldUnlock = meta?.isPerfectSimulation === true;
    } else if (ach.id === 'backup_master') {
      shouldUnlock = meta?.isBackupSimulation === true;
    } else if (ach.id === 'complete_journey') {
      shouldUnlock = (
        state.completedWordles.length > 0 &&
        state.completedImages.length > 0 &&
        state.completedSimulations.length > 0
      );
    }

    if (shouldUnlock) {
      const unlockedItem = { ...ach, unlockedAt: new Date().toISOString() };
      newlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }

    return ach;
  });

  const updatedState: GameState = {
    ...state,
    achievements: updatedAchievements
  };

  return { updatedState, newlyUnlocked };
}
