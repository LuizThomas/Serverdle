export interface NetworkTopic {
  id: string;
  category: 'Fundamentos & Modelo OSI' | 'Protocolos & Conectividade' | 'Hardware & Infraestrutura' | 'Segurança & Firewall' | 'SGBD & Banco de Dados' | 'Disponibilidade & Performance';
  title: string;
  summary: string;
  detailedText: string;
  keyConcepts: string[];
  associatedChallenges: string[];
  practicalTip: string;
}

export const NETWORK_KNOWLEDGE_TOPICS: NetworkTopic[] = [
  {
    id: 'topic_osi_tcpip',
    category: 'Fundamentos & Modelo OSI',
    title: 'Modelo OSI e Arquitetura Cliente-Servidor',
    summary: 'A base em camadas da comunicação digital: da transmissão elétrica/óptica física até as transações de aplicações empresariais.',
    detailedText: 'O modelo OSI (Open Systems Interconnection) organiza a comunicação em 7 camadas teóricas, enquanto a pilha TCP/IP a simplifica em 4 camadas práticas: Enlace (física/MAC), Rede (IP), Transporte (TCP/UDP) e Aplicação (HTTP, DNS, SGBDs). Na arquitetura Cliente-Servidor, o cliente inicia ativamente requisições solicitando recursos ou consultas, enquanto o servidor atua como repositório centralizado, escutando em portas de rede dedicadas e garantindo concorrência, consistência e segurança dos dados.',
    keyConcepts: [
      'Camada 1 (Física): sinais elétricos e fibra óptica',
      'Camada 2 (Enlace): quadros Ethernet e endereços MAC de 48 bits',
      'Camada 3 (Rede): pacotes IP e roteamento entre redes',
      'Camada 4 (Transporte): portas e controle de fluxo TCP/UDP',
      'Camada 7 (Aplicação): protocolos de banco e web'
    ],
    associatedChallenges: ['WordDLE: SERVIDOR', 'ImageDLE: Computador Cliente', 'NetFixDLE: Todas as Missões'],
    practicalTip: 'Ao diagnosticar qualquer falha, comece sempre de baixo para cima: cabo/link físico → conectividade IP (ping) → porta TCP (nc) → autenticação na aplicação.'
  },
  {
    id: 'topic_dns',
    category: 'Protocolos & Conectividade',
    title: 'DNS (Domain Name System) e Resolução de Nomes',
    summary: 'O sistema distribuído que mapeia nomes amigáveis para endereços IP numéricos na Internet e redes corporativas.',
    detailedText: 'Computadores e servidores se comunicam através de endereços IP numéricos (ex: 192.168.10.25). O DNS traduz nomes legíveis (como db-cluster.empresa.local) para esses endereços através de registros do tipo A (IPv4), AAAA (IPv6) e CNAME. Caso o DNS responda com NXDOMAIN (domínio inexistente) ou retorne um IP obsoleto, a aplicação cliente nunca conseguirá encontrar o servidor de banco, mesmo que o hardware deste esteja 100% saudável.',
    keyConcepts: [
      'Porta padrão: UDP/TCP 53',
      'Registros A (IPv4) e CNAME (apelido de domínio)',
      'Status NXDOMAIN: indica que o nome não existe na zona DNS',
      'Cache DNS local: acelera consultas, mas pode causar apontamentos fantasmas'
    ],
    associatedChallenges: ['WordDLE: DNS', 'NetFixDLE: Missão 1 (DNS Incorreto)'],
    practicalTip: 'Use o comando "dig +short <hostname>" ou "nslookup" para verificar o IP exato que o seu servidor DNS está devolvendo antes de suspeitar de falha na aplicação.'
  },
  {
    id: 'topic_tcp_ports',
    category: 'Protocolos & Conectividade',
    title: 'Protocolo TCP, Portas Lógicas e Multiplexação',
    summary: 'Como o sistema operacional direciona fluxos de rede simultâneos para processos de banco de dados específicos.',
    detailedText: 'O TCP (Transmission Control Protocol) é orientado à conexão e garante entrega ordenada e sem perdas através do Three-Way Handshake (SYN → SYN-ACK → ACK). O número de porta (16 bits, de 0 a 65535) identifica qual daemon no servidor deve receber os pacotes. Por convenção, portas de SGBDs comuns incluem: PostgreSQL (5432), MySQL/MariaDB (3306), SQL Server (1433) e Oracle (1521). Uma porta pode estar fechada se o serviço estiver parado, ou filtrada se um firewall descartar os pacotes SYN silenciosamente.',
    keyConcepts: [
      'Three-Way Handshake: SYN, SYN-ACK, ACK',
      'Portas padrão de SGBD: 5432 (PostgreSQL), 3306 (MySQL), 1433 (SQL Server)',
      'Multiplexação: um único endereço IP atendendo múltiplos serviços',
      'Estados de socket: LISTEN, ESTABLISHED, TIME_WAIT, CLOSE_WAIT'
    ],
    associatedChallenges: ['WordDLE: TCP', 'WordDLE: PORTA', 'NetFixDLE: Missão 2 (Porta Bloqueada)'],
    practicalTip: 'O ping testa apenas a Camada 3 (IP). Para saber se o banco está ouvindo na porta TCP, use "nc -zv <IP> <PORTA>".'
  },
  {
    id: 'topic_hardware',
    category: 'Hardware & Infraestrutura',
    title: 'Dispositivos de Rede & Datacenter: Roteador, Switch e Racks',
    summary: 'A infraestrutura física que sustenta os pacotes: switches comutadores, roteadores de borda, cabos Cat6 e servidores em rack.',
    detailedText: 'O Switch opera na Camada 2 do modelo OSI. Ele lê o endereço físico MAC no cabeçalho do quadro Ethernet e direciona o tráfego apenas para a porta onde o dispositivo destinatário está conectado, eliminando colisões. Já o Roteador atua na Camada 3, decidindo rotas entre sub-redes com faixas de IP distintas e conectando a LAN corporativa à Internet. Servidores de banco costumam ser instalados em racks padronizados de 19 polegadas, dotados de fontes redundantes, memórias ECC e storages em RAID com discos SSD NVMe.',
    keyConcepts: [
      'Switch: Camada 2, comuta quadros via tabela CAM de endereços MAC',
      'Roteador: Camada 3, encaminha pacotes via tabela de rotas e protocolos OSPF/BGP',
      'Rack 19": organização modular medida em unidades "U" (1U = 44,45 mm)',
      'Cabos Cat6/RJ-45: tráfego Gigabit e 10G até 100 metros'
    ],
    associatedChallenges: ['ImageDLE: Todos os 10 dispositivos', 'WordDLE: SWITCH', 'WordDLE: ROTEADOR'],
    practicalTip: 'Nunca conecte um servidor de produção diretamente sem passar por um switch gerenciável e um firewall com redundância física de portas.'
  },
  {
    id: 'topic_security',
    category: 'Segurança & Firewall',
    title: 'Segurança de Rede, Firewalls e VLANs',
    summary: 'Segmentação e filtragem: como proteger servidores de banco de dados contra acessos não autorizados e ataques.',
    detailedText: 'Um Firewall inspeciona o estado do tráfego (Stateful Inspection) e aplica regras de filtragem (ex: ACCEPT, DROP, REJECT) com base em IP de origem, IP de destino, protocolo e porta. No Linux, isso é gerenciado no kernel via iptables ou nftables (ou abstraído por ferramentas como UFW). Além do firewall, as VLANs (IEEE 802.1Q) segmentam o switch físico em redes lógicas independentes, isolando computadores de funcionários da VLAN restrita de servidores de banco de dados.',
    keyConcepts: [
      'Stateful Firewall: acompanha o ciclo de vida das conexões TCP',
      'VLAN (802.1Q): divisão de domínios de broadcast em nível de switch',
      'Regra DROP vs REJECT: DROP descarta em silêncio gerando timeout; REJECT envia TCP RST',
      'Criptografia TLS: encriptação de ponta a ponta do canal SQL'
    ],
    associatedChallenges: ['WordDLE: FIREWALL', 'WordDLE: VLAN', 'WordDLE: TLS', 'NetFixDLE: Missão 2'],
    practicalTip: 'Bancos de dados nunca devem ter sua porta (5432/3306) exposta diretamente para a Internet pública (0.0.0.0/0).'
  },
  {
    id: 'topic_sgbd_architecture',
    category: 'SGBD & Banco de Dados',
    title: 'SGBD: Arquitetura, Cache em Memória e WAL',
    summary: 'O núcleo de processamento de dados: concorrência, transações ACID, buffer pool e durabilidade em disco.',
    detailedText: 'O SGBD (Sistema de Gerenciamento de Banco de Dados) orquestra consultas SQL e garante as propriedades ACID (Atomicidade, Consistência, Isolamento e Durabilidade). Para oferecer alto desempenho, o SGBD mantém blocos de dados em cache na memória RAM (buffer pool / shared_buffers). Para garantir que nenhuma transação seja perdida em caso de queda de energia antes de gravar no disco final, o SGBD utiliza o mecanismo Write-Ahead Logging (WAL): todas as alterações são primeiro gravadas sequencialmente no log antes de aplicadas às tabelas.',
    keyConcepts: [
      'Propriedades ACID: pilares da consistência relacional',
      'Buffer Pool / Cache: leituras em RAM são milhares de vezes mais rápidas que em disco',
      'Write-Ahead Logging (WAL): gravação sequencial de transações para recuperação rápida',
      'Daemon de background: processos gerenciadores de escrita e limpeza (autovacuum)'
    ],
    associatedChallenges: ['WordDLE: SGBD', 'WordDLE: CACHE', 'WordDLE: SQL', 'NetFixDLE: Missão 6'],
    practicalTip: 'Se a partição de disco do SGBD encher 100%, o banco não consegue mais gravar arquivos de WAL e entrará em pânico emergencial para proteger a integridade dos dados.'
  },
  {
    id: 'topic_auth_permissions',
    category: 'Segurança & Firewall',
    title: 'Autenticação vs Autorização (DCL & GRANT)',
    summary: 'A diferença crucial entre provar quem você é e ter permissão para manipular dados específicos.',
    detailedText: 'Autenticação valida a identidade do usuário (login e senha, certificados digitais, restrição de IP de origem como usuario@host no MySQL). Já Autorização determina o que o usuário autenticado pode fazer, controlado pela DCL (Data Control Language) através dos comandos GRANT e REVOKE. Um usuário pode autenticar com 100% de sucesso e mesmo assim receber "ERROR 42501: permission denied for table" caso não possua privilégio SELECT/UPDATE no objeto.',
    keyConcepts: [
      'Autenticação: validação de credenciais de login e origem de rede',
      'Autorização: checagem de privilégios SQL em tabelas, views e esquemas',
      'Comandos DCL: GRANT SELECT, INSERT, UPDATE TO <usuario>;',
      'Princípio do Menor Privilégio: conceder apenas o estritamente necessário'
    ],
    associatedChallenges: ['WordDLE: LOGIN', 'NetFixDLE: Missão 3 (Autenticação)', 'NetFixDLE: Missão 4 (Autorização)'],
    practicalTip: 'Quando receber "Access Denied", verifique se o erro ocorreu durante o handshake de login ou se foi ao tentar rodar uma instrução SELECT específica.'
  },
  {
    id: 'topic_performance_tuning',
    category: 'Disponibilidade & Performance',
    title: 'Desempenho, Índices B-Tree e EXPLAIN ANALYZE',
    summary: 'Como evitar gargalos de CPU e lentidão extrema otimizando planos de execução e caminhos de acesso.',
    detailedText: 'Sem índices adequados, o SGBD precisa ler todas as páginas de dados do disco para encontrar registros filtrados, operação conhecida como Varredura Sequencial (Full Table Scan / Seq Scan). Em tabelas com milhões de linhas, isso satura os núcleos de CPU em 100% e eleva o tempo de resposta de milissegundos para dezenas de segundos. Criar índices B-Tree nas colunas pesquisadas permite ao planejador de consultas usar um Index Scan, reduzindo o custo de processamento drasticamente.',
    keyConcepts: [
      'Seq Scan: varredura completa linha a linha (custo O(N))',
      'Index Scan (B-Tree): busca em árvore balanceada (custo O(log N))',
      'EXPLAIN ANALYZE: revela o plano real executado pelo otimizador e o tempo de cada etapa',
      'Gargalo de CPU vs I/O de disco'
    ],
    associatedChallenges: ['NetFixDLE: Missão 5 (Servidor Lento)', 'WordDLE: CACHE'],
    practicalTip: 'Nunca adicione memória às cegas em um servidor lento sem antes analisar as consultas no Slow Query Log ou no pg_stat_statements.'
  },
  {
    id: 'topic_backup_dr',
    category: 'Disponibilidade & Performance',
    title: 'Backup, Integridade de Dados e Restauração',
    summary: 'A garantia de sobrevivência dos dados: dumps lógicos, backups físicos e a regra de ouro dos testes de restauração.',
    detailedText: 'Existem dois tipos fundamentais de backup em SGBDs: Lógicos (scripts SQL e dumps binários com pg_dump/mysqldump) e Físicos (cópias bloco a bloco dos arquivos de dados + WAL). A máxima dos administradores de sistemas afirma: "Você não tem um backup até ter testado com sucesso a sua restauração". Validações de tamanho, códigos de retorno em scripts (set -e) e hashes criptográficos (SHA256/MD5) previnem desastres causados por arquivos de backup truncados ou corrompidos por falta de memória.',
    keyConcepts: [
      'RPO (Recovery Point Objective): quanto tempo de dados a empresa tolera perder',
      'RTO (Recovery Time Objective): quanto tempo a empresa tolera ficar fora do ar',
      'Validação de Checksum: verificação de integridade via hash criptográfico',
      'Restore Drill: simulação periódica de restauração em ambiente isolado'
    ],
    associatedChallenges: ['WordDLE: BACKUP', 'NetFixDLE: Missão 7 (Backup Não Restaurável)'],
    practicalTip: 'Automatize testes de restauração (dry-run ou restore em ambiente de homologação) semanalmente para não descobrir que o dump estava corrompido no dia de um incidente real.'
  },
  {
    id: 'topic_pooling_concurrency',
    category: 'Disponibilidade & Performance',
    title: 'Concorrência, max_connections e Connection Pooling',
    summary: 'Como gerenciar centenas de clientes simultâneos sem sobrecarregar a memória do servidor com PgBouncer.',
    detailedText: 'No PostgreSQL e em muitos SGBDs, cada conexão cliente cria um processo de backend dedicado na memória do servidor. O parâmetro max_connections impõe um teto para evitar exaustão de recursos. Se aplicações web abrirem conexões diretas sem fechá-las, dezenas de sessões ficarão no estado ocioso (idle), estourando o limite e bloqueando novos usuários. O uso de um intermediário de Connection Pooling (como PgBouncer) reutiliza um conjunto fixo de conexões físicas para milhares de requisições web curtas.',
    keyConcepts: [
      'max_connections: limite máximo de clientes simultâneos no SGBD',
      'PgBouncer / Proxy: connection pooling de alta performance',
      'Estados idle vs active: conexões abertas sem uso consomem slots preciosos',
      'Pool na aplicação: reaproveitamento de sockets TCP estabelecidos'
    ],
    associatedChallenges: ['NetFixDLE: Missão 8 (Conexões Esgotadas)'],
    practicalTip: 'Aumentar indefinidamente o max_connections no PostgreSQL degrada a performance global da CPU; a solução correta para alta concorrência é sempre usar um pooler de conexões.'
  }
];
