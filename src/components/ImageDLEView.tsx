import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Shield,
  Server,
  Network,
  Cpu,
  HardDrive,
  Cable,
  Database,
  Monitor,
  Wifi,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ImageChallenge, GameState } from '../types/game';
import { IMAGE_CHALLENGES } from '../data/imageChallenges';
import { sounds } from '../utils/sound';

interface ImageDLEViewProps {
  gameState: GameState;
  onChallengeComplete: (
    challengeId: string,
    won: boolean,
    xpEarned: number,
    chosenAnswer: string,
    correctAnswer: string,
    explanation: string
  ) => void;
  onNavigatePhase: (phase: number | null) => void;
}

export const ImageDLEView: React.FC<ImageDLEViewProps> = ({
  gameState,
  onChallengeComplete,
  onNavigatePhase
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(() => {
    const uncompletedIdx = IMAGE_CHALLENGES.findIndex(
      c => !gameState.completedImages.includes(c.id)
    );
    return uncompletedIdx !== -1 ? uncompletedIdx : 0;
  });

  const challenge = IMAGE_CHALLENGES[currentIdx] || IMAGE_CHALLENGES[0];

  const [inputMode, setInputMode] = useState<'options' | 'typing'>('options');
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showExplanationModal, setShowExplanationModal] = useState<boolean>(false);

  const resetCurrent = (nextIndex: number) => {
    setCurrentIdx(nextIndex);
    setSelectedOption(null);
    setTypedAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setImageError(false);
    setShowExplanationModal(false);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    const correct = option.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);

    const xp = correct ? challenge.baseXp : 0;
    if (correct) {
      sounds.playCorrect();
    } else {
      sounds.playError();
    }

    onChallengeComplete(
      challenge.id,
      correct,
      xp,
      option,
      challenge.correctAnswer,
      challenge.explanation
    );

    setTimeout(() => {
      setShowExplanationModal(true);
    }, 600);
  };

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !typedAnswer.trim()) return;

    const normalizedTyped = typedAnswer
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    const normalizedCorrect = challenge.correctAnswer
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    const normalizedDeviceName = challenge.deviceName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    const matches =
      normalizedTyped === normalizedCorrect ||
      normalizedTyped === normalizedDeviceName ||
      normalizedCorrect.includes(normalizedTyped);

    setIsCorrect(matches);
    setIsAnswered(true);
    setSelectedOption(typedAnswer);

    const xp = matches ? challenge.baseXp : 0;
    if (matches) {
      sounds.playCorrect();
    } else {
      sounds.playError();
    }

    onChallengeComplete(
      challenge.id,
      matches,
      xp,
      typedAnswer,
      challenge.correctAnswer,
      challenge.explanation
    );

    setTimeout(() => {
      setShowExplanationModal(true);
    }, 600);
  };

  const handleNextChallenge = () => {
    const nextIdx = (currentIdx + 1) % IMAGE_CHALLENGES.length;
    resetCurrent(nextIdx);
  };

  // Fallback icon rendering when image can't load or is loading
  const renderFallbackIcon = () => {
    const iconClass = 'w-20 h-20 text-purple-400 opacity-80';
    switch (challenge.fallbackIcon) {
      case 'router':
        return <Network className={iconClass} />;
      case 'network':
        return <Network className={iconClass} />;
      case 'server':
        return <Server className={iconClass} />;
      case 'shield':
        return <Shield className={iconClass} />;
      case 'hard-drive':
        return <HardDrive className={iconClass} />;
      case 'cpu':
        return <Cpu className={iconClass} />;
      case 'cable':
        return <Cable className={iconClass} />;
      case 'database':
        return <Database className={iconClass} />;
      case 'monitor':
        return <Monitor className={iconClass} />;
      case 'wifi':
        return <Wifi className={iconClass} />;
      default:
        return <Server className={iconClass} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-purple-400 font-bold">
              Fase 2 — ImageDLE
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              Dispositivo {currentIdx + 1} de {IMAGE_CHALLENGES.length}
            </span>
            {gameState.completedImages.includes(challenge.id) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Concluído
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-white font-mono mt-0.5">
            Identifique o Equipamento de Rede ou Datacenter
          </h2>
        </div>

        {/* Device selector */}
        <div className="flex items-center gap-2">
          <select
            value={currentIdx}
            onChange={e => resetCurrent(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {IMAGE_CHALLENGES.map((ch, idx) => (
              <option key={ch.id} value={idx}>
                #{idx + 1} {ch.deviceName} ({ch.category}) {gameState.completedImages.includes(ch.id) ? '✓' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left: Device Image Container with resilient fallback */}
        <div className="relative rounded-2xl bg-slate-900/90 border border-purple-500/30 overflow-hidden flex flex-col justify-center items-center shadow-xl min-h-[300px] md:min-h-[380px]">
          {!imageError ? (
            <img
              src={challenge.imagePath}
              alt={challenge.deviceName}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30">
                {renderFallbackIcon()}
              </div>
              <div>
                <span className="text-xs uppercase font-mono text-purple-400 tracking-wider font-semibold">
                  Ilustração Técnica de Hardware
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  Ativo de Infraestrutura: {challenge.category}
                </h4>
              </div>
            </div>
          )}

          {/* Subdued category marker on bottom-left */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-slate-300">
            {challenge.category} · {challenge.difficulty}
          </div>
        </div>

        {/* Right: Question and Interaction Options */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-purple-400">
                Desafio de Identificação
              </span>

              {/* Mode switch (Multiple Choice vs Typing) */}
              <div className="flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setInputMode('options')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    inputMode === 'options' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Opções
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('typing')}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    inputMode === 'typing' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Digitar
                </button>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {challenge.question}
            </h3>
          </div>

          {/* Option Mode: 4 Alternatives */}
          {inputMode === 'options' && (
            <div className="space-y-2.5">
              {challenge.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                let btnStyle =
                  'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/80';

                if (isAnswered) {
                  if (option.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase()) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-red-600/90 text-white border-red-500';
                  } else {
                    btnStyle = 'bg-slate-900 text-slate-500 border-slate-800 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 rounded-xl border font-medium text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && option.trim().toLowerCase() === challenge.correctAnswer.trim().toLowerCase() && (
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Typing Mode */}
          {inputMode === 'typing' && (
            <form onSubmit={handleTypedSubmit} className="space-y-3">
              <label className="text-xs text-slate-400 block">
                Digite o nome do dispositivo ou componente observado:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typedAnswer}
                  onChange={e => setTypedAnswer(e.target.value)}
                  disabled={isAnswered}
                  placeholder="Ex: Roteador, Switch, Firewall..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={isAnswered || !typedAnswer.trim()}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-semibold text-xs rounded-xl font-mono transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </form>
          )}

          {/* View explanation button once answered */}
          {isAnswered && (
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowExplanationModal(true)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Revisar Conceito Técnico</span>
              </button>

              <button
                onClick={handleNextChallenge}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl font-mono flex items-center gap-2 transition-colors ml-auto shadow-lg shadow-purple-950/40"
              >
                <span>Próximo Dispositivo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Explanation Modal */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-center">
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center">
              {isCorrect ? (
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
                {isCorrect ? 'Identificação Precisa!' : 'Resposta Incorreta'}
              </span>
              <h3 className="text-xl font-black text-white font-mono mt-1">
                Dispositivo: <span className="text-purple-400">{challenge.correctAnswer}</span>
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block">Sua Escolha</span>
                <span className={`font-mono font-bold mt-0.5 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedOption || 'Nenhuma'}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-slate-400 block">XP Obtido</span>
                <span className="text-purple-400 font-mono font-bold text-sm mt-0.5">
                  {isCorrect ? `+${challenge.baseXp} XP` : '0 XP'}
                </span>
              </div>
            </div>

            <div className="text-left p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Fundamentação Teórica
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {challenge.explanation}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowExplanationModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition-colors"
              >
                Voltar à Imagem
              </button>

              <button
                onClick={() => {
                  setShowExplanationModal(false);
                  handleNextChallenge();
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold font-mono bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-2"
              >
                <span>Avançar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
