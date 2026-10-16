import React, { useState } from 'react';
import {
  X,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Award,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { GameState } from '../types/game';
import { getPlayerLevel } from '../utils/gameState';
import { WORDLE_CHALLENGES } from '../data/wordleChallenges';
import { IMAGE_CHALLENGES } from '../data/imageChallenges';
import { SIMULATION_MODULES } from '../data/networkSimulations';

interface FinalResultsModalProps {
  isOpen: boolean;
  gameState: GameState;
  onClose: () => void;
  onResetGame: () => void;
  onSelectPhase: (phase: number) => void;
}

export const FinalResultsModal: React.FC<FinalResultsModalProps> = ({
  isOpen,
  gameState,
  onClose,
  onResetGame,
  onSelectPhase
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'mistakes' | 'topics'>('stats');

  if (!isOpen) return null;

  const playerLevel = getPlayerLevel(gameState.xp);
  const totalHintsUsed = Object.values(gameState.revealedHints).reduce((acc, h) => acc + h, 0);

  // Precision metrics
  const wordleTotal = WORDLE_CHALLENGES.length;
  const wordleCompleted = gameState.completedWordles.length;
  const wordleAccuracy = wordleCompleted > 0 ? Math.round((wordleCompleted / (wordleCompleted + (gameState.mistakesHistory.filter(m => m.phase === 'WordDLE').length))) * 100) : 0;

  const imageTotal = IMAGE_CHALLENGES.length;
  const imageCompleted = gameState.completedImages.length;
  const imageAccuracy = imageCompleted > 0 ? Math.round((imageCompleted / (imageCompleted + (gameState.mistakesHistory.filter(m => m.phase === 'ImageDLE').length))) * 100) : 0;

  const simTotal = SIMULATION_MODULES.length;
  const simCompleted = gameState.completedSimulations.length;
  const simAccuracy = simCompleted > 0 ? Math.round((simCompleted / (simCompleted + (gameState.mistakesHistory.filter(m => m.phase === 'NetSim').length))) * 100) : 0;

  // Mastered topics & topics for review
  const allTopics = [
    { title: 'Three-Way Handshake TCP & Portas', mastered: gameState.completedSimulations.includes('sim_tcp_handshake') || gameState.completedWordles.includes('w_tcp') || gameState.completedWordles.includes('w_porta') },
    { title: 'Resolução de Nomes & Servidores DNS', mastered: gameState.completedSimulations.includes('sim_dns_resolution') || gameState.completedWordles.includes('w_dns') },
    { title: 'Regras de Filtragem & Firewall Stateful', mastered: gameState.completedSimulations.includes('sim_firewall_shield') || gameState.completedWordles.includes('w_firewall') },
    { title: 'Propriedades ACID & Write-Ahead Log (WAL)', mastered: gameState.completedSimulations.includes('sim_acid_wal') || gameState.completedWordles.includes('w_sgbd') },
    { title: 'Otimização de Consultas & Árvore B-Tree', mastered: gameState.completedSimulations.includes('sim_btree_vs_seqscan') || gameState.completedWordles.includes('w_cache') },
    { title: 'Gerenciamento de Sessões & Connection Pooling', mastered: gameState.completedSimulations.includes('sim_connection_pooling') || gameState.completedWordles.includes('w_login') },
    { title: 'Rotinas de Backup, Checksum & Restore Drills', mastered: gameState.completedSimulations.includes('sim_backup_restore_drill') || gameState.completedWordles.includes('w_backup') },
    { title: 'Dispositivos Físicos (Switch, Router, FW, SSD)', mastered: gameState.completedImages.length >= 5 }
  ];

  const masteredTopics = allTopics.filter(t => t.mastered);
  const reviewTopics = allTopics.filter(t => !t.mastered);

  const unlockedAchievementsCount = gameState.achievements.filter(a => a.unlockedAt).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-cyan-500/20 rounded-lg border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Quadro Geral de Desempenho</h3>
              <p className="text-xs text-slate-400">Estatísticas, diagnósticos e histórico de aprendizado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800/80 bg-slate-900/40 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'stats'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Métricas Globais
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'topics'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Conteúdos ({masteredTopics.length}/{allTopics.length})
          </button>
          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-4 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'mistakes'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Revisão de Erros ({gameState.mistakesHistory.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Primary Profile Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Pontuação Total</div>
                  <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{gameState.xp} XP</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{playerLevel}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Melhor Sequência</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1 flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5 fill-amber-400" />
                    {gameState.bestStreak}x
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Acertos seguidos</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Conquistas</div>
                  <div className="text-2xl font-black text-purple-400 font-mono mt-1 flex items-center justify-center gap-1">
                    <Award className="w-5 h-5" />
                    {unlockedAchievementsCount}/{gameState.achievements.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Desbloqueadas</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Pistas Utilizadas</div>
                  <div className="text-2xl font-black text-slate-300 font-mono mt-1 flex items-center justify-center gap-1">
                    <HelpCircle className="w-5 h-5 text-slate-400" />
                    {totalHintsUsed}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Consultadas</div>
                </div>
              </div>

              {/* Progress per Phase */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Progresso e Precisão por Fase
                </h4>

                {/* Phase 1 Wordle */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span className="text-sm font-bold text-white">Fase 1 — WordDLE (Conceitos)</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {wordleCompleted} de {wordleTotal} palavras decifradas
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Precisão</div>
                      <div className="text-sm font-mono font-bold text-cyan-400">
                        {wordleCompleted > 0 ? `${wordleAccuracy}%` : '—'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPhase(1);
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      Jogar <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Phase 2 ImageDLE */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      <span className="text-sm font-bold text-white">Fase 2 — ImageDLE (Dispositivos)</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {imageCompleted} de {imageTotal} dispositivos identificados
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Precisão</div>
                      <div className="text-sm font-mono font-bold text-purple-400">
                        {imageCompleted > 0 ? `${imageAccuracy}%` : '—'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (gameState.unlockedStages.includes(2)) {
                          onClose();
                          onSelectPhase(2);
                        }
                      }}
                      disabled={!gameState.unlockedStages.includes(2)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                        gameState.unlockedStages.includes(2)
                          ? 'bg-slate-800 hover:bg-slate-700 text-white'
                          : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {gameState.unlockedStages.includes(2) ? 'Jogar' : 'Bloqueado'} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Phase 3 NetSim */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-sm font-bold text-white">Fase 3 — NetSim (Laboratório & Simulador)</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {simCompleted} de {simTotal} módulos interativos dominados
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Precisão</div>
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {simCompleted > 0 ? `${simAccuracy}%` : '—'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (gameState.unlockedStages.includes(3)) {
                          onClose();
                          onSelectPhase(3);
                        }
                      }}
                      disabled={!gameState.unlockedStages.includes(3)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                        gameState.unlockedStages.includes(3)
                          ? 'bg-slate-800 hover:bg-slate-700 text-white'
                          : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {gameState.unlockedStages.includes(3) ? 'Acessar' : 'Bloqueado'} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topics' && (
            <div className="space-y-6">
              {/* Dominados */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Conteúdos Dominados ({masteredTopics.length})
                </h4>
                {masteredTopics.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-lg">
                    Conclua desafios para registrar seus primeiros conceitos dominados.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {masteredTopics.map((topic, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-medium">{topic.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recomendados para Revisão */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
                  <BookOpen className="w-4 h-4" />
                  Conteúdos Recomendados para Revisão ({reviewTopics.length})
                </h4>
                {reviewTopics.length === 0 ? (
                  <p className="text-xs text-emerald-400 font-semibold p-3 bg-emerald-950/20 rounded-lg border border-emerald-500/30">
                    Parabéns! Você demonstrou domínio em todos os tópicos curriculares de Redes e Bancos de Dados!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {reviewTopics.map((topic, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{topic.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'mistakes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Histórico de Respostas Incorretas
                </h4>
                <span className="text-xs font-mono text-slate-500">
                  Total de erros: {gameState.mistakesHistory.length}
                </span>
              </div>

              {gameState.mistakesHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">Nenhum erro registrado até o momento!</p>
                  <p className="text-xs text-slate-500 mt-1">Sua precisão nas respostas está em 100%.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gameState.mistakesHistory.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/80 border border-red-500/20 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          {m.challengeTitle}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                          {m.phase}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                        <div className="p-2 rounded bg-red-950/30 text-red-300 border border-red-500/30">
                          <span className="text-red-400 font-sans block text-[10px] uppercase font-bold">Tentativa:</span>
                          {m.userAnswer}
                        </div>
                        <div className="p-2 rounded bg-emerald-950/30 text-emerald-300 border border-emerald-500/30">
                          <span className="text-emerald-400 font-sans block text-[10px] uppercase font-bold">Resposta Correta:</span>
                          {m.correctAnswer}
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs pt-1 leading-relaxed border-t border-slate-800">
                        <strong className="text-slate-300">Explicação:</strong> {m.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (window.confirm('Deseja realmente reiniciar todo o progresso do jogo? Isso apagará seu XP e histórico.')) {
                onResetGame();
                onClose();
              }
            }}
            className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar Jornada
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-mono transition-colors"
          >
            Continuar Jogando
          </button>
        </div>
      </div>
    </div>
  );
};
