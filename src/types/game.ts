export type PlayerLevel = 'Novato' | 'Técnico' | 'Especialista' | 'Mestre das Redes';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface WordleChallenge {
  id: string;
  word: string;
  category: 'Redes' | 'Banco de Dados' | 'Segurança' | 'Protocolos' | 'Hardware';
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  primaryClue: string;
  optionalHints: string[];
  explanation: string;
  baseXp: number;
}

export interface ImageChallenge {
  id: string;
  deviceName: string;
  imagePath: string;
  category: 'Hardware' | 'Redes' | 'Armazenamento' | 'Infraestrutura' | 'Segurança';
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  fallbackIcon: string;
  baseXp: number;
}

export interface SimulationModule {
  id: string;
  title: string;
  subtitle: string;
  category: 'Protocolos & Conexões' | 'Resolução & DNS' | 'Segurança & Firewall' | 'SGBD & Transações' | 'Performance & Tuning' | 'Concorrência & Pools' | 'Backup & Continuidade';
  icon: string;
  description: string;
  keyConcepts: string[];
  baseXp: number;
  quizQuestion: string;
  quizOptions: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface GameState {
  xp: number;
  currentStreak: number;
  bestStreak: number;
  unlockedStages: number[];
  completedWordles: string[];
  completedImages: string[];
  completedSimulations: string[];
  wordleAttemptsRecord: Record<string, number>;
  revealedHints: Record<string, number>;
  mistakesHistory: {
    phase: 'WordDLE' | 'ImageDLE' | 'NetSim';
    challengeTitle: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
  achievements: Achievement[];
  soundEnabled: boolean;
  startedAt: string;
  totalSimulationsRun: number;
}
