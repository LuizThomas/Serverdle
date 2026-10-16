import React from 'react';
import { X, Keyboard, Image, Wrench, Shield, Check, Flame, Trophy, Zap } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Manual de Operações — Como Jogar</h3>
              <p className="text-xs text-slate-400">Regras e mecânicas do ServerDLE</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Phase 1 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Keyboard className="w-4 h-4" />
              <span>Fase 1 — WordDLE: Adivinhe o Conceito</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Descubra termos de redes e bancos de dados (como DNS, TCP, VLAN, SGBD, BACKUP, FIREWALL) em até 6 tentativas. O tamanho da grade se adapta automaticamente ao tamanho da palavra.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono pt-1">
              <div className="px-2.5 py-1.5 bg-emerald-600/90 text-white rounded font-bold">V</div>
              <span className="text-slate-400">Verde: Letra correta na posição exata</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="px-2.5 py-1.5 bg-amber-500/90 text-white rounded font-bold">A</div>
              <span className="text-slate-400">Amarelo: Letra existe na resposta, mas em outra posição</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="px-2.5 py-1.5 bg-slate-700 text-slate-300 rounded font-bold">C</div>
              <span className="text-slate-400">Cinza: Letra ausente da palavra</span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Dica: Você pode revelar pistas técnicas opcionais com desconto de pontuação.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Image className="w-4 h-4" />
              <span>Fase 2 — ImageDLE: Descubra o Dispositivo</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inspecione fotografias reais de equipamentos de infraestrutura (Switches, Roteadores, Servidores de Rack, Firewalls, Cabos RJ-45, SSDs) e responda ao desafio associado à sua função e camada OSI.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Fase 3 — NetSim: Laboratório & Simulador Animado</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Experimente simulações interativas gamificadas onde você manipula a rede visualmente em tempo real:
            </p>
            <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
              <li>Dispare o Three-Way Handshake TCP (SYN, SYN-ACK, ACK) e veja o efeito de portas abertas vs fechadas.</li>
              <li>Acompanhe a viagem do pacote UDP 53 na resolução de nomes DNS até o IP do cluster.</li>
              <li>Teste o feixe do firewall bloqueando portas e varreduras com animações de impacto.</li>
              <li>Simule transações ACID com gravação síncrona no WAL no SSD e teste quedas de energia.</li>
              <li>Compare a leitura lenta de 100 blocos (Seq Scan) contra o salto instantâneo da Árvore B-Tree.</li>
              <li>Domine o Connection Pooling (PgBouncer) atendendo 50 clientes sem estourar o max_connections.</li>
              <li>Conclua cada módulo respondendo ao desafio de fixação para ganhar +250 XP!</li>
            </ul>
          </div>

          {/* Scoring and progression */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Pontuação e Progressão
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <div className="text-slate-400 text-[11px]">WordDLE</div>
                <div className="text-cyan-400 font-bold font-mono mt-0.5">Até 100 XP</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <div className="text-slate-400 text-[11px]">ImageDLE</div>
                <div className="text-purple-400 font-bold font-mono mt-0.5">Até 200 XP</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <div className="text-slate-400 text-[11px]">NetSim Lab</div>
                <div className="text-emerald-400 font-bold font-mono mt-0.5">Até 250 XP</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <div className="text-slate-400 text-[11px]">Sequência</div>
                <div className="text-amber-400 font-bold font-mono mt-0.5">+Bônus 🔥</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-mono transition-colors"
          >
            Entendido, Iniciar Missão
          </button>
        </div>
      </div>
    </div>
  );
};
