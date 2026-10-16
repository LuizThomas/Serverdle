import { SimulationModule } from '../types/game';

export const SIMULATION_MODULES: SimulationModule[] = [
  {
    id: 'sim_tcp_handshake',
    title: 'Three-Way Handshake TCP',
    subtitle: 'O Estabelecimento Confiável de Conexão na Camada 4',
    category: 'Protocolos & Conexões',
    icon: 'network',
    description: 'Experimente a dança de sincronização em três vias do protocolo TCP antes que qualquer dado ou consulta SQL possa trafegar entre o cliente e o banco de dados.',
    keyConcepts: [
      'Passo 1: Cliente envia flag SYN (Synchronize)',
      'Passo 2: Servidor responde com SYN-ACK (Acknowledge)',
      'Passo 3: Cliente confirma com ACK final',
      'Estado ESTABLISHED: o canal de transporte fica pronto para transações',
      'Se a porta estiver fechada, o servidor responde com RST (Reset)'
    ],
    baseXp: 250,
    quizQuestion: 'Por que o protocolo TCP exige o Three-Way Handshake antes de enviar comandos SQL para o SGBD?',
    quizOptions: [
      {
        text: 'Para sincronizar números de sequência iniciais e garantir que ambas as partes consigam enviar e receber pacotes de forma ordenada.',
        isCorrect: true,
        explanation: 'Exato! O handshake em três vias garante a confiabilidade bidirecional da conexão, prevenindo perdas e pacotes duplicados.'
      },
      {
        text: 'Para formatar automaticamente a partição de disco do servidor remoto.',
        isCorrect: false,
        explanation: 'Incorreto. O handshake atua apenas no nível de transporte de rede, sem relação com formatação de partições.'
      },
      {
        text: 'Para criptografar o tráfego com uma chave simétrica de 4096 bits.',
        isCorrect: false,
        explanation: 'Incorreto. A criptografia é responsabilidade da camada TLS/SSL, que é negociada após o handshake TCP.'
      }
    ]
  },
  {
    id: 'sim_dns_resolution',
    title: 'A Jornada da Resolução DNS',
    subtitle: 'Como Nomes de Host se Convertem em Endereços IP',
    category: 'Resolução & DNS',
    icon: 'search',
    description: 'Acompanhe visualmente a viagem de um pacote de consulta DNS na porta 53 UDP, traduzindo "db.empresa.local" para o endereço físico/lógico IP do cluster.',
    keyConcepts: [
      'Cliente emite consulta UDP na porta 53',
      'Servidor DNS pesquisa registros do Tipo "A" na zona corporativa',
      'Resposta contém o IP numérico (ex: 192.168.10.25)',
      'Cache DNS local reduz requisições redundantes à rede',
      'Status NXDOMAIN: indica que o nome pesquisado não existe na zona'
    ],
    baseXp: 250,
    quizQuestion: 'O que ocorre quando uma aplicação tenta conectar a "db-banco.local" e o DNS retorna NXDOMAIN?',
    quizOptions: [
      {
        text: 'A aplicação não consegue obter o IP numérico e falha com erro "host not found", mesmo que o servidor físico esteja perfeitamente ligado.',
        isCorrect: true,
        explanation: 'Correto! Sem a resolução de nomes, a pilha de rede não sabe para qual endereço IP despachar os pacotes TCP.'
      },
      {
        text: 'O switch local desliga a porta de rede automaticamente.',
        isCorrect: false,
        explanation: 'Incorreto. Falhas de DNS ocorrem na camada de aplicação e não afetam o hardware do switch.'
      },
      {
        text: 'A velocidade de transmissão da rede cai pela metade.',
        isCorrect: false,
        explanation: 'Incorreto. O tráfego de rede geral não é afetado por uma consulta que falhou.'
      }
    ]
  },
  {
    id: 'sim_firewall_shield',
    title: 'O Escudo do Firewall Stateful',
    subtitle: 'Filtragem por Portas, Protocolos e Estados de Conexão',
    category: 'Segurança & Firewall',
    icon: 'shield',
    description: 'Ative feixes de proteção e teste o disparo de pacotes em tempo real. Veja regras de ACCEPT e DROP atuando sobre portas HTTP (80), HTTPS (443) e PostgreSQL (5432).',
    keyConcepts: [
      'Inspeção com Estado (Stateful): rastreia sessões estabelecidas',
      'Ação ACCEPT: pacote passa pelo feixe e alcança o socket de destino',
      'Ação DROP: pacote é descartado silenciosamente (gera timeout no cliente)',
      'Ação REJECT: descarta e avisa o cliente com pacote TCP RST',
      'Princípio de Defesa em Profundidade: isolar o SGBD apenas para a sub-rede web'
    ],
    baseXp: 250,
    quizQuestion: 'Qual é a principal diferença entre uma regra DROP e uma regra REJECT no firewall?',
    quizOptions: [
      {
        text: 'O DROP descarta o pacote sem dar retorno (causando timeout no cliente), enquanto o REJECT avisa ativamente que a porta está fechada.',
        isCorrect: true,
        explanation: 'Perfeito! O DROP é útil para proteger contra varreduras de portas (port scans) porque não gasta recursos avisando o remetente.'
      },
      {
        text: 'O DROP apaga o arquivo executável do servidor de banco.',
        isCorrect: false,
        explanation: 'Incorreto. O firewall lida exclusivamente com pacotes de rede.'
      },
      {
        text: 'O REJECT permite o tráfego se a senha for digitada em 5 segundos.',
        isCorrect: false,
        explanation: 'Incorreto. REJECT é uma negação imediata com envio de pacote de erro TCP/ICMP.'
      }
    ]
  },
  {
    id: 'sim_acid_wal',
    title: 'Ciclo de Vida do WAL e Transações ACID',
    subtitle: 'Buffer Pool em Memória RAM vs Persistência no SSD',
    category: 'SGBD & Transações',
    icon: 'database',
    description: 'Compreenda a mágica que impede perda de dados: veja uma transação SQL sendo aplicada na memória RAM e garantida de forma durável através do Write-Ahead Log (WAL) no disco.',
    keyConcepts: [
      'Páginas alteradas residem no Buffer Pool como "Dirty Pages"',
      'Write-Ahead Logging (WAL): o log é gravado sequencialmente no SSD ANTES do commit',
      'Propriedade de Durabilidade (ACID): mesmo se a energia cair, o WAL restaura os dados',
      'Checkpoint: processo que descarrega periodicamente as páginas da RAM para os arquivos finais',
      'Disco 100% cheio impede a escrita no WAL e força parada do SGBD'
    ],
    baseXp: 250,
    quizQuestion: 'Por que o SGBD grava no Write-Ahead Log (WAL) antes de gravar a tabela definitiva no disco?',
    quizOptions: [
      {
        text: 'Porque a gravação sequencial do WAL é ultrarrápida e garante a durabilidade ACID de transações confirmadas mesmo se o servidor desligar.',
        isCorrect: true,
        explanation: 'Exato! Gravar dados aleatoriamente em tabelas e índices pesados demoraria muito; o log sequencial em disco garante que tudo possa ser recuperado.'
      },
      {
        text: 'Para reduzir o tamanho do banco de dados para metade do espaço.',
        isCorrect: false,
        explanation: 'Incorreto. O WAL na verdade consome espaço adicional temporário justamente para garantir segurança.'
      },
      {
        text: 'Para impedir que o usuário execute comandos SQL com letras maiúsculas.',
        isCorrect: false,
        explanation: 'Incorreto. O WAL não lida com sintaxe de comandos.'
      }
    ]
  },
  {
    id: 'sim_btree_vs_seqscan',
    title: 'Índice B-Tree vs Varredura Sequencial (Seq Scan)',
    subtitle: 'A Anatomia do Desempenho e Tuning em Consultas SQL',
    category: 'Performance & Tuning',
    icon: 'cpu',
    description: 'Compare lado a lado em tempo real: veja a CPU ir a 100% lendo 100 blocos sequencialmente em disco, contra uma busca instantânea em 3 saltos em uma árvore balanceada B-Tree.',
    keyConcepts: [
      'Seq Scan: lê cada linha da tabela (complexidade O(N))',
      'Índice B-Tree: divide a busca logaritmicamente (complexidade O(log N))',
      'Leituras de I/O em disco são os maiores gargalos de tempo de resposta',
      'EXPLAIN ANALYZE mostra o tempo planejado vs tempo real da consulta',
      'Índices aumentam a velocidade de leitura mas requerem manutenção em INSERTs'
    ],
    baseXp: 250,
    quizQuestion: 'O que acontece em um banco de dados com 15 milhões de linhas quando uma consulta executa um Full Table Scan (Seq Scan)?',
    quizOptions: [
      {
        text: 'O SGBD é forçado a ler todos os blocos de disco da tabela um por um, saturando a CPU e aumentando o tempo de resposta de milissegundos para dezenas de segundos.',
        isCorrect: true,
        explanation: 'Correto! Sob alta concorrência, dezenas de clientes fazendo Seq Scan travam os processadores do servidor.'
      },
      {
        text: 'O banco de dados se desconecta automaticamente da tomada.',
        isCorrect: false,
        explanation: 'Incorreto. O hardware continua funcionando, mas sob carga de processamento extrema.'
      },
      {
        text: 'O cabo de rede se desconecta do switch.',
        isCorrect: false,
        explanation: 'Incorreto. O gargalo é interno de processamento e leitura de disco no servidor.'
      }
    ]
  },
  {
    id: 'sim_connection_pooling',
    title: 'Connection Pooling (PgBouncer) vs Exaustão',
    subtitle: 'Como Suportar Milhares de Usuários Sem Esgotar o max_connections',
    category: 'Concorrência & Pools',
    icon: 'layers',
    description: 'Veja o que acontece quando 50 clientes tentam conexões simultâneas: sem pool o limite de 10 conexões estoura imediatamente; com PgBouncer, 5 conexões reais atendem todos com perfeição!',
    keyConcepts: [
      'Cada conexão no PostgreSQL cria um processo de backend dedicado (consome RAM)',
      'max_connections impõe um limite rígido para preservar recursos do servidor',
      'Conexões "idle" (ociosas) abertas e não fechadas bloqueiam outros clientes',
      'PgBouncer: middleware leve que multiplexa milhares de sessões em poucos sockets reais',
      'Evita erros fatais de "too many clients already connected"'
    ],
    baseXp: 250,
    quizQuestion: 'Qual é o papel fundamental de um intermediário de Connection Pooling como o PgBouncer?',
    quizOptions: [
      {
        text: 'Manter um pool de conexões pré-estabelecidas com o banco e reutilizá-las para atender milhares de requisições web curtas de forma rápida e eficiente.',
        isCorrect: true,
        explanation: 'Excelente! O connection pooler evita a criação e destruição repetitiva de processos pesados no SGBD, poupando CPU e memória.'
      },
      {
        text: 'Duplicar o banco em outro país em menos de 1 milissegundo.',
        isCorrect: false,
        explanation: 'Incorreto. Isso seria replicação geográfica, função não pertencente a um pooler de conexões.'
      },
      {
        text: 'Eliminar a necessidade de senhas no banco de dados.',
        isCorrect: false,
        explanation: 'Incorreto. O PgBouncer ainda respeita e autentica as credenciais dos usuários.'
      }
    ]
  },
  {
    id: 'sim_backup_restore_drill',
    title: 'Integridade de Backup & Simulação de Restore',
    subtitle: 'A Validação que Salva Empresas de Desastres de Dados',
    category: 'Backup & Continuidade',
    icon: 'hard-drive',
    description: 'Gere um dump de banco, calcule o hash criptográfico SHA256 e teste a restauração com a flag --dry-run. Veja como detectar arquivos truncados antes que um desastre aconteça.',
    keyConcepts: [
      'Dump Lógico: script de DDL e dados exportados pelo pg_dump',
      'Compressão GZIP: reduz o tamanho do arquivo para armazenamento seguro',
      'Hash SHA256: impressão digital única que prova se o arquivo foi corrompido',
      'Restore Drill: teste prático regular de restauração em ambiente isolado',
      'Regra de ouro: um backup só existe se a restauração tiver sido testada'
    ],
    baseXp: 250,
    quizQuestion: 'Por que o administrador de banco deve validar o hash criptográfico e executar testes regulares de restauração (Restore Drills)?',
    quizOptions: [
      {
        text: 'Para garantir que o arquivo de backup não foi truncado nem corrompido por falhas de escrita ou memória, certificando que os dados podem ser recuperados em um desastre real.',
        isCorrect: true,
        explanation: 'Brilhante! Descobrir que um arquivo de backup está quebrado no momento em que a produção caiu é o pior cenário para qualquer empresa.'
      },
      {
        text: 'Para alterar as cores dos gráficos do sistema operacional.',
        isCorrect: false,
        explanation: 'Incorreto. A validação de backup lida com integridade de dados e sobrevivência do negócio.'
      },
      {
        text: 'Para acelerar a taxa de upload da placa de rede.',
        isCorrect: false,
        explanation: 'Incorreto. Trata-se de garantia de integridade de armazenamento.'
      }
    ]
  }
];
