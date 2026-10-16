import React, { useState, useEffect, useCallback } from 'react';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ChevronRight,
  BookOpen,
  Delete,
  CornerDownLeft
} from 'lucide-react';
import { WordleChallenge, LetterStatus, GameState } from '../types/game';
import { WORDLE_CHALLENGES } from '../data/wordleChallenges';
import { evaluateWordleGuess, normalizeText } from '../utils/wordleUtils';
import { sounds } from '../utils/sound';

interface WordleViewProps {
  gameState: GameState;
  onChallengeComplete: (
    challengeId: string,
    won: boolean,
    xpEarned: number,
    hintsRevealed: number,
    attempts: number,
    solution: string,
    lastGuess: string,
    explanation: string
  ) => void;
  onNavigatePhase: (phase: number | null) => void;
}

export const WordleView: React.FC<WordleViewProps> = ({
  gameState,
  onChallengeComplete,
  onNavigatePhase
}) => {
  // Select first uncompleted challenge or first one
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(() => {
    const uncompletedIdx = WORDLE_CHALLENGES.findIndex(
      c => !gameState.completedWordles.includes(c.id)
    );
    return uncompletedIdx !== -1 ? uncompletedIdx : 0;
  });

  const challenge = WORDLE_CHALLENGES[currentChallengeIndex] || WORDLE_CHALLENGES[0];
  const targetWord = normalizeText(challenge.word);
  const wordLength = targetWord.length;

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [revealedHintCount, setRevealedHintCount] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [shakeRow, setShakeRow] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [xpEarnedThisRound, setXpEarnedThisRound] = useState<number>(0);

  // Reset state when challenge changes
  useEffect(() => {
    setGuesses([]);
    setCurrentGuess('');
    setRevealedHintCount(0);
    setIsGameOver(false);
    setHasWon(false);
    setStatusMessage('');
    setModalOpen(false);
    setXpEarnedThisRound(0);
  }, [challenge.id]);

  // Compute key statuses for the virtual keyboard
  const keyStatuses: Record<string, LetterStatus> = {};
  guesses.forEach(guess => {
    const evaluation = evaluateWordleGuess(guess, targetWord);
    for (let i = 0; i < guess.length; i++) {
      const char = guess[i];
      const status = evaluation[i];
      const current = keyStatuses[char];
      if (status === 'correct') {
        keyStatuses[char] = 'correct';
      } else if (status === 'present' && current !== 'correct') {
        keyStatuses[char] = 'present';
      } else if (status === 'absent' && !current) {
        keyStatuses[char] = 'absent';
      }
    }
  });

  // Calculate XP
  const calculateXp = (attemptsUsed: number, hintsUsed: number): number => {
    // 1 attempt: 100 XP, 2: 85, 3: 70, 4: 55, 5: 40, 6: 25
    const baseTable: Record<number, number> = {
      1: 100,
      2: 85,
      3: 70,
      4: 55,
      5: 40,
      6: 25
    };
    const base = baseTable[attemptsUsed] || 25;
    const penalty = hintsUsed * 15;
    return Math.max(15, base - penalty);
  };

  const submitGuess = useCallback(() => {
    if (isGameOver) return;

    const trimmedGuess = normalizeText(currentGuess);
    if (trimmedGuess.length !== wordLength) {
      sounds.playError();
      setStatusMessage(`A palavra precisa ter exatamente ${wordLength} letras.`);
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 500);
      return;
    }

    sounds.playTileFlip();
    const newGuesses = [...guesses, trimmedGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');
    setStatusMessage('');

    if (trimmedGuess === targetWord) {
      // Won!
      const xp = calculateXp(newGuesses.length, revealedHintCount);
      setHasWon(true);
      setIsGameOver(true);
      setXpEarnedThisRound(xp);
      sounds.playCorrect();
      setTimeout(() => {
        setModalOpen(true);
      }, 700);

      onChallengeComplete(
        challenge.id,
        true,
        xp,
        revealedHintCount,
        newGuesses.length,
        targetWord,
        trimmedGuess,
        challenge.explanation
      );
    } else if (newGuesses.length >= 6) {
      // Lost
      setIsGameOver(true);
      setHasWon(false);
      setXpEarnedThisRound(0);
      sounds.playError();
      setTimeout(() => {
        setModalOpen(true);
      }, 700);

      onChallengeComplete(
        challenge.id,
        false,
        0,
        revealedHintCount,
        newGuesses.length,
        targetWord,
        trimmedGuess,
        challenge.explanation
      );
    }
  }, [currentGuess, isGameOver, wordLength, targetWord, guesses, challenge, revealedHintCount, onChallengeComplete]);

  const handleKeyPress = useCallback((key: string) => {
    if (isGameOver) return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE' || key === 'DEL') {
      sounds.playKeyTap();
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      if (currentGuess.length < wordLength) {
        sounds.playKeyTap();
        setCurrentGuess(prev => prev + key);
      }
    }
  }, [currentGuess, isGameOver, submitGuess, wordLength]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpen) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, modalOpen]);

  const handleRevealNextHint = () => {
    if (revealedHintCount < challenge.optionalHints.length) {
      sounds.playKeyTap();
      setRevealedHintCount(prev => prev + 1);
    }
  };

  const handleNextChallenge = () => {
    const nextIdx = (currentChallengeIndex + 1) % WORDLE_CHALLENGES.length;
    setCurrentChallengeIndex(nextIdx);
  };

  // Keyboard Rows layout
  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner & Navigation within WordLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
              Fase 1 — WordDLE
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              Desafio {currentChallengeIndex + 1} de {WORDLE_CHALLENGES.length}
            </span>
            {gameState.completedWordles.includes(challenge.id) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Concluído
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-white font-mono mt-0.5">
            Adivinhe o Conceito de Rede ou Banco
          </h2>
        </div>

        {/* Challenge selector dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={currentChallengeIndex}
            onChange={e => setCurrentChallengeIndex(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {WORDLE_CHALLENGES.map((ch, idx) => (
              <option key={ch.id} value={idx}>
                #{idx + 1} {ch.word} ({ch.category}) {gameState.completedWordles.includes(ch.id) ? '✓' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Technical Clue Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/20 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Pista Técnica Principal
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {challenge.category}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {challenge.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
              {wordLength} Letras
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
          "{challenge.primaryClue}"
        </p>

        {/* Optional hints area */}
        {challenge.optionalHints.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Pistas reveladas: {revealedHintCount}/{challenge.optionalHints.length}
              </span>
              {revealedHintCount < challenge.optionalHints.length && !isGameOver && (
                <button
                  onClick={handleRevealNextHint}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Revelar Dica Opcional (-15 XP)
                </button>
              )}
            </div>

            {revealedHintCount > 0 && (
              <div className="w-full space-y-1.5 pt-1">
                {challenge.optionalHints.slice(0, revealedHintCount).map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200"
                  >
                    💡 <strong>Dica {idx + 1}:</strong> {hint}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Warning or Tip */}
      {statusMessage && (
        <div className="text-center py-1.5 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold animate-pulse">
          {statusMessage}
        </div>
      )}

      {/* Dynamic Wordle Grid */}
      <div className="flex justify-center py-2">
        <div className={`grid gap-2 ${shakeRow ? 'animate-shake' : ''}`}>
          {Array.from({ length: 6 }).map((_, rowIndex) => {
            const isSubmitted = rowIndex < guesses.length;
            const isCurrentRow = rowIndex === guesses.length;
            const guess = isSubmitted ? guesses[rowIndex] : isCurrentRow ? currentGuess : '';
            const evaluation = isSubmitted ? evaluateWordleGuess(guess, targetWord) : [];

            return (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {Array.from({ length: wordLength }).map((_, colIndex) => {
                  const letter = guess[colIndex] || '';
                  const status = isSubmitted ? evaluation[colIndex] : 'empty';

                  let cellStyle =
                    'border-slate-800 bg-slate-900/60 text-slate-100 shadow-sm';

                  if (status === 'correct') {
                    cellStyle = 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-950/50';
                  } else if (status === 'present') {
                    cellStyle = 'bg-amber-500 text-white border-amber-400 shadow-amber-950/50';
                  } else if (status === 'absent') {
                    cellStyle = 'bg-slate-800 text-slate-400 border-slate-700';
                  } else if (letter) {
                    cellStyle = 'border-cyan-400/80 bg-slate-900 text-white scale-105';
                  }

                  return (
                    <div
                      key={colIndex}
                      className={`w-11 h-12 sm:w-13 sm:h-14 border-2 rounded-xl flex items-center justify-center font-mono text-xl sm:text-2xl font-black transition-all duration-200 select-none ${cellStyle}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action bar for desktop / quick submit */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={submitGuess}
          disabled={isGameOver || currentGuess.length !== wordLength}
          className={`px-6 py-2.5 rounded-xl font-bold font-mono text-xs transition-colors flex items-center gap-2 ${
            !isGameOver && currentGuess.length === wordLength
              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-lg shadow-cyan-950/40'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <CornerDownLeft className="w-4 h-4" />
          <span>Confirmar Palavra</span>
        </button>

        {isGameOver && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            Ver Explicação
          </button>
        )}
      </div>

      {/* Virtual On-screen Keyboard */}
      <div className="pt-2 max-w-xl mx-auto select-none space-y-1.5">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map(key => {
              const status = keyStatuses[key];
              const isAction = key === 'ENTER' || key === 'DEL';

              let keyBg = 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/60';
              if (status === 'correct') {
                keyBg = 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500';
              } else if (status === 'present') {
                keyBg = 'bg-amber-500 hover:bg-amber-400 text-white border-amber-400';
              } else if (status === 'absent') {
                keyBg = 'bg-slate-900/90 text-slate-500 border-slate-800 opacity-60';
              }

              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`h-11 sm:h-12 rounded-lg font-mono text-xs sm:text-sm font-bold transition-all active:scale-95 flex items-center justify-center shadow-sm ${
                    isAction ? 'px-3 sm:px-4 bg-slate-700 hover:bg-slate-600 text-slate-100' : 'w-8 sm:w-10'
                  } ${keyBg}`}
                  aria-label={key}
                >
                  {key === 'DEL' ? <Delete className="w-4 h-4" /> : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Round Complete Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-center">
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center">
              {hasWon ? (
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
                  <XCircle className="w-8 h-8" />
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                {hasWon ? 'Decifrado com Sucesso!' : 'Tentativas Esgotadas'}
              </span>
              <h3 className="text-2xl font-black text-white font-mono mt-1">
                A resposta era: <span className="text-cyan-400">{challenge.word}</span>
              </h3>
            </div>

            {/* Score Strip */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-slate-400 block">Tentativas</span>
                <span className="text-white font-mono font-bold text-sm mt-0.5">
                  {guesses.length} / 6
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Pistas</span>
                <span className="text-slate-300 font-mono font-bold text-sm mt-0.5">
                  {revealedHintCount}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">XP Ganho</span>
                <span className="text-cyan-400 font-mono font-bold text-sm mt-0.5">
                  +{xpEarnedThisRound} XP
                </span>
              </div>
            </div>

            {/* In-depth educational explanation */}
            <div className="text-left p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Explicação Técnica
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {challenge.explanation}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition-colors"
              >
                Revisar Tabuleiro
              </button>

              <button
                onClick={() => {
                  setModalOpen(false);
                  handleNextChallenge();
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold font-mono bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-2"
              >
                <span>Próximo Desafio</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
