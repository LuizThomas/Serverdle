import { LetterStatus } from '../types/game';

// Normalize Brazilian Portuguese characters: removes accents, uppercase
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
}

// Authentic Wordle letter evaluation with strict duplicate letter handling
export function evaluateWordleGuess(guess: string, solution: string): LetterStatus[] {
  const normGuess = normalizeText(guess);
  const normSolution = normalizeText(solution);
  const length = normSolution.length;
  const result: LetterStatus[] = Array(length).fill('absent');

  // Count available frequencies of each letter in solution
  const availableLetters: Record<string, number> = {};
  for (let i = 0; i < length; i++) {
    const char = normSolution[i];
    availableLetters[char] = (availableLetters[char] || 0) + 1;
  }

  // Pass 1: Mark exact matches ('correct' / green)
  for (let i = 0; i < length; i++) {
    if (normGuess[i] === normSolution[i]) {
      result[i] = 'correct';
      availableLetters[normGuess[i]] -= 1;
    }
  }

  // Pass 2: Mark present matches ('present' / yellow) and absences ('absent' / gray)
  for (let i = 0; i < length; i++) {
    if (result[i] === 'correct') continue;

    const char = normGuess[i];
    if (char && availableLetters[char] && availableLetters[char] > 0) {
      result[i] = 'present';
      availableLetters[char] -= 1;
    } else {
      result[i] = 'absent';
    }
  }

  return result;
}
