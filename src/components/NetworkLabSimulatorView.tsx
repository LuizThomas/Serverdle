import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Shield,
  Server,
  Layers,
  Database,
  Cpu,
  HardDrive,
  Network,
  Search,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Sparkles,
  Flame,
  Activity,
  AlertTriangle,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import { SimulationModule, GameState } from '../types/game';
import { SIMULATION_MODULES } from '../data/networkSimulations';
import { sounds } from '../utils/sound';

interface NetworkLabSimulatorViewProps {
  gameState: GameState;
  onSimulationComplete: (
    moduleId: string,
    won: boolean,
    xpEarned: number,
    explanation: string
  ) => void;
  onNavigatePhase: (phase: number | null) => void;
}

export const NetworkLabSimulatorView: React.FC<NetworkLabSimulatorViewProps> = ({
  gameState,
  onSimulationComplete,
  onNavigatePhase
}) => {
  const [currentModuleIdx, setCurrentModuleIdx] = useState<number>(() => {
    const uncompletedIdx = SIMULATION_MODULES.findIndex(
      m => !gameState.completedSimulations.includes(m.id)
    );
    return uncompletedIdx !== -1 ? uncompletedIdx : 0;
  });

  const module = SIMULATION_MODULES[currentModuleIdx] || SIMULATION_MODULES[0];

  // Common interactive simulation states
  const [animStep, setAnimStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animLog, setAnimLog] = useState<string>('Pronto para iniciar a simulação interativa.');

  // Module 1: TCP Handshake specific state
  const [tcpPortOpen, setTcpPortOpen] = useState<boolean>(true);
  const [tcpFirewallAllow, setTcpFirewallAllow] = useState<boolean>(true);

  // Module 2: DNS specific state
  const [dnsRecordConfigured, setDnsRecordConfigured] = useState<boolean>(true);

  // Module 3: Firewall specific state
  const [fwPort80, setFwPort80] = useState<boolean>(true);
  const [fwPort443, setFwPort443] = useState<boolean>(true);
  const [fwPort5432, setFwPort5432] = useState<boolean>(false); // Starts blocked to demonstrate DROP!
  const [lastTestedPacket, setLastTestedPacket] = useState<string | null>(null);

  // Module 4: ACID WAL specific state
  const [walEnabled, setWalEnabled] = useState<boolean>(true);
  const [simulatedPowerOutage, setSimulatedPowerOutage] = useState<boolean>(false);

  // Module 5: B-Tree vs Seq Scan specific state
  const [searchMode, setSearchMode] = useState<'seq' | 'btree'>('seq');
  const [scannedBlocksCount, setScannedBlocksCount] = useState<number>(0);

  // Module 6: Connection Pooling specific state
  const [poolingMode, setPoolingMode] = useState<'direct' | 'pgbouncer'>('direct');
  const [activeConnectionsCount, setActiveConnectionsCount] = useState<number>(0);
  const [rejectedClientsCount, setRejectedClientsCount] = useState<number>(0);

  // Module 7: Backup Restore Drill specific state
  const [backupStage, setBackupStage] = useState<'none' | 'dumped' | 'hashed' | 'restored'>('none');
  const [backupCorrupted, setBackupCorrupted] = useState<boolean>(false);

  // Gamified Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  // Reset states when changing module
  const resetModuleState = (nextIdx: number) => {
    setCurrentModuleIdx(nextIdx);
    setAnimStep(0);
    setIsAnimating(false);
    setAnimLog('Pronto para iniciar a simulação interativa.');
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizCorrect(false);
    setShowCompletionModal(false);
    setScannedBlocksCount(0);
    setActiveConnectionsCount(0);
    setRejectedClientsCount(0);
    setBackupStage('none');
    setBackupCorrupted(false);
    setSimulatedPowerOutage(false);
  };

  // ----------------------------------------------------
  // Module 1: Run TCP Handshake Animation
  // ----------------------------------------------------
  const runTcpHandshake = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimStep(1);
    sounds.playKeyTap();
    setAnimLog('Cliente (10.0.0.15) disparou pacote [SYN, Seq=100] na porta 5432...');

    setTimeout(() => {
      if (!tcpFirewallAllow) {
        setAnimStep(99); // Blocked by firewall
        setIsAnimating(false);
        sounds.playError();
        setAnimLog('PACOTE DESCARTADO PELO FIREWALL! Regra DROP gerou Timeout no cliente.');
        return;
      }

      if (!tcpPortOpen) {
        setAnimStep(98); // Port closed
        setIsAnimating(false);
        sounds.playError();
        setAnimLog('PORTA FECHADA! Servidor devolveu [RST, ACK] (Connection Refused).');
        return;
      }

      // Step 2: SYN-ACK
      setAnimStep(2);
      sounds.playKeyTap();
      setAnimLog('Servidor respondeu com [SYN-ACK, Seq=300, Ack=101]!');

      setTimeout(() => {
        // Step 3: ACK
        setAnimStep(3);
        sounds.playCorrect();
        setIsAnimating(false);
        setAnimLog('Cliente confirmou com [ACK, Ack=301]! Conexão ESTABLISHED! Canal pronto para SQL.');
      }, 1200);
    }, 1200);
  };

  // ----------------------------------------------------
  // Module 2: Run DNS Resolution Animation
  // ----------------------------------------------------
  const runDnsQuery = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimStep(1);
    sounds.playKeyTap();
    setAnimLog('Cliente emitiu requisição UDP na porta 53 para o Servidor DNS: "Qual o IP de db-cluster.corp.local?"');

    setTimeout(() => {
      if (!dnsRecordConfigured) {
        setAnimStep(99);
        setIsAnimating(false);
        sounds.playError();
        setAnimLog('RESPOSTA: NXDOMAIN! Registro não existe na zona. O cliente não consegue encontrar o banco.');
        return;
      }

      setAnimStep(2);
      sounds.playKeyTap();
      setAnimLog('Servidor DNS consultou a zona corporativa e encontrou Registro A: 192.168.10.25');

      setTimeout(() => {
        setAnimStep(3);
        sounds.playCorrect();
        setIsAnimating(false);
        setAnimLog('Endereço IP resolvido com sucesso! O cliente agora consegue conectar diretamente ao IP 192.168.10.25.');
      }, 1200);
    }, 1200);
  };

  // ----------------------------------------------------
  // Module 3: Test Packet in Firewall
  // ----------------------------------------------------
  const testFirewallPacket = (packetType: 'http' | 'https' | 'pg' | 'scan') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setLastTestedPacket(packetType);
    sounds.playKeyTap();

    let allowed = false;
    let desc = '';

    if (packetType === 'http') {
      allowed = fwPort80;
      desc = allowed ? 'Pacote HTTP (Porta 80) PERMITIDO pelo firewall.' : 'Pacote HTTP (Porta 80) DESCARTADO (DROP)!';
    } else if (packetType === 'https') {
      allowed = fwPort443;
      desc = allowed ? 'Pacote HTTPS Seguro (Porta 443) PERMITIDO!' : 'Pacote HTTPS (Porta 443) BLOQUEADO!';
    } else if (packetType === 'pg') {
      allowed = fwPort5432;
      desc = allowed ? 'Pacote PostgreSQL (Porta 5432) PERMITIDO pela regra da LAN!' : 'Pacote PostgreSQL (Porta 5432) BLOQUEADO pelo escudo do firewall!';
    } else {
      allowed = false;
      desc = 'VARREDURA MALICIOSA / PORT SCAN DETECTADA! Bloqueada imediatamente!';
    }

    setAnimStep(1);
    setAnimLog(`Disparando pacote de teste em direção ao firewall...`);

    setTimeout(() => {
      setAnimStep(allowed ? 2 : 99);
      setIsAnimating(false);
      if (allowed) {
        sounds.playCorrect();
      } else {
        sounds.playError();
      }
      setAnimLog(desc);
    }, 1000);
  };

  // ----------------------------------------------------
  // Module 4: Run ACID WAL Transaction
  // ----------------------------------------------------
  const runAcidTransaction = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSimulatedPowerOutage(false);
    setAnimStep(1);
    sounds.playKeyTap();
    setAnimLog('Instrução SQL: UPDATE contas SET saldo = saldo - 100; executada pelo cliente.');

    setTimeout(() => {
      setAnimStep(2);
      sounds.playKeyTap();
      setAnimLog('Dados modificados na memória RAM (Buffer Pool). A página agora está marcada como "Dirty Page".');

      setTimeout(() => {
        if (!walEnabled) {
          setAnimStep(98);
          setIsAnimating(false);
          sounds.playError();
          setAnimLog('ALERTA: Escrita sem WAL! Se a energia cair agora, esta alteração será totalmente perdida!');
          return;
        }

        setAnimStep(3);
        sounds.playKeyTap();
        setAnimLog('Gravando síncronamente no Write-Ahead Log (WAL) no disco SSD...');

        setTimeout(() => {
          setAnimStep(4);
          sounds.playCorrect();
          setIsAnimating(false);
          setAnimLog('COMMIT REALIZADO COM SUCESSO! Transação 100% garantida pela Durabilidade ACID.');
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const triggerPowerOutage = () => {
    setSimulatedPowerOutage(true);
    sounds.playError();
    if (walEnabled) {
      setAnimLog('⚡ QUEDA DE ENERGIA SIMULADA! O servidor reiniciou, leu o arquivo WAL e recuperou a transação perfeitamente! Dados intactos.');
    } else {
      setAnimLog('⚡ QUEDA DE ENERGIA SIMULADA! Como o WAL estava desativado, os dados na RAM evaporaram! TRANSAÇÃO PERDIDA!');
    }
  };

  // ----------------------------------------------------
  // Module 5: B-Tree vs Seq Scan Simulation
  // ----------------------------------------------------
  const runSearchBenchmark = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    sounds.playKeyTap();

    if (searchMode === 'seq') {
      setScannedBlocksCount(0);
      setAnimLog('Iniciando Varredura Sequencial (Seq Scan): lendo bloco por bloco no disco...');

      let current = 0;
      const interval = setInterval(() => {
        current += 10;
        setScannedBlocksCount(current);
        sounds.playTileFlip();

        if (current >= 80) {
          clearInterval(interval);
          setIsAnimating(false);
          sounds.playError();
          setAnimLog('Registro encontrado após ler 78 blocos de disco! CPU saturou em 99% e levou 3.820 ms.');
        }
      }, 250);
    } else {
      setScannedBlocksCount(3);
      setAnimLog('Buscando via Índice B-Tree balanceado...');
      setTimeout(() => {
        sounds.playCorrect();
        setIsAnimating(false);
        setAnimLog('Registro encontrado em apenas 3 saltos (Raiz ➔ Nó ➔ Folha)! CPU em 1% e tempo de 1 ms!');
      }, 500);
    }
  };

  // ----------------------------------------------------
  // Module 6: Connection Pooling Simulation
  // ----------------------------------------------------
  const runConnectionSpike = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    sounds.playKeyTap();

    if (poolingMode === 'direct') {
      setActiveConnectionsCount(10);
      setRejectedClientsCount(40);
      sounds.playError();
      setIsAnimating(false);
      setAnimLog('ESTOURO DE CONEXÕES! 10 slots preenchidos. 40 clientes receberam erro FATAL: max_connections reached!');
    } else {
      setActiveConnectionsCount(5);
      setRejectedClientsCount(0);
      sounds.playCorrect();
      setIsAnimating(false);
      setAnimLog('SUCESSO! O PgBouncer multiplexou as 50 requisições usando apenas 5 conexões reais reaproveitadas.');
    }
  };

  // ----------------------------------------------------
  // Module 7: Backup Restore Drill Simulation
  // ----------------------------------------------------
  const runBackupStep = () => {
    if (backupStage === 'none') {
      sounds.playKeyTap();
      setBackupStage('dumped');
      setAnimLog('pg_dump executado: arquivo backup_full.dump (4.2 GB) gravado no storage.');
    } else if (backupStage === 'dumped') {
      sounds.playKeyTap();
      setBackupStage('hashed');
      if (backupCorrupted) {
        sounds.playError();
        setAnimLog('Checksum SHA256: FAI1ED_CRC! Arquivo truncado ou corrompido detectado com antecedência!');
      } else {
        sounds.playCorrect();
        setAnimLog('Checksum SHA256: e3b0c44298fc1c149afb... Integridade 100% validada!');
      }
    } else if (backupStage === 'hashed') {
      sounds.playTerminalCommand();
      setBackupStage('restored');
      if (backupCorrupted) {
        sounds.playError();
        setAnimLog('Simulação de restauração FALHOU: pg_restore acusou erro de arquivo incompleto.');
      } else {
        sounds.playCorrect();
        setAnimLog('Restore Drill com --dry-run BEM-SUCEDIDO! O arquivo é 100% restaurável.');
      }
    } else {
      setBackupStage('none');
      setAnimLog('Pronto para novo teste de backup.');
    }
  };

  // ----------------------------------------------------
  // Handle Quiz Submission
  // ----------------------------------------------------
  const handleQuizAnswer = (optIdx: number) => {
    if (quizSubmitted) return;

    setSelectedQuizOption(optIdx);
    const chosen = module.quizOptions[optIdx];
    const isRight = chosen.isCorrect;
    setQuizSubmitted(true);
    setQuizCorrect(isRight);

    if (isRight) {
      sounds.playCorrect();
      onSimulationComplete(module.id, true, module.baseXp, chosen.explanation);
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 700);
    } else {
      sounds.playError();
      onSimulationComplete(module.id, false, 0, chosen.explanation);
    }
  };

  const handleNextModule = () => {
    const nextIdx = (currentModuleIdx + 1) % SIMULATION_MODULES.length;
    resetModuleState(nextIdx);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              Fase 3 — NetSim: Laboratório & Simulador Interativo
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              Módulo {currentModuleIdx + 1} de {SIMULATION_MODULES.length}
            </span>
            {gameState.completedSimulations.includes(module.id) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Dominado
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
            {module.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{module.subtitle}</p>
        </div>

        {/* Module Selector Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={currentModuleIdx}
            onChange={e => resetModuleState(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {SIMULATION_MODULES.map((m, idx) => (
              <option key={m.id} value={idx}>
                #{idx + 1} {m.title} {gameState.completedSimulations.includes(m.id) ? '✓' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Module Overview Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              {module.category}
            </span>
            <span className="text-xs text-cyan-400 font-mono font-bold">
              +{module.baseXp} XP ao Dominar
            </span>
          </div>

          <span className="text-xs text-slate-400">
            Laboratório Interativo com Animação em Tempo Real
          </span>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed">
          {module.description}
        </p>

        {/* Key concepts pill strip */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {module.keyConcepts.map((kc, i) => (
            <span
              key={i}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono"
            >
              • {kc}
            </span>
          ))}
        </div>
      </div>

      {/* INTERACTIVE ANIMATED SIMULATOR CANVASES */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Arena de Simulação Visual Interativa
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {isAnimating ? 'Animando...' : 'Aguardando Disparo'}
          </span>
        </div>

        {/* ============================================================== */}
        {/* MODULE 1: THREE-WAY HANDSHAKE TCP ANIMATION */}
        {/* ============================================================== */}
        {module.id === 'sim_tcp_handshake' && (
          <div className="space-y-6">
            {/* Visual Topology Arena */}
            <div className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              {/* Left Node: Client */}
              <div className="flex flex-col items-center space-y-2 z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border-2 border-blue-500/40 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-950/40">
                  <Cpu className="w-8 h-8" />
                </div>
                <div className="text-center font-mono">
                  <div className="text-xs font-bold text-white">Cliente / App Web</div>
                  <div className="text-[10px] text-slate-400">IP: 10.0.0.15</div>
                </div>
              </div>

              {/* Center: Cable & Animated Packet */}
              <div className="flex-1 w-full flex flex-col items-center justify-center relative py-6">
                {/* Physical Cable line */}
                <div className="w-full h-2 bg-slate-800 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 opacity-20" />
                </div>

                {/* Animated Packet Element */}
                {animStep > 0 && (
                  <div
                    className={`mt-3 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-700 shadow-xl ${
                      animStep === 1
                        ? 'bg-blue-600 text-white animate-bounce'
                        : animStep === 2
                        ? 'bg-purple-600 text-white animate-bounce'
                        : animStep === 3
                        ? 'bg-emerald-600 text-white'
                        : animStep === 99
                        ? 'bg-red-600 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {animStep === 1 && '▶ [SYN, Seq=100] ➔'}
                    {animStep === 2 && '◀ [SYN-ACK, Seq=300, Ack=101]'}
                    {animStep === 3 && '▶ [ACK, Ack=301] ESTABLISHED! 🟢'}
                    {animStep === 99 && '💥 PACOTE BLOQUEADO PELO FIREWALL (DROP)!'}
                    {animStep === 98 && '💥 CONEXÃO RECUSADA: PORTA FECHADA (RST)!'}
                  </div>
                )}
              </div>

              {/* Right Node: Server */}
              <div className="flex flex-col items-center space-y-2 z-10">
                <div
                  className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-lg transition-colors ${
                    tcpPortOpen && tcpFirewallAllow
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-emerald-950/40'
                      : 'bg-red-500/10 border-red-500/40 text-red-400'
                  }`}
                >
                  <Server className="w-8 h-8" />
                </div>
                <div className="text-center font-mono">
                  <div className="text-xs font-bold text-white">SGBD PostgreSQL</div>
                  <div className="text-[10px] text-slate-400">IP: 10.0.0.50 : 5432</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">
                    Porta: {tcpPortOpen ? 'Aberta (LISTEN)' : 'Fechada'}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Control Panel */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={tcpPortOpen}
                    onChange={e => setTcpPortOpen(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700"
                  />
                  <span>Porta TCP 5432 Aberta</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={tcpFirewallAllow}
                    onChange={e => setTcpFirewallAllow(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700"
                  />
                  <span>Firewall Permite Tráfego</span>
                </label>
              </div>

              <button
                onClick={runTcpHandshake}
                disabled={isAnimating}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Disparar Three-Way Handshake</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODULE 2: DNS RESOLUTION ANIMATION */}
        {/* ============================================================== */}
        {module.id === 'sim_dns_resolution' && (
          <div className="space-y-6">
            <div className="relative p-6 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
              {/* Node 1: App */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <Cpu className="w-8 h-8 text-blue-400 mx-auto" />
                <div className="text-xs font-bold text-white">App Web</div>
                <div className="text-[11px] font-mono text-slate-400">
                  Configurado: "db-cluster.corp.local"
                </div>
              </div>

              {/* Node 2: DNS Server */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2 relative">
                <Search className="w-8 h-8 text-cyan-400 mx-auto" />
                <div className="text-xs font-bold text-white">Servidor DNS (UDP 53)</div>
                <div className="text-[10px] font-mono text-slate-400">
                  {dnsRecordConfigured
                    ? 'Zona: db-cluster ➔ 192.168.10.25'
                    : 'Zona: (Vazio / NXDOMAIN)'}
                </div>
              </div>

              {/* Node 3: Database Destination */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <Database className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-white">PostgreSQL Real</div>
                <div className="text-[11px] font-mono text-slate-400">IP: 192.168.10.25</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                <input
                  type="checkbox"
                  checked={dnsRecordConfigured}
                  onChange={e => setDnsRecordConfigured(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700"
                />
                <span>Registro DNS "db-cluster.corp.local" Cadastrado na Zona</span>
              </label>

              <button
                onClick={runDnsQuery}
                disabled={isAnimating}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/50"
              >
                <Search className="w-4 h-4" />
                <span>Simular Consulta DNS (dig/nslookup)</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODULE 3: STATEFUL FIREWALL SHIELD ANIMATION */}
        {/* ============================================================== */}
        {module.id === 'sim_firewall_shield' && (
          <div className="space-y-6">
            <div className="relative p-6 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left: Traffic Source */}
              <div className="text-center space-y-2">
                <Network className="w-10 h-10 text-cyan-400 mx-auto" />
                <div className="text-xs font-bold text-white">Internet & Clientes</div>
                <div className="text-[10px] text-slate-400 font-mono">Tráfego de Entrada (WAN)</div>
              </div>

              {/* Center: Firewall Shield Laser */}
              <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border-2 border-rose-500/40 relative space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Shield className="w-5 h-5" />
                  <span>Escudo do Firewall (iptables / UFW)</span>
                </div>

                {/* Firewall rules toggle buttons */}
                <div className="flex flex-wrap justify-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => setFwPort80(!fwPort80)}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      fwPort80 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-red-950/80 border-red-500 text-red-300'
                    }`}
                  >
                    Porta 80 (HTTP): {fwPort80 ? 'ACCEPT' : 'DROP'}
                  </button>

                  <button
                    onClick={() => setFwPort443(!fwPort443)}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      fwPort443 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-red-950/80 border-red-500 text-red-300'
                    }`}
                  >
                    Porta 443 (HTTPS): {fwPort443 ? 'ACCEPT' : 'DROP'}
                  </button>

                  <button
                    onClick={() => setFwPort5432(!fwPort5432)}
                    className={`px-3 py-1.5 rounded-lg border transition-all ${
                      fwPort5432 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-red-950/80 border-red-500 text-red-300'
                    }`}
                  >
                    Porta 5432 (Postgres): {fwPort5432 ? 'ACCEPT' : 'DROP'}
                  </button>
                </div>
              </div>

              {/* Right: Internal Protected Zone */}
              <div className="text-center space-y-2">
                <Database className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-white">VLAN Protegida</div>
                <div className="text-[10px] text-slate-400 font-mono">Servidores de Banco</div>
              </div>
            </div>

            {/* Packet Trigger Buttons */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <span className="text-slate-300 font-bold">Disparar Pacotes de Teste:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => testFirewallPacket('http')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700"
                >
                  Pacote HTTP (80)
                </button>
                <button
                  onClick={() => testFirewallPacket('https')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700"
                >
                  Pacote HTTPS (443)
                </button>
                <button
                  onClick={() => testFirewallPacket('pg')}
                  className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl"
                >
                  Pacote SQL (5432)
                </button>
                <button
                  onClick={() => testFirewallPacket('scan')}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl"
                >
                  Varredura de Portas (Scan)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODULE 4: ACID WAL ANIMATION */}
        {/* ============================================================== */}
        {module.id === 'sim_acid_wal' && (
          <div className="space-y-6">
            <div className="relative p-6 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {/* RAM Buffer Pool */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                <Cpu className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="text-xs font-bold text-white">Memória RAM (Buffer Pool)</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {animStep >= 2 ? 'Páginas Sujas (Dirty Pages) em RAM' : 'shared_buffers sincronizado'}
                </div>
              </div>

              {/* WAL on SSD */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                <HardDrive className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-xs font-bold text-white">SSD: Write-Ahead Log (WAL)</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {animStep >= 3 ? 'Gravado Sequencialmente (fsync OK)' : 'Aguardando escrita síncrona'}
                </div>
              </div>

              {/* Data Table on Disk */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <Database className="w-8 h-8 text-cyan-400 mx-auto" />
                <div className="text-xs font-bold text-white">Tabelas Finais (Checkpoint)</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {animStep >= 4 ? 'Transação Consolidada (ACID Durável)' : 'Base estável'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                <input
                  type="checkbox"
                  checked={walEnabled}
                  onChange={e => setWalEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700"
                />
                <span>Mecanismo Write-Ahead Log (WAL) Ativado</span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={runAcidTransaction}
                  disabled={isAnimating}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all"
                >
                  Executar Transação SQL (INSERT/UPDATE)
                </button>

                <button
                  onClick={triggerPowerOutage}
                  className="px-4 py-2.5 bg-red-600/80 hover:bg-red-500 text-white font-bold font-mono text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Simular Queda de Energia!</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODULE 5: B-TREE VS SEQ SCAN ANIMATION */}
        {/* ============================================================== */}
        {module.id === 'sim_btree_vs_seqscan' && (
          <div className="space-y-6">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Modo de Acesso:</span>
                  <button
                    onClick={() => setSearchMode('seq')}
                    className={`px-3 py-1.5 rounded-lg border ${
                      searchMode === 'seq' ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Varredura Sequencial (Seq Scan)
                  </button>
                  <button
                    onClick={() => setSearchMode('btree')}
                    className={`px-3 py-1.5 rounded-lg border ${
                      searchMode === 'btree' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Índice B-Tree (Index Scan)
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span>
                    Blocos Lidos:{' '}
                    <strong className="text-cyan-400">{scannedBlocksCount} de 100</strong>
                  </span>
                  <span>
                    Carga de CPU:{' '}
                    <strong className={searchMode === 'seq' && isAnimating ? 'text-red-400' : 'text-emerald-400'}>
                      {searchMode === 'seq' && isAnimating ? '99.4%' : '1.2%'}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Visual Disk Blocks Grid */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block">
                  Páginas de Dados em Disco (Buscando Registro #78):
                </span>
                <div className="grid grid-cols-10 sm:grid-cols-20 gap-1">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const blockNum = i * 2 + 1;
                    const isTarget = blockNum >= 77 && blockNum <= 79;
                    const isScanned = blockNum <= scannedBlocksCount;

                    let bg = 'bg-slate-900 border-slate-800 text-slate-600';
                    if (searchMode === 'btree') {
                      bg = isTarget ? 'bg-emerald-500 text-slate-950 font-bold scale-110' : 'bg-slate-900 text-slate-600';
                    } else if (isScanned) {
                      bg = isTarget ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-rose-950 border-rose-500/50 text-rose-300';
                    }

                    return (
                      <div
                        key={i}
                        className={`h-7 rounded flex items-center justify-center font-mono text-[10px] border transition-all ${bg}`}
                      >
                        {blockNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={runSearchBenchmark}
                  disabled={isAnimating}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all"
                >
                  Disparar Consulta SQL (WHERE id = 78)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODULE 6: CONNECTION POOLING (PGBOUNCER) ANIMATION */}
        {/* ============================================================== */}
        {module.id === 'sim_connection_pooling' && (
          <div className="space-y-6">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Arquitetura de Conexões:</span>
                  <button
                    onClick={() => setPoolingMode('direct')}
                    className={`px-3 py-1.5 rounded-lg border ${
                      poolingMode === 'direct' ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Conexão Direta (Sem Pool)
                  </button>
                  <button
                    onClick={() => setPoolingMode('pgbouncer')}
                    className={`px-3 py-1.5 rounded-lg border ${
                      poolingMode === 'pgbouncer' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    PgBouncer (Connection Pooling)
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span>
                    Conexões Ativas no Banco:{' '}
                    <strong className="text-cyan-400">{activeConnectionsCount} / 10</strong>
                  </span>
                  <span>
                    Rejeitados:{' '}
                    <strong className={rejectedClientsCount > 0 ? 'text-red-400' : 'text-emerald-400'}>
                      {rejectedClientsCount}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Visual Connection Slots */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono text-slate-400 block">
                  Slots de Conexão no PostgreSQL (max_connections = 10):
                </span>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const isOccupied = i < activeConnectionsCount;
                    return (
                      <div
                        key={i}
                        className={`p-2.5 rounded-lg border text-center font-mono text-xs ${
                          isOccupied
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}
                      >
                        Slot {i + 1}
                        <div className="text-[9px] opacity-75">{isOccupied ? 'Ativo' : 'Livre'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={runConnectionSpike}
                  disabled={isAnimating}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all"
                >
                  Disparar Pico de 50 Clientes Simultâneos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODULE 7: BACKUP & RESTORE DRILL ANIMATION */}
        {/* ============================================================== */}
        {module.id === 'sim_backup_restore_drill' && (
          <div className="space-y-6">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs font-mono">
              <div className={`p-4 rounded-xl border ${backupStage !== 'none' ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <HardDrive className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">1. Dump Lógico</div>
                <div className="text-[10px] mt-1">{backupStage !== 'none' ? 'backup_full.dump gravado' : 'Pendente'}</div>
              </div>

              <div className={`p-4 rounded-xl border ${backupStage === 'hashed' || backupStage === 'restored' ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">2. Checksum SHA256</div>
                <div className="text-[10px] mt-1">
                  {backupStage === 'hashed' || backupStage === 'restored' ? (backupCorrupted ? 'CRC ERROR!' : 'Hash Válido') : 'Aguardando validação'}
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${backupStage === 'restored' ? (backupCorrupted ? 'bg-red-950/40 border-red-500 text-red-300' : 'bg-emerald-950/40 border-emerald-500 text-emerald-300') : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <Database className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">3. Restore Drill (--dry-run)</div>
                <div className="text-[10px] mt-1">{backupStage === 'restored' ? (backupCorrupted ? 'Falha no restore' : '100% Restaurável!') : 'Não executado'}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                <input
                  type="checkbox"
                  checked={backupCorrupted}
                  onChange={e => setBackupCorrupted(e.target.checked)}
                  className="w-4 h-4 rounded text-red-500 bg-slate-950 border-slate-700"
                />
                <span>Simular Arquivo de Dump Corrompido / Truncado na Gravação</span>
              </label>

              <button
                onClick={runBackupStep}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all"
              >
                {backupStage === 'none' && 'Passo 1: Gerar Backup (pg_dump)'}
                {backupStage === 'dumped' && 'Passo 2: Calcular Checksum SHA256'}
                {backupStage === 'hashed' && 'Passo 3: Executar Restore Drill (pg_restore)'}
                {backupStage === 'restored' && 'Reiniciar Ciclo de Teste'}
              </button>
            </div>
          </div>
        )}

        {/* Live Simulator Log Strip */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between gap-3 text-cyan-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">$</span>
            <span className="leading-relaxed">{animLog}</span>
          </div>

          <button
            onClick={() => {
              setAnimStep(0);
              setAnimLog('Pronto para iniciar a simulação interativa.');
              sounds.playKeyTap();
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Resetar estado"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* GAMIFIED QUIZ & MASTERY CHALLENGE SECTION */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Desafio de Fixação do Módulo
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Validação Teórica (+{module.baseXp} XP)
          </span>
        </div>

        <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
          {module.quizQuestion}
        </p>

        {/* Quiz Options */}
        <div className="space-y-2.5 pt-1">
          {module.quizOptions.map((opt, idx) => {
            const isSelected = selectedQuizOption === idx;
            let btnStyle =
              'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 text-slate-200';

            if (quizSubmitted) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40';
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleQuizAnswer(idx)}
                disabled={quizSubmitted}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 leading-relaxed ${btnStyle}`}
              >
                <span>{opt.text}</span>
                {quizSubmitted && opt.isCorrect && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {quizSubmitted && isSelected && !opt.isCorrect && (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback explanation after quiz */}
        {quizSubmitted && selectedQuizOption !== null && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in ${
              quizCorrect
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 font-mono text-[11px]">
              {quizCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Conceito Dominado! (+{module.baseXp} XP Concedido)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Explicação Didática:</span>
                </>
              )}
            </div>
            <p>{module.quizOptions[selectedQuizOption].explanation}</p>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                Módulo Concluído com Sucesso!
              </span>
              <h3 className="text-xl font-black text-white font-mono mt-1">
                {module.title}
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block font-mono">XP Conquistado</span>
                <span className="text-emerald-400 font-mono font-bold text-lg mt-0.5">
                  +{module.baseXp} XP
                </span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="text-slate-400 block font-mono">Categoria</span>
                <span className="text-white font-mono font-bold text-xs mt-0.5">
                  {module.category}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition-colors font-mono"
              >
                Rever Laboratório
              </button>

              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  handleNextModule();
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold font-mono bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-2"
              >
                <span>Próximo Módulo Interativo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
