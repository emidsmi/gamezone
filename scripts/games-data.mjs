// Catalogo ficticio da GameZone Brasil. Todos os nomes, estudios e publishers sao originais/ficticios.
// [titulo, genero, estudio, publisher, precoEmReais, descontoPercent, lancamento, classificacao, tags, plataformas, resumo]
export const GENRES = {
  acao: "Ação",
  aventura: "Aventura",
  rpg: "RPG",
  corrida: "Corrida",
  esportes: "Esportes",
  estrategia: "Estratégia",
  terror: "Terror",
  indie: "Indie",
  simulacao: "Simulação",
  multiplayer: "Multiplayer",
};

export const PLATFORMS = {
  pc: "PC Windows",
  "game-stick": "Game Stick TV",
  android: "Android",
  "pen-drive": "Pen Drive Plug & Play",
};

const P = ["pc", "game-stick", "pen-drive"];
const PA = ["pc", "game-stick", "android", "pen-drive"];
const PC = ["pc", "pen-drive"];

export const GAMES = [
  // Ação
  ["Lâmina do Eclipse", "acao", "Estúdio Corvo Branco", "Nova Aurora Games", 119.9, 25, "2026-03-14", 16, ["Single player", "Difícil", "Fantasia", "Combate corpo a corpo"], PC, "Um samurai sem sombra caminha entre dois mundos durante um eclipse eterno. Cada duelo é uma dança letal de reflexos e ritmo."],
  ["Fúria de Neon", "acao", "Quasar Forge", "Pulsar Publishing", 89.9, 0, "2026-08-02", 14, ["Cyberpunk", "Frenético", "Single player", "Hack and slash"], P, "Corra por arranha-céus iluminados, corte drones e hackeie a cidade inteira em combates que não deixam você respirar."],
  ["Operação Cinzas", "acao", "Batalhão Digital", "Ferro & Fogo Entretenimento", 149.9, 40, "2025-11-20", 18, ["Tiro tático", "Cooperativo", "Pós-apocalíptico", "Campanha"], PC, "Um esquadrão de elite atravessa uma metrópole devastada para resgatar a última central de energia da região."],
  ["Ronin Cibernético", "acao", "Hanabi Lab", "Nova Aurora Games", 69.9, 0, "2026-05-09", 14, ["Cyberpunk", "Plataforma", "Pixel art", "Difícil"], PA, "Plataforma 2D de alta velocidade em que cada salto corta o ar com uma lâmina de plasma."],
  ["Brigada Vértice", "acao", "Titânio Studio", "Pulsar Publishing", 99.9, 15, "2025-09-12", 12, ["Mechas", "Ficção científica", "Single player", "Campanha"], P, "Pilote um mecha pesado e defenda colônias orbitais contra uma frota que ninguém sabe de onde veio."],
  // Aventura
  ["Ilhas de Aurora", "aventura", "Maré Alta Studio", "Brisa Interativa", 79.9, 20, "2026-02-27", 0, ["Mundo aberto", "Relaxante", "Exploração", "Narrativa"], PA, "Navegue por um arquipélago flutuante, descubra segredos antigos e acorde as luzes que mantêm as ilhas no céu."],
  ["A Trilha dos Vagalumes", "aventura", "Pirilampo Games", "Brisa Interativa", 54.9, 0, "2025-10-03", 0, ["Narrativa", "Família", "Relaxante", "Puzzle"], PA, "Uma criança e uma lanterna viva atravessam uma floresta que muda de forma a cada noite."],
  ["Relicário de Areia", "aventura", "Duna Vermelha Studio", "Ferro & Fogo Entretenimento", 109.9, 30, "2026-06-18", 12, ["Exploração", "Mistério", "Ação-aventura", "Single player"], PC, "Arqueólogos de um deserto sem fim reabrem tumbas que deveriam permanecer seladas."],
  ["Cartógrafo das Nuvens", "aventura", "Papel e Vento", "Nova Aurora Games", 64.9, 0, "2026-09-05", 0, ["Exploração", "Relaxante", "Mundo aberto", "Puzzle"], PA, "Desenhe o mapa de um céu em constante mudança e conecte cidades que nunca se encontraram."],
  // RPG
  ["Crônicas de Valdoran", "rpg", "Torre Alta Studio", "Grimório Publishing", 169.9, 35, "2025-08-15", 14, ["Fantasia", "Mundo aberto", "Escolhas importam", "Single player"], PC, "Um reino em guerra, cinco facções e uma profecia que só você pode reescrever. Cada escolha muda quem sobrevive."],
  ["Herdeiros da Runa Partida", "rpg", "Brasa Antiga", "Grimório Publishing", 139.9, 0, "2026-04-22", 16, ["Fantasia", "Combate por turnos", "Narrativa", "Cooperativo"], PC, "Reúna os herdeiros de uma runa quebrada e reconstrua a magia que sustentava o mundo."],
  ["Sombras de Ember", "rpg", "Cinzeiro Games", "Pulsar Publishing", 99.9, 20, "2025-12-04", 16, ["Sombrio", "Difícil", "Roguelike", "Fantasia"], PC, "Uma cidade queimada, uma chama que não se apaga e um grupo de exilados dispostos a pagar qualquer preço."],
  ["Lorde dos Mil Sinos", "rpg", "Sino de Bronze", "Brisa Interativa", 89.9, 0, "2026-07-11", 12, ["Fantasia", "Gestão", "Combate por turnos", "Humor"], P, "Governe um vilarejo de monges guerreiros e chame os mil sinos antes que a névoa chegue às muralhas."],
  ["Pacto de Cinzas e Ouro", "rpg", "Estandarte Negro", "Ferro & Fogo Entretenimento", 159.9, 45, "2025-06-30", 18, ["Mundo aberto", "Sombrio", "Escolhas importam", "Mercenários"], PC, "Mercenários, nobres falidos e um tesouro amaldiçoado. Em Pacto, ouro compra lealdade, mas nunca a paz."],
  // Corrida
  ["Asfalto Solar", "corrida", "Velocímetro Studio", "Pulsar Publishing", 119.9, 20, "2026-01-30", 0, ["Corrida arcade", "Multijogador local", "Colorido", "Carros"], P, "Corridas movidas a energia solar em pistas que mudam conforme o sol se move no céu."],
  ["Gravitron GP", "corrida", "Antigravidade Lab", "Nova Aurora Games", 129.9, 0, "2026-09-19", 0, ["Futurista", "Corrida arcade", "Online", "Rápido"], P, "Naves de corrida deslizam por pistas que desafiam a gravidade. Velocidade pura, sem freio."],
  ["Rali das Dunas Vermelhas", "corrida", "Poeira & Cia", "Ferro & Fogo Entretenimento", 99.9, 30, "2025-07-25", 0, ["Simulação", "Rali", "Mundo aberto", "Carros"], PC, "Atravesse desertos, canyons e salinas em um rali brutal onde o navegador é seu melhor amigo."],
  ["Turbo Quartzo", "corrida", "Faísca Digital", "Brisa Interativa", 49.9, 0, "2026-03-03", 0, ["Corrida arcade", "Pixel art", "Multijogador local", "Retrô"], PA, "Um tributo às corridas de fliperama com visual pixelado e pistas curtas e viciantes."],
  // Esportes
  ["Futsal Arena Pro", "esportes", "Quadra Viva", "Liga Aberta Games", 109.9, 20, "2026-02-10", 0, ["Futebol", "Online", "Multijogador local", "Competitivo"], P, "O futsal rápido e técnico das quadras, com jogadas de rua e campeonatos por temporada."],
  ["Cesta Máxima Street", "esportes", "Aro Dourado", "Liga Aberta Games", 89.9, 0, "2025-11-08", 0, ["Basquete", "Street", "Multijogador local", "Competitivo"], P, "Basquete de rua 3x3 com enterradas ousadas, torneios de bairro e muito estilo."],
  ["Vôlei de Praia Maré Alta", "esportes", "Areia Fina", "Brisa Interativa", 59.9, 25, "2026-01-12", 0, ["Vôlei", "Multijogador local", "Relaxante", "Colorido"], PA, "Duplas, sol e saque viagem. Monte seu time e conquiste o circuito de praias do litoral."],
  ["Ace Point Tênis", "esportes", "Rede Cheia", "Liga Aberta Games", 79.9, 0, "2026-05-28", 0, ["Tênis", "Online", "Competitivo", "Simulação"], PC, "Simulação de tênis com física realista e rivalidades que se constroem ponto a ponto."],
  // Estratégia
  ["Império de Cobre", "estrategia", "Engrenagem Real", "Grimório Publishing", 119.9, 30, "2025-10-17", 12, ["Estratégia em tempo real", "Steampunk", "Construção de base", "Campanha"], PC, "Erga cidades a vapor, negocie tratados e domine um continente movido a cobre e carvão."],
  ["Sentinelas do Vale", "estrategia", "Torre de Vigia", "Nova Aurora Games", 69.9, 0, "2026-04-04", 10, ["Tower defense", "Fantasia", "Táticas", "Single player"], P, "Posicione sentinelas, ative runas e proteja o vale de ondas de criaturas que aprendem com você."],
  ["Marés de Guerra", "estrategia", "Almirantado Digital", "Ferro & Fogo Entretenimento", 129.9, 20, "2025-12-12", 12, ["Naval", "Táticas por turno", "Campanha", "História alternativa"], PC, "Comande frotas em um conflito naval entre arquipélagos e use a maré a seu favor."],
  ["Colônia Kepler", "estrategia", "Órbita Sul", "Pulsar Publishing", 94.9, 0, "2026-08-21", 10, ["Ficção científica", "Gestão", "Construção de base", "Sobrevivência"], PC, "Colonize um planeta hostil: gerencie recursos, pesquise tecnologias e mantenha a tripulação viva."],
  // Terror
  ["O Porão de Marrowgate", "terror", "Lume Fraco", "Noite Funda Publishing", 59.9, 0, "2025-10-30", 16, ["Terror psicológico", "Furtivo", "Atmosférico", "Single player"], PC, "Uma mansão, um porão e algo que sussurra seu nome entre os canos. A luz é sua única defesa."],
  ["Sussurros na Estação 9", "terror", "Silêncio Absoluto", "Noite Funda Publishing", 74.9, 35, "2026-10-09", 18, ["Terror psicológico", "Ficção científica", "Atmosférico", "Sobrevivência"], PC, "Uma estação espacial abandonada e uma tripulação que parou de responder. Não ouça as paredes."],
  ["Casa dos Espelhos Cegos", "terror", "Reflexo Sombrio", "Noite Funda Publishing", 49.9, 0, "2026-06-06", 14, ["Puzzle", "Terror psicológico", "Mistério", "Atmosférico"], P, "Resolva enigmas em um labirinto de espelhos onde o reflexo nem sempre acompanha seus movimentos."],
  ["Vigília Escarlate", "terror", "Corvo Sem Asa", "Grimório Publishing", 84.9, 25, "2025-09-26", 18, ["Sobrevivência", "Gótico", "Furtivo", "Sombrio"], PC, "Passe a noite em um convento isolado e sobreviva até o amanhecer vermelho."],
  // Indie
  ["Pixel Pomar", "indie", "Maçã Verde Games", "Brisa Interativa", 0, 0, "2026-04-15", 0, ["Pixel art", "Relaxante", "Gratuito para jogar", "Gestão"], PA, "Cultive um pomar pixelado, troque frutas com vizinhos e descubra por que as macieiras cantam à noite."],
  ["Lanterna Mínima", "indie", "Feijão Mágico", "Nova Aurora Games", 29.9, 0, "2026-02-01", 0, ["Puzzle", "Minimalista", "Atmosférico", "Plataforma"], PA, "Um quebra-cabeça de luz e sombra com uma única lanterna e muitas ideias."],
  ["Sopa de Estrelas", "indie", "Panela Cósmica", "Brisa Interativa", 39.9, 20, "2025-12-22", 0, ["Culinária", "Família", "Colorido", "Cooperativo"], PA, "Cozinhe receitas intergalácticas com amigos em cozinhas que giram, voam e explodem."],
  ["Coruja & Engrenagem", "indie", "Relojoaria Indie", "Brisa Interativa", 44.9, 0, "2026-07-30", 0, ["Steampunk", "Plataforma", "Narrativa", "Pixel art"], PA, "Uma coruja mecânica conserta o relógio de uma cidade que perdeu o amanhã."],
  // Simulação
  ["Fazenda Lua Nova", "simulacao", "Terra Boa Studio", "Brisa Interativa", 69.9, 25, "2025-09-05", 0, ["Fazenda", "Relaxante", "Gestão", "Família"], PA, "Planeje plantações pela fase da lua, crie bichos curiosos e transforme um terreno em um lar."],
  ["Torre de Controle 360", "simulacao", "Pista Livre", "Ferro & Fogo Entretenimento", 99.9, 0, "2026-03-27", 0, ["Simulador", "Gestão", "Realista", "Single player"], PC, "Coordene pousos e decolagens em um aeroporto internacional e mantenha tudo no horário."],
  ["Cafeteria Quântica", "simulacao", "Grão Estelar", "Pulsar Publishing", 59.9, 0, "2026-09-12", 0, ["Gestão", "Cozinha", "Humor", "Ficção científica"], P, "Abra uma cafeteria onde o café chega de todas as dimensões e os clientes também."],
  // Multiplayer
  ["Arena Quórum", "multiplayer", "Quorum Labs", "Pulsar Publishing", 0, 0, "2026-01-20", 12, ["Gratuito para jogar", "Competitivo", "Online", "Heróis"], P, "Arena 5x5 com heróis de habilidades únicas e partidas de 15 minutos. Fácil de aprender, difícil de dominar."],
  ["Esquadrão Vórtice", "multiplayer", "Cabo Largo", "Ferro & Fogo Entretenimento", 79.9, 30, "2025-08-29", 16, ["Tiro tático", "Cooperativo", "Online", "Competitivo"], PC, "Esquadrões de quatro pessoas disputam o controle de portais que alteram as regras da partida."],
  ["Festa Caótica Online", "multiplayer", "Confete Digital", "Brisa Interativa", 0, 0, "2026-05-16", 0, ["Gratuito para jogar", "Família", "Multijogador local", "Party game"], PA, "Minijogos rápidos e absurdos para até 8 jogadores. Perfeito para sofá, TV e risada alta."],
  ["Guerra de Clãs: Muralhas", "multiplayer", "Cavalaria Móvel", "Grimório Publishing", 0, 0, "2026-06-25", 10, ["Gratuito para jogar", "Estratégia em tempo real", "Online", "Competitivo"], PA, "Construa muralhas, forme um clã e dispute territórios em guerras que duram dias."],
];

export const REVIEWERS = [
  "Marcos Tavares", "Júlia Ferraz", "Pedro Albuquerque", "Larissa Mota", "Rafael Brandão",
  "Camila Duarte", "Thiago Nogueira", "Beatriz Lima", "Gustavo Reis", "Fernanda Pires",
];

export const REVIEW_TEXTS = {
  5: [
    "Joguei por horas sem ver o tempo passar. {t} é daqueles jogos que a gente recomenda para todo mundo.",
    "Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.",
    "Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.",
  ],
  4: [
    "Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.",
    "Divertido e bem polido. Com mais conteúdo no fim seria perfeito.",
    "Gostei bastante da proposta e do visual. Roda liso no meu equipamento.",
  ],
  3: [
    "Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.",
    "Tem ideias legais e execução irregular. Dá para se divertir um bocado.",
  ],
  2: ["Esperava mais. A parte técnica precisa de ajustes e a história é fraca."],
};

// Personagem/objeto ilustrado de cada capa (ver scripts/art.mjs)
export const GAME_ICONS = {
  "Lâmina do Eclipse": "sword", "Fúria de Neon": "bolt", "Operação Cinzas": "bomb", "Ronin Cibernético": "cat", "Brigada Vértice": "robot",
  "Ilhas de Aurora": "sun", "A Trilha dos Vagalumes": "moon", "Relicário de Areia": "pyramid", "Cartógrafo das Nuvens": "cloud",
  "Crônicas de Valdoran": "book", "Herdeiros da Runa Partida": "rune", "Sombras de Ember": "flame", "Lorde dos Mil Sinos": "bell", "Pacto de Cinzas e Ouro": "coin",
  "Asfalto Solar": "car", "Gravitron GP": "ufo", "Rali das Dunas Vermelhas": "car", "Turbo Quartzo": "gem",
  "Futsal Arena Pro": "soccer", "Cesta Máxima Street": "basketball", "Vôlei de Praia Maré Alta": "volley", "Ace Point Tênis": "racket",
  "Império de Cobre": "gear", "Sentinelas do Vale": "tower", "Marés de Guerra": "ship", "Colônia Kepler": "planet",
  "O Porão de Marrowgate": "key", "Sussurros na Estação 9": "helmet", "Casa dos Espelhos Cegos": "mirror", "Vigília Escarlate": "candle",
  "Pixel Pomar": "apple", "Lanterna Mínima": "lantern", "Sopa de Estrelas": "pot", "Coruja & Engrenagem": "owl",
  "Fazenda Lua Nova": "barn", "Torre de Controle 360": "plane", "Cafeteria Quântica": "coffee",
  "Arena Quórum": "crown", "Esquadrão Vórtice": "target", "Festa Caótica Online": "dice", "Guerra de Clãs: Muralhas": "castle",
};
