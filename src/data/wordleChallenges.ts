import { WordleChallenge } from '../types/game';

export const WORDLE_CHALLENGES: WordleChallenge[] = [
  {
    id: 'w_dns',
    word: 'DNS',
    category: 'Protocolos',
    difficulty: 'Fácil',
    primaryClue: 'Protocolo da camada de aplicação responsável por traduzir nomes de domínio legíveis por humanos em endereços IP numéricos.',
    optionalHints: [
      'Opera primariamente na porta UDP 53.',
      'Evita que os usuários precisem memorizar sequências como 142.250.190.46.'
    ],
    explanation: 'O DNS (Domain Name System) atua como a lista telefônica da Internet e de redes corporativas. Ele mapeia nomes de hosts (ex: db.empresa.local) para endereços IP (ex: 192.168.1.50). Na administração de redes, falhas de resolução de nomes são causas comuns de indisponibilidade em sistemas distribuídos.',
    baseXp: 100
  },
  {
    id: 'w_tcp',
    word: 'TCP',
    category: 'Protocolos',
    difficulty: 'Fácil',
    primaryClue: 'Protocolo de transporte orientado à conexão que garante entrega ordenada e confiável de pacotes através do handshake em três vias.',
    optionalHints: [
      'Trabalha em conjunto com o protocolo IP na camada 4 do modelo OSI.',
      'Realiza controle de fluxo, retransmissão de perdas e confirmações (ACK).'
    ],
    explanation: 'O TCP (Transmission Control Protocol) estabelece uma conexão confiável através do Three-Way Handshake (SYN, SYN-ACK, ACK). É o protocolo de transporte padrão para conexões a SGBDs (PostgreSQL, MySQL, SQL Server) e serviços web (HTTP/HTTPS), garantindo que nenhum byte de dados ou transação seja corrompido ou perdido.',
    baseXp: 100
  },
  {
    id: 'w_sql',
    word: 'SQL',
    category: 'Banco de Dados',
    difficulty: 'Fácil',
    primaryClue: 'Linguagem padrão declarativa utilizada para consultar, manipular e definir estruturas em bancos de dados relacionais.',
    optionalHints: [
      'Comandos comuns incluem SELECT, INSERT, UPDATE, DELETE e CREATE.',
      'Possui subdivisões como DDL (definição), DML (manipulação) e DCL (controle).'
    ],
    explanation: 'O SQL (Structured Query Language) é a base de comunicação entre aplicações cliente e servidores de banco de dados relacionais. Administradores de banco utilizam SQL tanto para extrair dados quanto para gerenciar índices, executar planos de execução e conceder privilégios (GRANT/REVOKE).',
    baseXp: 100
  },
  {
    id: 'w_tls',
    word: 'TLS',
    category: 'Segurança',
    difficulty: 'Fácil',
    primaryClue: 'Protocolo de segurança criptográfico sucessor do SSL que garante confidencialidade e integridade no tráfego de rede.',
    optionalHints: [
      'Utiliza certificados digitais X.509 e chaves assimétricas na negociação.',
      'Habilita o "S" seguro em conexões HTTPS e túneis de banco de dados.'
    ],
    explanation: 'O TLS (Transport Layer Security) protege conexões contra espionagem (eavesdropping) e adulteração (man-in-the-middle). Em administração de SGBDs modernos, o TLS é obrigatório para encriptar dados em trânsito entre clientes remotos e o cluster de banco.',
    baseXp: 100
  },
  {
    id: 'w_sgbd',
    word: 'SGBD',
    category: 'Banco de Dados',
    difficulty: 'Fácil',
    primaryClue: 'Conjunto de softwares responsáveis por gerenciar o acesso, integridade, concorrência e armazenamento dos dados.',
    optionalHints: [
      'Exemplos consagrados incluem PostgreSQL, Oracle, MySQL e SQL Server.',
      'Sigla em português para Sistema de Gerenciamento de Banco de Dados.'
    ],
    explanation: 'O SGBD (Sistema de Gerenciamento de Banco de Dados) isola a aplicação das complexidades de armazenamento físico. Ele gerencia transações ACID, memória compartilhada, processos de background, logs de transações (WAL) e controle de usuários.',
    baseXp: 100
  },
  {
    id: 'w_vlan',
    word: 'VLAN',
    category: 'Redes',
    difficulty: 'Médio',
    primaryClue: 'Tecnologia que permite segmentar uma rede física local em múltiplas redes lógicas independentes dentro do mesmo switch.',
    optionalHints: [
      'Padrão IEEE 802.1Q com tags de cabeçalho Ethernet.',
      'Isola domínios de broadcast e separa, por exemplo, servidores de estações de trabalho.'
    ],
    explanation: 'VLANs (Virtual Local Area Networks) aumentam a segurança e a performance dividindo domínios de broadcast em nível de enlace (camada 2). Em ambientes corporativos, servidores de banco de dados devem residir em uma VLAN dedicada protegida por firewall, longe de computadores de usuários comuns.',
    baseXp: 100
  },
  {
    id: 'w_porta',
    word: 'PORTA',
    category: 'Redes',
    difficulty: 'Fácil',
    primaryClue: 'Identificador numérico de 16 bits (0 a 65535) que direciona o tráfego de rede para um processo ou serviço específico no sistema operacional.',
    optionalHints: [
      'Por padrão, PostgreSQL escuta na 5432, MySQL na 3306 e HTTPS na 443.',
      'Permite que múltiplos servidores de rede rodem no mesmo endereço IP.'
    ],
    explanation: 'A Porta lógica no cabeçalho TCP/UDP permite o multiplexamento de serviços em um mesmo host. Enquanto o IP endereça a máquina na rede, o número de porta entrega os pacotes ao processo correspondente (ex: porta 5432 para o daemon postgres). É um dos pilares nas regras de filtragem de firewall.',
    baseXp: 100
  },
  {
    id: 'w_cache',
    word: 'CACHE',
    category: 'Banco de Dados',
    difficulty: 'Médio',
    primaryClue: 'Camada de armazenamento de alta velocidade em memória volátil que retém dados frequentemente acessados para acelerar leituras.',
    optionalHints: [
      'Em SGBDs, é implementado através do buffer pool (ex: shared_buffers).',
      'Reduz a latência de I/O de disco para frações de milissegundo.'
    ],
    explanation: 'O Cache armazena blocos de tabelas e índices diretamente na memória RAM. Ao consultar um registro já em cache (buffer hit), o SGBD economiza leituras no disco ou SSD, multiplicando o throughput de requisições por segundo.',
    baseXp: 100
  },
  {
    id: 'w_login',
    word: 'LOGIN',
    category: 'Segurança',
    difficulty: 'Fácil',
    primaryClue: 'Procedimento no qual um usuário ou serviço apresenta credenciais para autenticar sua identidade perante o sistema.',
    optionalHints: [
      'Geralmente envolve um identificador de conta e uma senha ou chave criptográfica.',
      'Precede a verificação de autorização (permissões de acesso).'
    ],
    explanation: 'O Login é o primeiro estágio de controle de acesso (autenticação). Somente após o login ser validado com sucesso pelo servidor de banco ou domínio de rede, as regras de autorização (quais tabelas ou pastas o usuário pode ler/escrever) entram em ação.',
    baseXp: 100
  },
  {
    id: 'w_backup',
    word: 'BACKUP',
    category: 'Banco de Dados',
    difficulty: 'Fácil',
    primaryClue: 'Cópia de segurança periódica dos dados e configurações para permitir a recuperação após falhas de hardware, desastres ou exclusão acidental.',
    optionalHints: [
      'Pode ser do tipo completo (full), incremental ou diferencial.',
      'A máxima do administrador dita: um backup só é válido se a restauração tiver sido testada!'
    ],
    explanation: 'O Backup é o pilar central de continuidade de negócios. Em SGBDs, backups físicos (arquivos binários + WAL) ou lógicos (scripts SQL com pg_dump/mysqldump) protegem contra perda catastrófica. O Recovery Time Objective (RTO) e Recovery Point Objective (RPO) dependem diretamente da estratégia de backup.',
    baseXp: 100
  },
  {
    id: 'w_switch',
    word: 'SWITCH',
    category: 'Redes',
    difficulty: 'Fácil',
    primaryClue: 'Equipamento de rede da camada 2 (enlace) que conecta dispositivos locais encaminhando quadros com base no endereço físico MAC.',
    optionalHints: [
      'Possui portas Gigabit/10G e tabela de comutação MAC na memória CAM.',
      'Ao contrário do antigo hub, envia o tráfego somente para a porta de destino.'
    ],
    explanation: 'O Switch de rede opera comutando quadros Ethernet. Ele mantém uma tabela interna de endereços MAC aprendidos em cada porta, garantindo que o tráfego flua sem colisões. Switches gerenciáveis ainda suportam VLANs, agregação de links (LACP) e espelhamento de portas para análise de tráfego.',
    baseXp: 100
  },
  {
    id: 'w_roteador',
    word: 'ROTEADOR',
    category: 'Redes',
    difficulty: 'Médio',
    primaryClue: 'Dispositivo da camada de rede (camada 3) encarregado de determinar a melhor rota e encaminhar pacotes entre redes distintas.',
    optionalHints: [
      'Utiliza tabelas de rotas e protocolos dinâmicos como OSPF e BGP.',
      'Geralmente atua como gateway padrão (Default Gateway) de uma rede local.'
    ],
    explanation: 'O Roteador interconecta redes com endereçamentos IP diferentes (por exemplo, a rede da filial com a matriz, ou a LAN corporativa com a Internet). Ele analisa o endereço IP de destino de cada pacote e consulta sua tabela de roteamento para determinar o próximo salto (next hop).',
    baseXp: 100
  },
  {
    id: 'w_firewall',
    word: 'FIREWALL',
    category: 'Segurança',
    difficulty: 'Médio',
    primaryClue: 'Dispositivo ou software de segurança que monitora e filtra o tráfego de rede de entrada e saída com base em políticas de segurança.',
    optionalHints: [
      'Implementa inspeção de estado de conexões (Stateful Packet Inspection).',
      'Pode bloquear portas não autorizadas e barrar conexões externas indesejadas.'
    ],
    explanation: 'O Firewall estabelece uma barreira entre uma rede confiável interna e redes não confiáveis externas. No contexto de bancos de dados, o firewall de borda ou de host (iptables/ufw) deve garantir que apenas servidores de aplicação autorizados consigam alcançar as portas dos SGBDs.',
    baseXp: 100
  },
  {
    id: 'w_servidor',
    word: 'SERVIDOR',
    category: 'Hardware',
    difficulty: 'Médio',
    primaryClue: 'Computador ou software com alta capacidade e confiabilidade dedicado a fornecer recursos, dados ou serviços para clientes na rede.',
    optionalHints: [
      'Frequentemente montado em formato rack (1U, 2U) com fontes e discos redundantes.',
      'Executa continuamente sistemas operacionais corporativos (Linux/Windows Server).'
    ],
    explanation: 'Um Servidor corporativo possui componentes projetados para operação ininterrupta (24/7): memória RAM com correção de erros (ECC), arranjos de discos em RAID, ventoinhas redundantes e placas de gerenciamento fora de banda (iDRAC/iLO). Ele hospeda os serviços que mantêm a organização funcionando.',
    baseXp: 100
  }
];
