import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  Search,
  Layers,
  Shield,
  Network,
  Database,
  Cpu,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ExternalLink,
  Target
} from 'lucide-react';
import { NETWORK_KNOWLEDGE_TOPICS, NetworkTopic } from '../data/networkKnowledge';

interface NetworkEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhase?: (phase: number) => void;
}

export const NetworkEncyclopediaModal: React.FC<NetworkEncyclopediaModalProps> = ({
  isOpen,
  onClose,
  onSelectPhase
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(
    NETWORK_KNOWLEDGE_TOPICS[0].id
  );

  const categories = [
    'Todas',
    'Fundamentos & Modelo OSI',
    'Protocolos & Conectividade',
    'Hardware & Infraestrutura',
    'Segurança & Firewall',
    'SGBD & Banco de Dados',
    'Disponibilidade & Performance'
  ];

  const filteredTopics = useMemo(() => {
    return NETWORK_KNOWLEDGE_TOPICS.filter(topic => {
      const matchesCategory =
        selectedCategory === 'Todas' || topic.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        topic.title.toLowerCase().includes(query) ||
        topic.summary.toLowerCase().includes(query) ||
        topic.detailedText.toLowerCase().includes(query) ||
        topic.keyConcepts.some(c => c.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
                  Matriz Didática Integrada
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                  {NETWORK_KNOWLEDGE_TOPICS.length} Tópicos
                </span>
              </div>
              <h3 className="text-lg font-black text-white font-mono mt-0.5">
                Enciclopédia de Redes & Servidores de Banco
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Fechar enciclopédia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por conceito (ex: DNS, TCP, Firewall, B-Tree, WAL, Portas, PgBouncer)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 font-mono"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3">
          {filteredTopics.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Nenhum conceito encontrado</p>
              <p className="text-xs text-slate-500 mt-1">Tente pesquisar por outros termos de rede ou banco de dados.</p>
            </div>
          ) : (
            filteredTopics.map(topic => {
              const isExpanded = expandedTopicId === topic.id;
              return (
                <div
                  key={topic.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-xl'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Topic Header Toggle */}
                  <button
                    onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                          {topic.category}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {topic.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {topic.summary}
                      </p>
                    </div>

                    <div className="p-1 rounded-lg bg-slate-800 text-slate-400 shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-4 text-xs border-t border-slate-800/80 animate-in fade-in">
                      {/* Deep text */}
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {topic.detailedText}
                      </p>

                      {/* Key Concepts bullet list */}
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono block">
                          Conceitos Fundamentais:
                        </span>
                        <ul className="space-y-1.5 text-slate-300">
                          {topic.keyConcepts.map((kc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-cyan-400 shrink-0 font-bold">›</span>
                              <span>{kc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Practical sysadmin tip */}
                      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 flex items-start gap-2.5">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[11px] uppercase tracking-wider font-mono text-amber-400 mb-0.5">
                            Dica Prática do Administrador:
                          </strong>
                          <span>{topic.practicalTip}</span>
                        </div>
                      </div>

                      {/* Associated Challenges */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                        <div className="flex flex-wrap items-center gap-1.5 text-slate-400 text-[11px]">
                          <span className="font-mono text-slate-500">Aparece nos desafios:</span>
                          {topic.associatedChallenges.map((ch, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Material 100% alinhado com Servidores de Banco de Dados e Administração de Redes
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-mono transition-colors ml-auto"
          >
            Fechar Enciclopédia
          </button>
        </div>
      </div>
    </div>
  );
};
