import React from 'react';
import {
  Keyboard,
  Image as ImageIcon,
  Wrench,
  Shield,
  Flame,
  Award,
  Play,
  CheckCircle2,
  Lock,
  ArrowRight,
  HelpCircle,
  BarChart2,
  Terminal,
  Server,
  BookOpen,
  Zap
} from 'lucide-react';
import { GameState } from '../types/game';
import { getPlayerLevel, getLevelProgress } from '../utils/gameState';
import { WORDLE_CHALLENGES } from '../data/wordleChallenges';
import { IMAGE_CHALLENGES } from '../data/imageChallenges';
import { SIMULATION_MODULES } from '../data/networkSimulations';

interface HomeViewProps {
  gameState: GameState;
  onSelectPhase: (phase: number) => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onOpenEncyclopedia: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  gameState,
  onSelectPhase,
  onOpenHowToPlay,
  onOpenStats,
  onOpenEncyclopedia
}) => {
  const level = getPlayerLevel(gameState.xp);
  const progress = getLevelProgress(gameState.xp);

  const wordleCompletedCount = gameState.completedWordles.length;
  const imageCompletedCount = gameState.completedImages.length;
  const simCompletedCount = gameState.completedSimulations.length;

  const hasAnyProgress =
    wordleCompletedCount > 0 || imageCompletedCount > 0 || simCompletedCount > 0;

  // Next recommended phase to play
  const getNextRecommendedPhase = (): number => {
    if (!gameState.unlockedStages.includes(2) || wordleCompletedCount < 3) return 1;
    if (!gameState.unlockedStages.includes(3) || imageCompletedCount < 3) return 2;
    return 3;
  };

  const nextPhase = getNextRecommendedPhase();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-[#0E1729] to-[#0B1120] border border-slate-800/80 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Ambient subtle glow background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulador Educativo de Redes & SGBDs</span>
            </div>

            {/* Featured Network Content Badge */}
            <button
              onClick={onOpenEncyclopedia}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-950/70 to-indigo-950/70 hover:from-purple-900/80 hover:to-indigo-900/80 border border-purple-500/40 text-purple-300 hover:text-purple-200 text-xs font-mono transition-all shadow-md shadow-purple-950/30"
              title="Abrir Enciclopédia Didática Completa"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-bold">📘 Guia Curricular de Redes & SGBDs</span>
              <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.2 rounded text-purple-200 group-hover:translate-x-0.5 transition-transform">
                Ver Conceitos ❯
              </span>
            </button>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-mono">
            SERVER<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">DLE</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl">
            Teste seus conhecimentos. Descubra os conceitos. Salve a rede.
          </p>

          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Mergulhe em uma jornada interativa de três fases: decifre termos essenciais de arquitetura cliente-servidor no WordDLE, identifique dispositivos de infraestrutura no ImageDLE e experimente simulações animadas em tempo real no laboratório gamificado NetSim.
          </p>

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onSelectPhase(nextPhase)}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 font-mono text-sm"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              {hasAnyProgress ? 'Continuar Jornada' : 'Iniciar Jornada'}
            </button>

            <button
              onClick={onOpenEncyclopedia}
              className="px-5 py-3.5 bg-purple-950/50 hover:bg-purple-900/50 text-purple-200 border border-purple-500/40 font-semibold rounded-xl flex items-center gap-2 transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              Explicações de Redes
            </button>

            <button
              onClick={onOpenHowToPlay}
              className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 font-semibold rounded-xl flex items-center gap-2 transition-colors text-sm"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Como Jogar
            </button>

            <button
              onClick={onOpenStats}
              className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 font-semibold rounded-xl flex items-center gap-2 transition-colors text-sm"
            >
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Estatísticas
            </button>
          </div>
        </div>

        {/* Quick status bar inside hero */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Nível Atual</span>
            <span className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              {level}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Experiência Acumulada</span>
            <span className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
              {gameState.xp} XP
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Sequência de Vitórias</span>
            <span className="text-lg font-bold text-amber-400 font-mono flex items-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 fill-amber-400" />
              {gameState.currentStreak}x
              <span className="text-xs text-slate-500 font-normal">(Recorde: {gameState.bestStreak}x)</span>
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Conquistas</span>
            <span className="text-lg font-bold text-purple-400 font-mono flex items-center gap-1 mt-0.5">
              <Award className="w-4 h-4" />
              {gameState.achievements.filter(a => a.unlockedAt).length} / {gameState.achievements.length}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Progressive Phase Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              Fases da Jornada
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Conclua desafios para avançar e liberar as próximas etapas
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Fases desbloqueadas: {gameState.unlockedStages.length}/3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: WordDLE */}
          <div className="relative group rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400/60 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
                  <Keyboard className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
                  Fase 1
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  WordDLE
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Adivinhe os conceitos fundamentais (DNS, TCP, SGBD, VLAN, SQL, BACKUP) com pistas técnicas e grade dinâmica adaptada ao tamanho da palavra.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Progresso</span>
                <span className="text-cyan-400 font-bold">
                  {wordleCompletedCount} / {WORDLE_CHALLENGES.length} termos
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onSelectPhase(1)}
                className="w-full py-2.5 px-4 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors font-mono"
              >
                <span>Acessar WordDLE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: ImageDLE */}
          <div
            className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ${
              gameState.unlockedStages.includes(2)
                ? 'bg-slate-900/80 border border-purple-500/30 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-950/20 group'
                : 'bg-slate-950/40 border border-slate-800/50 opacity-70'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-xl border ${
                    gameState.unlockedStages.includes(2)
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  <ImageIcon className="w-6 h-6" />
                </div>
                {gameState.unlockedStages.includes(2) ? (
                  <span className="px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
                    Fase 2
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Lock className="w-3.5 h-3.5" /> Bloqueado
                  </span>
                )}
              </div>

              <div>
                <h3
                  className={`text-lg font-bold transition-colors ${
                    gameState.unlockedStages.includes(2)
                      ? 'text-white group-hover:text-purple-300'
                      : 'text-slate-400'
                  }`}
                >
                  ImageDLE
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Identifique equipamentos reais de telecomunicações e datacenter (Switches, Roteadores, Servidores, Cabos de rede, Firewalls e SSDs).
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Progresso</span>
                <span className="text-purple-400 font-bold">
                  {imageCompletedCount} / {IMAGE_CHALLENGES.length} dispositivos
                </span>
              </div>
            </div>

            <div className="pt-6">
              {gameState.unlockedStages.includes(2) ? (
                <button
                  onClick={() => onSelectPhase(2)}
                  className="w-full py-2.5 px-4 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 hover:text-purple-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors font-mono"
                >
                  <span>Acessar ImageDLE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="py-2.5 px-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl text-xs text-center font-mono">
                  Conclua ao menos 1 WordDLE para liberar
                </div>
              )}
            </div>
          </div>

          {/* Card 3: NetFixDLE */}
          <div
            className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ${
              gameState.unlockedStages.includes(3)
                ? 'bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-xl hover:shadow-emerald-950/20 group'
                : 'bg-slate-950/40 border border-slate-800/50 opacity-70'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-xl border ${
                    gameState.unlockedStages.includes(3)
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  <Zap className="w-6 h-6" />
                </div>
                {gameState.unlockedStages.includes(3) ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                    Fase 3
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Lock className="w-3.5 h-3.5" /> Bloqueado
                  </span>
                )}
              </div>

              <div>
                <h3
                  className={`text-lg font-bold transition-colors ${
                    gameState.unlockedStages.includes(3)
                      ? 'text-white group-hover:text-emerald-300'
                      : 'text-slate-400'
                  }`}
                >
                  NetSim (Lab Animado)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Laboratório interativo gamificado: experimente animações em tempo real do Handshake TCP, resolução DNS, escudos de firewall, durabilidade WAL, árvores B-Tree e pooling de conexões.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Progresso</span>
                <span className="text-emerald-400 font-bold">
                  {simCompletedCount} / {SIMULATION_MODULES.length} módulos
                </span>
              </div>
            </div>

            <div className="pt-6">
              {gameState.unlockedStages.includes(3) ? (
                <button
                  onClick={() => onSelectPhase(3)}
                  className="w-full py-2.5 px-4 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors font-mono"
                >
                  <span>Acessar NetSim (Lab)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="py-2.5 px-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl text-xs text-center font-mono">
                  Conclua ao menos 1 ImageDLE para liberar
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Network Knowledge Curriculum Badges Section */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/30 text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono">
                Conteúdos e Conceitos de Redes Abordados
              </h3>
              <p className="text-xs text-slate-400">
                Tópicos teóricos e práticos integrados nos desafios do ServerDLE
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEncyclopedia}
            className="px-4 py-2 text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl transition-colors font-mono flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Explorar Enciclopédia Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2">
          {[
            { label: 'DNS & Resolução', tag: 'UDP 53 · NXDOMAIN', color: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/30' },
            { label: 'TCP & Portas', tag: 'Handshake · 5432/3306', color: 'border-blue-500/30 text-blue-300 bg-blue-950/30' },
            { label: 'Switches & Roteadores', tag: 'Camada 2 MAC / L3 IP', color: 'border-indigo-500/30 text-indigo-300 bg-indigo-950/30' },
            { label: 'Firewall & VLANs', tag: 'iptables · 802.1Q', color: 'border-rose-500/30 text-rose-300 bg-rose-950/30' },
            { label: 'SGBD & Cache', tag: 'ACID · Buffer Pool', color: 'border-emerald-500/30 text-emerald-300 bg-emerald-950/30' },
            { label: 'Write-Ahead Log (WAL)', tag: 'Persistência & Disco', color: 'border-amber-500/30 text-amber-300 bg-amber-950/30' },
            { label: 'Autenticação & Roles', tag: 'User@Host · Senhas', color: 'border-emerald-500/30 text-emerald-300 bg-emerald-950/30' },
            { label: 'Autorização (GRANT)', tag: 'DCL · Privilégios ACL', color: 'border-purple-500/30 text-purple-300 bg-purple-950/30' },
            { label: 'Tuning & Índices', tag: 'B-Tree · EXPLAIN', color: 'border-rose-500/30 text-rose-300 bg-rose-950/30' },
            { label: 'Connection Pooling', tag: 'max_connections · PgBouncer', color: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/30' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={onOpenEncyclopedia}
              className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer ${item.color}`}
            >
              <div className="font-bold text-xs truncate">{item.label}</div>
              <div className="text-[10px] opacity-75 font-mono mt-0.5 truncate">{item.tag}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
