-- GERADO por scripts/generate-seed.mjs. Nao edite manualmente.
-- Usuarios de teste: ver README.
--
-- Este seed pode ser executado novamente (SQL Editor, psql ou supabase db reset): ele primeiro APAGA o
-- catalogo (jogos, categorias, tags, plataformas e tudo que depende deles) e os usuarios @pixelporto.test.
delete from public.library_items where user_id in (select id from auth.users where email like '%@pixelporto.test');
delete from public.orders where user_id in (select id from auth.users where email like '%@pixelporto.test');
delete from auth.users where email like '%@pixelporto.test';
truncate table public.games, public.categories, public.tags, public.platforms cascade;

insert into public.categories (slug, name) values
  ('acao', 'Ação'),
  ('aventura', 'Aventura'),
  ('rpg', 'RPG'),
  ('corrida', 'Corrida'),
  ('esportes', 'Esportes'),
  ('estrategia', 'Estratégia'),
  ('terror', 'Terror'),
  ('indie', 'Indie'),
  ('simulacao', 'Simulação'),
  ('multiplayer', 'Multiplayer');

insert into public.platforms (slug, name) values
  ('pc', 'PC Windows'),
  ('game-stick', 'Game Stick TV'),
  ('android', 'Android'),
  ('pen-drive', 'Pen Drive Plug & Play');

insert into public.tags (slug, name) values
  ('single-player', 'Single player'),
  ('dificil', 'Difícil'),
  ('fantasia', 'Fantasia'),
  ('combate-corpo-a-corpo', 'Combate corpo a corpo'),
  ('cyberpunk', 'Cyberpunk'),
  ('frenetico', 'Frenético'),
  ('hack-and-slash', 'Hack and slash'),
  ('tiro-tatico', 'Tiro tático'),
  ('cooperativo', 'Cooperativo'),
  ('pos-apocaliptico', 'Pós-apocalíptico'),
  ('campanha', 'Campanha'),
  ('plataforma', 'Plataforma'),
  ('pixel-art', 'Pixel art'),
  ('mechas', 'Mechas'),
  ('ficcao-cientifica', 'Ficção científica'),
  ('mundo-aberto', 'Mundo aberto'),
  ('relaxante', 'Relaxante'),
  ('exploracao', 'Exploração'),
  ('narrativa', 'Narrativa'),
  ('familia', 'Família'),
  ('puzzle', 'Puzzle'),
  ('misterio', 'Mistério'),
  ('acao-aventura', 'Ação-aventura'),
  ('escolhas-importam', 'Escolhas importam'),
  ('combate-por-turnos', 'Combate por turnos'),
  ('sombrio', 'Sombrio'),
  ('roguelike', 'Roguelike'),
  ('gestao', 'Gestão'),
  ('humor', 'Humor'),
  ('mercenarios', 'Mercenários'),
  ('corrida-arcade', 'Corrida arcade'),
  ('multijogador-local', 'Multijogador local'),
  ('colorido', 'Colorido'),
  ('carros', 'Carros'),
  ('futurista', 'Futurista'),
  ('online', 'Online'),
  ('rapido', 'Rápido'),
  ('simulacao', 'Simulação'),
  ('rali', 'Rali'),
  ('retro', 'Retrô'),
  ('futebol', 'Futebol'),
  ('competitivo', 'Competitivo'),
  ('basquete', 'Basquete'),
  ('street', 'Street'),
  ('volei', 'Vôlei'),
  ('tenis', 'Tênis'),
  ('estrategia-em-tempo-real', 'Estratégia em tempo real'),
  ('steampunk', 'Steampunk'),
  ('construcao-de-base', 'Construção de base'),
  ('tower-defense', 'Tower defense'),
  ('taticas', 'Táticas'),
  ('naval', 'Naval'),
  ('taticas-por-turno', 'Táticas por turno'),
  ('historia-alternativa', 'História alternativa'),
  ('sobrevivencia', 'Sobrevivência'),
  ('terror-psicologico', 'Terror psicológico'),
  ('furtivo', 'Furtivo'),
  ('atmosferico', 'Atmosférico'),
  ('gotico', 'Gótico'),
  ('gratuito-para-jogar', 'Gratuito para jogar'),
  ('minimalista', 'Minimalista'),
  ('culinaria', 'Culinária'),
  ('fazenda', 'Fazenda'),
  ('simulador', 'Simulador'),
  ('realista', 'Realista'),
  ('cozinha', 'Cozinha'),
  ('herois', 'Heróis'),
  ('party-game', 'Party game');

insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'lamina-do-eclipse', 'Lâmina do Eclipse', 'Um samurai sem sombra caminha entre dois mundos durante um eclipse eterno. Cada duelo é uma dança letal de reflexos e ritmo.', 'Um samurai sem sombra caminha entre dois mundos durante um eclipse eterno. Cada duelo é uma dança letal de reflexos e ritmo.

Combate fluido, chefes memoráveis e um sistema de evolução que premia a precisão. Inclui modo desafio e suporte a controle.

Desenvolvido por Estúdio Corvo Branco e publicado por Nova Aurora Games. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Estúdio Corvo Branco', 'Nova Aurora Games', 11990, '2026-03-14', 16, 'covers/lamina-do-eclipse-cover.svg', 'banners/lamina-do-eclipse-banner.svg', ARRAY['shots/lamina-do-eclipse-shot-1.svg', 'shots/lamina-do-eclipse-shot-2.svg', 'shots/lamina-do-eclipse-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i5-8400 / Ryzen 5 2600","ram":"12 GB","gpu":"GTX 1060 6GB / RX 580","storage":"60 GB SSD"},"recommended":{"os":"Windows 11 64 bits","cpu":"Core i7-10700 / Ryzen 7 3700X","ram":"16 GB","gpu":"RTX 3060 / RX 6600 XT","storage":"60 GB SSD"}}'::jsonb, 0, 0, 666, true
from public.categories c where c.slug = 'acao';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'furia-de-neon', 'Fúria de Neon', 'Corra por arranha-céus iluminados, corte drones e hackeie a cidade inteira em combates que não deixam você respirar.', 'Corra por arranha-céus iluminados, corte drones e hackeie a cidade inteira em combates que não deixam você respirar.

Combate fluido, chefes memoráveis e um sistema de evolução que premia a precisão. Inclui modo desafio e suporte a controle.

Desenvolvido por Quasar Forge e publicado por Pulsar Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Quasar Forge', 'Pulsar Publishing', 8990, '2026-08-02', 14, 'covers/furia-de-neon-cover.svg', 'banners/furia-de-neon-banner.svg', ARRAY['shots/furia-de-neon-shot-1.svg', 'shots/furia-de-neon-shot-2.svg', 'shots/furia-de-neon-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 211, true
from public.categories c where c.slug = 'acao';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'operacao-cinzas', 'Operação Cinzas', 'Um esquadrão de elite atravessa uma metrópole devastada para resgatar a última central de energia da região.', 'Um esquadrão de elite atravessa uma metrópole devastada para resgatar a última central de energia da região.

Combate fluido, chefes memoráveis e um sistema de evolução que premia a precisão. Inclui modo desafio e suporte a controle.

Desenvolvido por Batalhão Digital e publicado por Ferro & Fogo Entretenimento. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Batalhão Digital', 'Ferro & Fogo Entretenimento', 14990, '2025-11-20', 18, 'covers/operacao-cinzas-cover.svg', 'banners/operacao-cinzas-banner.svg', ARRAY['shots/operacao-cinzas-shot-1.svg', 'shots/operacao-cinzas-shot-2.svg', 'shots/operacao-cinzas-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i5-8400 / Ryzen 5 2600","ram":"12 GB","gpu":"GTX 1060 6GB / RX 580","storage":"60 GB SSD"},"recommended":{"os":"Windows 11 64 bits","cpu":"Core i7-10700 / Ryzen 7 3700X","ram":"16 GB","gpu":"RTX 3060 / RX 6600 XT","storage":"60 GB SSD"}}'::jsonb, 0, 0, 1346, true
from public.categories c where c.slug = 'acao';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'ronin-cibernetico', 'Ronin Cibernético', 'Plataforma 2D de alta velocidade em que cada salto corta o ar com uma lâmina de plasma.', 'Plataforma 2D de alta velocidade em que cada salto corta o ar com uma lâmina de plasma.

Combate fluido, chefes memoráveis e um sistema de evolução que premia a precisão. Inclui modo desafio e suporte a controle.

Desenvolvido por Hanabi Lab e publicado por Nova Aurora Games. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Hanabi Lab', 'Nova Aurora Games', 6990, '2026-05-09', 14, 'covers/ronin-cibernetico-cover.svg', 'banners/ronin-cibernetico-banner.svg', ARRAY['shots/ronin-cibernetico-shot-1.svg', 'shots/ronin-cibernetico-shot-2.svg', 'shots/ronin-cibernetico-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 427, false
from public.categories c where c.slug = 'acao';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'brigada-vertice', 'Brigada Vértice', 'Pilote um mecha pesado e defenda colônias orbitais contra uma frota que ninguém sabe de onde veio.', 'Pilote um mecha pesado e defenda colônias orbitais contra uma frota que ninguém sabe de onde veio.

Combate fluido, chefes memoráveis e um sistema de evolução que premia a precisão. Inclui modo desafio e suporte a controle.

Desenvolvido por Titânio Studio e publicado por Pulsar Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Titânio Studio', 'Pulsar Publishing', 9990, '2025-09-12', 12, 'covers/brigada-vertice-cover.svg', 'banners/brigada-vertice-banner.svg', ARRAY['shots/brigada-vertice-shot-1.svg', 'shots/brigada-vertice-shot-2.svg', 'shots/brigada-vertice-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 1336, false
from public.categories c where c.slug = 'acao';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'ilhas-de-aurora', 'Ilhas de Aurora', 'Navegue por um arquipélago flutuante, descubra segredos antigos e acorde as luzes que mantêm as ilhas no céu.', 'Navegue por um arquipélago flutuante, descubra segredos antigos e acorde as luzes que mantêm as ilhas no céu.

Mundo para explorar no seu ritmo, personagens carismáticos e quebra-cabeças que pedem curiosidade, não pressa.

Desenvolvido por Maré Alta Studio e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Maré Alta Studio', 'Brisa Interativa', 7990, '2026-02-27', 0, 'covers/ilhas-de-aurora-cover.svg', 'banners/ilhas-de-aurora-banner.svg', ARRAY['shots/ilhas-de-aurora-shot-1.svg', 'shots/ilhas-de-aurora-shot-2.svg', 'shots/ilhas-de-aurora-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 1068, true
from public.categories c where c.slug = 'aventura';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'a-trilha-dos-vagalumes', 'A Trilha dos Vagalumes', 'Uma criança e uma lanterna viva atravessam uma floresta que muda de forma a cada noite.', 'Uma criança e uma lanterna viva atravessam uma floresta que muda de forma a cada noite.

Mundo para explorar no seu ritmo, personagens carismáticos e quebra-cabeças que pedem curiosidade, não pressa.

Desenvolvido por Pirilampo Games e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Pirilampo Games', 'Brisa Interativa', 5490, '2025-10-03', 0, 'covers/a-trilha-dos-vagalumes-cover.svg', 'banners/a-trilha-dos-vagalumes-banner.svg', ARRAY['shots/a-trilha-dos-vagalumes-shot-1.svg', 'shots/a-trilha-dos-vagalumes-shot-2.svg', 'shots/a-trilha-dos-vagalumes-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 2372, false
from public.categories c where c.slug = 'aventura';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'relicario-de-areia', 'Relicário de Areia', 'Arqueólogos de um deserto sem fim reabrem tumbas que deveriam permanecer seladas.', 'Arqueólogos de um deserto sem fim reabrem tumbas que deveriam permanecer seladas.

Mundo para explorar no seu ritmo, personagens carismáticos e quebra-cabeças que pedem curiosidade, não pressa.

Desenvolvido por Duna Vermelha Studio e publicado por Ferro & Fogo Entretenimento. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Duna Vermelha Studio', 'Ferro & Fogo Entretenimento', 10990, '2026-06-18', 12, 'covers/relicario-de-areia-cover.svg', 'banners/relicario-de-areia-banner.svg', ARRAY['shots/relicario-de-areia-shot-1.svg', 'shots/relicario-de-areia-shot-2.svg', 'shots/relicario-de-areia-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 347, false
from public.categories c where c.slug = 'aventura';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'cartografo-das-nuvens', 'Cartógrafo das Nuvens', 'Desenhe o mapa de um céu em constante mudança e conecte cidades que nunca se encontraram.', 'Desenhe o mapa de um céu em constante mudança e conecte cidades que nunca se encontraram.

Mundo para explorar no seu ritmo, personagens carismáticos e quebra-cabeças que pedem curiosidade, não pressa.

Desenvolvido por Papel e Vento e publicado por Nova Aurora Games. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Papel e Vento', 'Nova Aurora Games', 6490, '2026-09-05', 0, 'covers/cartografo-das-nuvens-cover.svg', 'banners/cartografo-das-nuvens-banner.svg', ARRAY['shots/cartografo-das-nuvens-shot-1.svg', 'shots/cartografo-das-nuvens-shot-2.svg', 'shots/cartografo-das-nuvens-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 1803, false
from public.categories c where c.slug = 'aventura';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'cronicas-de-valdoran', 'Crônicas de Valdoran', 'Um reino em guerra, cinco facções e uma profecia que só você pode reescrever. Cada escolha muda quem sobrevive.', 'Um reino em guerra, cinco facções e uma profecia que só você pode reescrever. Cada escolha muda quem sobrevive.

Dezenas de horas de campanha, árvore de habilidades profunda, companheiros com histórias próprias e finais múltiplos.

Desenvolvido por Torre Alta Studio e publicado por Grimório Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Torre Alta Studio', 'Grimório Publishing', 16990, '2025-08-15', 14, 'covers/cronicas-de-valdoran-cover.svg', 'banners/cronicas-de-valdoran-banner.svg', ARRAY['shots/cronicas-de-valdoran-shot-1.svg', 'shots/cronicas-de-valdoran-shot-2.svg', 'shots/cronicas-de-valdoran-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i5-8400 / Ryzen 5 2600","ram":"12 GB","gpu":"GTX 1060 6GB / RX 580","storage":"60 GB SSD"},"recommended":{"os":"Windows 11 64 bits","cpu":"Core i7-10700 / Ryzen 7 3700X","ram":"16 GB","gpu":"RTX 3060 / RX 6600 XT","storage":"60 GB SSD"}}'::jsonb, 0, 0, 881, true
from public.categories c where c.slug = 'rpg';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'herdeiros-da-runa-partida', 'Herdeiros da Runa Partida', 'Reúna os herdeiros de uma runa quebrada e reconstrua a magia que sustentava o mundo.', 'Reúna os herdeiros de uma runa quebrada e reconstrua a magia que sustentava o mundo.

Dezenas de horas de campanha, árvore de habilidades profunda, companheiros com histórias próprias e finais múltiplos.

Desenvolvido por Brasa Antiga e publicado por Grimório Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Brasa Antiga', 'Grimório Publishing', 13990, '2026-04-22', 16, 'covers/herdeiros-da-runa-partida-cover.svg', 'banners/herdeiros-da-runa-partida-banner.svg', ARRAY['shots/herdeiros-da-runa-partida-shot-1.svg', 'shots/herdeiros-da-runa-partida-shot-2.svg', 'shots/herdeiros-da-runa-partida-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i5-8400 / Ryzen 5 2600","ram":"12 GB","gpu":"GTX 1060 6GB / RX 580","storage":"60 GB SSD"},"recommended":{"os":"Windows 11 64 bits","cpu":"Core i7-10700 / Ryzen 7 3700X","ram":"16 GB","gpu":"RTX 3060 / RX 6600 XT","storage":"60 GB SSD"}}'::jsonb, 0, 0, 948, false
from public.categories c where c.slug = 'rpg';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'sombras-de-ember', 'Sombras de Ember', 'Uma cidade queimada, uma chama que não se apaga e um grupo de exilados dispostos a pagar qualquer preço.', 'Uma cidade queimada, uma chama que não se apaga e um grupo de exilados dispostos a pagar qualquer preço.

Dezenas de horas de campanha, árvore de habilidades profunda, companheiros com histórias próprias e finais múltiplos.

Desenvolvido por Cinzeiro Games e publicado por Pulsar Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Cinzeiro Games', 'Pulsar Publishing', 9990, '2025-12-04', 16, 'covers/sombras-de-ember-cover.svg', 'banners/sombras-de-ember-banner.svg', ARRAY['shots/sombras-de-ember-shot-1.svg', 'shots/sombras-de-ember-shot-2.svg', 'shots/sombras-de-ember-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 2250, false
from public.categories c where c.slug = 'rpg';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'lorde-dos-mil-sinos', 'Lorde dos Mil Sinos', 'Governe um vilarejo de monges guerreiros e chame os mil sinos antes que a névoa chegue às muralhas.', 'Governe um vilarejo de monges guerreiros e chame os mil sinos antes que a névoa chegue às muralhas.

Dezenas de horas de campanha, árvore de habilidades profunda, companheiros com histórias próprias e finais múltiplos.

Desenvolvido por Sino de Bronze e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Sino de Bronze', 'Brisa Interativa', 8990, '2026-07-11', 12, 'covers/lorde-dos-mil-sinos-cover.svg', 'banners/lorde-dos-mil-sinos-banner.svg', ARRAY['shots/lorde-dos-mil-sinos-shot-1.svg', 'shots/lorde-dos-mil-sinos-shot-2.svg', 'shots/lorde-dos-mil-sinos-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 378, false
from public.categories c where c.slug = 'rpg';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'pacto-de-cinzas-e-ouro', 'Pacto de Cinzas e Ouro', 'Mercenários, nobres falidos e um tesouro amaldiçoado. Em Pacto, ouro compra lealdade, mas nunca a paz.', 'Mercenários, nobres falidos e um tesouro amaldiçoado. Em Pacto, ouro compra lealdade, mas nunca a paz.

Dezenas de horas de campanha, árvore de habilidades profunda, companheiros com histórias próprias e finais múltiplos.

Desenvolvido por Estandarte Negro e publicado por Ferro & Fogo Entretenimento. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Estandarte Negro', 'Ferro & Fogo Entretenimento', 15990, '2025-06-30', 18, 'covers/pacto-de-cinzas-e-ouro-cover.svg', 'banners/pacto-de-cinzas-e-ouro-banner.svg', ARRAY['shots/pacto-de-cinzas-e-ouro-shot-1.svg', 'shots/pacto-de-cinzas-e-ouro-shot-2.svg', 'shots/pacto-de-cinzas-e-ouro-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i5-8400 / Ryzen 5 2600","ram":"12 GB","gpu":"GTX 1060 6GB / RX 580","storage":"60 GB SSD"},"recommended":{"os":"Windows 11 64 bits","cpu":"Core i7-10700 / Ryzen 7 3700X","ram":"16 GB","gpu":"RTX 3060 / RX 6600 XT","storage":"60 GB SSD"}}'::jsonb, 0, 0, 1086, false
from public.categories c where c.slug = 'rpg';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'asfalto-solar', 'Asfalto Solar', 'Corridas movidas a energia solar em pistas que mudam conforme o sol se move no céu.', 'Corridas movidas a energia solar em pistas que mudam conforme o sol se move no céu.

Dezenas de carros e pistas, física afinada, modo carreira, corridas rápidas e ranking semanal.

Desenvolvido por Velocímetro Studio e publicado por Pulsar Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Velocímetro Studio', 'Pulsar Publishing', 11990, '2026-01-30', 0, 'covers/asfalto-solar-cover.svg', 'banners/asfalto-solar-banner.svg', ARRAY['shots/asfalto-solar-shot-1.svg', 'shots/asfalto-solar-shot-2.svg', 'shots/asfalto-solar-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i5-8400 / Ryzen 5 2600","ram":"12 GB","gpu":"GTX 1060 6GB / RX 580","storage":"60 GB SSD"},"recommended":{"os":"Windows 11 64 bits","cpu":"Core i7-10700 / Ryzen 7 3700X","ram":"16 GB","gpu":"RTX 3060 / RX 6600 XT","storage":"60 GB SSD"}}'::jsonb, 0, 0, 1826, false
from public.categories c where c.slug = 'corrida';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'gravitron-gp', 'Gravitron GP', 'Naves de corrida deslizam por pistas que desafiam a gravidade. Velocidade pura, sem freio.', 'Naves de corrida deslizam por pistas que desafiam a gravidade. Velocidade pura, sem freio.

Dezenas de carros e pistas, física afinada, modo carreira, corridas rápidas e ranking semanal.

Desenvolvido por Antigravidade Lab e publicado por Nova Aurora Games. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Antigravidade Lab', 'Nova Aurora Games', 12990, '2026-09-19', 0, 'covers/gravitron-gp-cover.svg', 'banners/gravitron-gp-banner.svg', ARRAY['shots/gravitron-gp-shot-1.svg', 'shots/gravitron-gp-shot-2.svg', 'shots/gravitron-gp-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i5-8400 / Ryzen 5 2600","ram":"12 GB","gpu":"GTX 1060 6GB / RX 580","storage":"60 GB SSD"},"recommended":{"os":"Windows 11 64 bits","cpu":"Core i7-10700 / Ryzen 7 3700X","ram":"16 GB","gpu":"RTX 3060 / RX 6600 XT","storage":"60 GB SSD"}}'::jsonb, 0, 0, 935, true
from public.categories c where c.slug = 'corrida';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'rali-das-dunas-vermelhas', 'Rali das Dunas Vermelhas', 'Atravesse desertos, canyons e salinas em um rali brutal onde o navegador é seu melhor amigo.', 'Atravesse desertos, canyons e salinas em um rali brutal onde o navegador é seu melhor amigo.

Dezenas de carros e pistas, física afinada, modo carreira, corridas rápidas e ranking semanal.

Desenvolvido por Poeira & Cia e publicado por Ferro & Fogo Entretenimento. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Poeira & Cia', 'Ferro & Fogo Entretenimento', 9990, '2025-07-25', 0, 'covers/rali-das-dunas-vermelhas-cover.svg', 'banners/rali-das-dunas-vermelhas-banner.svg', ARRAY['shots/rali-das-dunas-vermelhas-shot-1.svg', 'shots/rali-das-dunas-vermelhas-shot-2.svg', 'shots/rali-das-dunas-vermelhas-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10","cpu":"Dual core 2.4 GHz","ram":"4 GB","gpu":"Integrada com DirectX 11","storage":"2 GB"},"recommended":{"os":"Windows 10/11","cpu":"Quad core 3.0 GHz","ram":"8 GB","gpu":"GTX 750 / RX 560","storage":"2 GB"}}'::jsonb, 0, 0, 2350, false
from public.categories c where c.slug = 'corrida';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'turbo-quartzo', 'Turbo Quartzo', 'Um tributo às corridas de fliperama com visual pixelado e pistas curtas e viciantes.', 'Um tributo às corridas de fliperama com visual pixelado e pistas curtas e viciantes.

Dezenas de carros e pistas, física afinada, modo carreira, corridas rápidas e ranking semanal.

Desenvolvido por Faísca Digital e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Faísca Digital', 'Brisa Interativa', 4990, '2026-03-03', 0, 'covers/turbo-quartzo-cover.svg', 'banners/turbo-quartzo-banner.svg', ARRAY['shots/turbo-quartzo-shot-1.svg', 'shots/turbo-quartzo-shot-2.svg', 'shots/turbo-quartzo-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10","cpu":"Dual core 2.4 GHz","ram":"4 GB","gpu":"Integrada com DirectX 11","storage":"2 GB"},"recommended":{"os":"Windows 10/11","cpu":"Quad core 3.0 GHz","ram":"8 GB","gpu":"GTX 750 / RX 560","storage":"2 GB"}}'::jsonb, 0, 0, 1038, false
from public.categories c where c.slug = 'corrida';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'futsal-arena-pro', 'Futsal Arena Pro', 'O futsal rápido e técnico das quadras, com jogadas de rua e campeonatos por temporada.', 'O futsal rápido e técnico das quadras, com jogadas de rua e campeonatos por temporada.

Campeonatos por temporada, modo treino, partidas locais para amigos e uma presença forte de jogadas espetaculares.

Desenvolvido por Quadra Viva e publicado por Liga Aberta Games. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Quadra Viva', 'Liga Aberta Games', 10990, '2026-02-10', 0, 'covers/futsal-arena-pro-cover.svg', 'banners/futsal-arena-pro-banner.svg', ARRAY['shots/futsal-arena-pro-shot-1.svg', 'shots/futsal-arena-pro-shot-2.svg', 'shots/futsal-arena-pro-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 802, false
from public.categories c where c.slug = 'esportes';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'cesta-maxima-street', 'Cesta Máxima Street', 'Basquete de rua 3x3 com enterradas ousadas, torneios de bairro e muito estilo.', 'Basquete de rua 3x3 com enterradas ousadas, torneios de bairro e muito estilo.

Campeonatos por temporada, modo treino, partidas locais para amigos e uma presença forte de jogadas espetaculares.

Desenvolvido por Aro Dourado e publicado por Liga Aberta Games. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Aro Dourado', 'Liga Aberta Games', 8990, '2025-11-08', 0, 'covers/cesta-maxima-street-cover.svg', 'banners/cesta-maxima-street-banner.svg', ARRAY['shots/cesta-maxima-street-shot-1.svg', 'shots/cesta-maxima-street-shot-2.svg', 'shots/cesta-maxima-street-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10","cpu":"Dual core 2.4 GHz","ram":"4 GB","gpu":"Integrada com DirectX 11","storage":"2 GB"},"recommended":{"os":"Windows 10/11","cpu":"Quad core 3.0 GHz","ram":"8 GB","gpu":"GTX 750 / RX 560","storage":"2 GB"}}'::jsonb, 0, 0, 384, false
from public.categories c where c.slug = 'esportes';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'volei-de-praia-mare-alta', 'Vôlei de Praia Maré Alta', 'Duplas, sol e saque viagem. Monte seu time e conquiste o circuito de praias do litoral.', 'Duplas, sol e saque viagem. Monte seu time e conquiste o circuito de praias do litoral.

Campeonatos por temporada, modo treino, partidas locais para amigos e uma presença forte de jogadas espetaculares.

Desenvolvido por Areia Fina e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Areia Fina', 'Brisa Interativa', 5990, '2026-01-12', 0, 'covers/volei-de-praia-mare-alta-cover.svg', 'banners/volei-de-praia-mare-alta-banner.svg', ARRAY['shots/volei-de-praia-mare-alta-shot-1.svg', 'shots/volei-de-praia-mare-alta-shot-2.svg', 'shots/volei-de-praia-mare-alta-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10","cpu":"Dual core 2.4 GHz","ram":"4 GB","gpu":"Integrada com DirectX 11","storage":"2 GB"},"recommended":{"os":"Windows 10/11","cpu":"Quad core 3.0 GHz","ram":"8 GB","gpu":"GTX 750 / RX 560","storage":"2 GB"}}'::jsonb, 0, 0, 1049, false
from public.categories c where c.slug = 'esportes';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'ace-point-tenis', 'Ace Point Tênis', 'Simulação de tênis com física realista e rivalidades que se constroem ponto a ponto.', 'Simulação de tênis com física realista e rivalidades que se constroem ponto a ponto.

Campeonatos por temporada, modo treino, partidas locais para amigos e uma presença forte de jogadas espetaculares.

Desenvolvido por Rede Cheia e publicado por Liga Aberta Games. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Rede Cheia', 'Liga Aberta Games', 7990, '2026-05-28', 0, 'covers/ace-point-tenis-cover.svg', 'banners/ace-point-tenis-banner.svg', ARRAY['shots/ace-point-tenis-shot-1.svg', 'shots/ace-point-tenis-shot-2.svg', 'shots/ace-point-tenis-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10","cpu":"Dual core 2.4 GHz","ram":"4 GB","gpu":"Integrada com DirectX 11","storage":"2 GB"},"recommended":{"os":"Windows 10/11","cpu":"Quad core 3.0 GHz","ram":"8 GB","gpu":"GTX 750 / RX 560","storage":"2 GB"}}'::jsonb, 0, 0, 1527, false
from public.categories c where c.slug = 'esportes';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'imperio-de-cobre', 'Império de Cobre', 'Erga cidades a vapor, negocie tratados e domine um continente movido a cobre e carvão.', 'Erga cidades a vapor, negocie tratados e domine um continente movido a cobre e carvão.

Campanha com missões variadas, escaramuças contra a IA e um editor de mapas para criar seus próprios desafios.

Desenvolvido por Engrenagem Real e publicado por Grimório Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Engrenagem Real', 'Grimório Publishing', 11990, '2025-10-17', 12, 'covers/imperio-de-cobre-cover.svg', 'banners/imperio-de-cobre-banner.svg', ARRAY['shots/imperio-de-cobre-shot-1.svg', 'shots/imperio-de-cobre-shot-2.svg', 'shots/imperio-de-cobre-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i5-8400 / Ryzen 5 2600","ram":"12 GB","gpu":"GTX 1060 6GB / RX 580","storage":"60 GB SSD"},"recommended":{"os":"Windows 11 64 bits","cpu":"Core i7-10700 / Ryzen 7 3700X","ram":"16 GB","gpu":"RTX 3060 / RX 6600 XT","storage":"60 GB SSD"}}'::jsonb, 0, 0, 2206, false
from public.categories c where c.slug = 'estrategia';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'sentinelas-do-vale', 'Sentinelas do Vale', 'Posicione sentinelas, ative runas e proteja o vale de ondas de criaturas que aprendem com você.', 'Posicione sentinelas, ative runas e proteja o vale de ondas de criaturas que aprendem com você.

Campanha com missões variadas, escaramuças contra a IA e um editor de mapas para criar seus próprios desafios.

Desenvolvido por Torre de Vigia e publicado por Nova Aurora Games. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Torre de Vigia', 'Nova Aurora Games', 6990, '2026-04-04', 10, 'covers/sentinelas-do-vale-cover.svg', 'banners/sentinelas-do-vale-banner.svg', ARRAY['shots/sentinelas-do-vale-shot-1.svg', 'shots/sentinelas-do-vale-shot-2.svg', 'shots/sentinelas-do-vale-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 229, false
from public.categories c where c.slug = 'estrategia';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'mares-de-guerra', 'Marés de Guerra', 'Comande frotas em um conflito naval entre arquipélagos e use a maré a seu favor.', 'Comande frotas em um conflito naval entre arquipélagos e use a maré a seu favor.

Campanha com missões variadas, escaramuças contra a IA e um editor de mapas para criar seus próprios desafios.

Desenvolvido por Almirantado Digital e publicado por Ferro & Fogo Entretenimento. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Almirantado Digital', 'Ferro & Fogo Entretenimento', 12990, '2025-12-12', 12, 'covers/mares-de-guerra-cover.svg', 'banners/mares-de-guerra-banner.svg', ARRAY['shots/mares-de-guerra-shot-1.svg', 'shots/mares-de-guerra-shot-2.svg', 'shots/mares-de-guerra-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i5-8400 / Ryzen 5 2600","ram":"12 GB","gpu":"GTX 1060 6GB / RX 580","storage":"60 GB SSD"},"recommended":{"os":"Windows 11 64 bits","cpu":"Core i7-10700 / Ryzen 7 3700X","ram":"16 GB","gpu":"RTX 3060 / RX 6600 XT","storage":"60 GB SSD"}}'::jsonb, 0, 0, 2664, false
from public.categories c where c.slug = 'estrategia';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'colonia-kepler', 'Colônia Kepler', 'Colonize um planeta hostil: gerencie recursos, pesquise tecnologias e mantenha a tripulação viva.', 'Colonize um planeta hostil: gerencie recursos, pesquise tecnologias e mantenha a tripulação viva.

Campanha com missões variadas, escaramuças contra a IA e um editor de mapas para criar seus próprios desafios.

Desenvolvido por Órbita Sul e publicado por Pulsar Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Órbita Sul', 'Pulsar Publishing', 9490, '2026-08-21', 10, 'covers/colonia-kepler-cover.svg', 'banners/colonia-kepler-banner.svg', ARRAY['shots/colonia-kepler-shot-1.svg', 'shots/colonia-kepler-shot-2.svg', 'shots/colonia-kepler-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 620, false
from public.categories c where c.slug = 'estrategia';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'o-porao-de-marrowgate', 'O Porão de Marrowgate', 'Uma mansão, um porão e algo que sussurra seu nome entre os canos. A luz é sua única defesa.', 'Uma mansão, um porão e algo que sussurra seu nome entre os canos. A luz é sua única defesa.

Atmosfera densa, áudio 3D que pede fones de ouvido e sustos construídos com paciência, nunca de graça.

Desenvolvido por Lume Fraco e publicado por Noite Funda Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Lume Fraco', 'Noite Funda Publishing', 5990, '2025-10-30', 16, 'covers/o-porao-de-marrowgate-cover.svg', 'banners/o-porao-de-marrowgate-banner.svg', ARRAY['shots/o-porao-de-marrowgate-shot-1.svg', 'shots/o-porao-de-marrowgate-shot-2.svg', 'shots/o-porao-de-marrowgate-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 1522, false
from public.categories c where c.slug = 'terror';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'sussurros-na-estacao-9', 'Sussurros na Estação 9', 'Uma estação espacial abandonada e uma tripulação que parou de responder. Não ouça as paredes.', 'Uma estação espacial abandonada e uma tripulação que parou de responder. Não ouça as paredes.

Atmosfera densa, áudio 3D que pede fones de ouvido e sustos construídos com paciência, nunca de graça.

Desenvolvido por Silêncio Absoluto e publicado por Noite Funda Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Silêncio Absoluto', 'Noite Funda Publishing', 7490, '2026-10-09', 18, 'covers/sussurros-na-estacao-9-cover.svg', 'banners/sussurros-na-estacao-9-banner.svg', ARRAY['shots/sussurros-na-estacao-9-shot-1.svg', 'shots/sussurros-na-estacao-9-shot-2.svg', 'shots/sussurros-na-estacao-9-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 874, false
from public.categories c where c.slug = 'terror';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'casa-dos-espelhos-cegos', 'Casa dos Espelhos Cegos', 'Resolva enigmas em um labirinto de espelhos onde o reflexo nem sempre acompanha seus movimentos.', 'Resolva enigmas em um labirinto de espelhos onde o reflexo nem sempre acompanha seus movimentos.

Atmosfera densa, áudio 3D que pede fones de ouvido e sustos construídos com paciência, nunca de graça.

Desenvolvido por Reflexo Sombrio e publicado por Noite Funda Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Reflexo Sombrio', 'Noite Funda Publishing', 4990, '2026-06-06', 14, 'covers/casa-dos-espelhos-cegos-cover.svg', 'banners/casa-dos-espelhos-cegos-banner.svg', ARRAY['shots/casa-dos-espelhos-cegos-shot-1.svg', 'shots/casa-dos-espelhos-cegos-shot-2.svg', 'shots/casa-dos-espelhos-cegos-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 2601, false
from public.categories c where c.slug = 'terror';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'vigilia-escarlate', 'Vigília Escarlate', 'Passe a noite em um convento isolado e sobreviva até o amanhecer vermelho.', 'Passe a noite em um convento isolado e sobreviva até o amanhecer vermelho.

Atmosfera densa, áudio 3D que pede fones de ouvido e sustos construídos com paciência, nunca de graça.

Desenvolvido por Corvo Sem Asa e publicado por Grimório Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Corvo Sem Asa', 'Grimório Publishing', 8490, '2025-09-26', 18, 'covers/vigilia-escarlate-cover.svg', 'banners/vigilia-escarlate-banner.svg', ARRAY['shots/vigilia-escarlate-shot-1.svg', 'shots/vigilia-escarlate-shot-2.svg', 'shots/vigilia-escarlate-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 93, false
from public.categories c where c.slug = 'terror';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'pixel-pomar', 'Pixel Pomar', 'Cultive um pomar pixelado, troque frutas com vizinhos e descubra por que as macieiras cantam à noite.', 'Cultive um pomar pixelado, troque frutas com vizinhos e descubra por que as macieiras cantam à noite.

Feito por uma equipe pequena e apaixonada: curto, inventivo e cheio de personalidade.

Desenvolvido por Maçã Verde Games e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Maçã Verde Games', 'Brisa Interativa', 0, '2026-04-15', 0, 'covers/pixel-pomar-cover.svg', 'banners/pixel-pomar-banner.svg', ARRAY['shots/pixel-pomar-shot-1.svg', 'shots/pixel-pomar-shot-2.svg', 'shots/pixel-pomar-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10","cpu":"Dual core 2.4 GHz","ram":"4 GB","gpu":"Integrada com DirectX 11","storage":"2 GB"},"recommended":{"os":"Windows 10/11","cpu":"Quad core 3.0 GHz","ram":"8 GB","gpu":"GTX 750 / RX 560","storage":"2 GB"}}'::jsonb, 0, 0, 2249, false
from public.categories c where c.slug = 'indie';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'lanterna-minima', 'Lanterna Mínima', 'Um quebra-cabeça de luz e sombra com uma única lanterna e muitas ideias.', 'Um quebra-cabeça de luz e sombra com uma única lanterna e muitas ideias.

Feito por uma equipe pequena e apaixonada: curto, inventivo e cheio de personalidade.

Desenvolvido por Feijão Mágico e publicado por Nova Aurora Games. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Feijão Mágico', 'Nova Aurora Games', 2990, '2026-02-01', 0, 'covers/lanterna-minima-cover.svg', 'banners/lanterna-minima-banner.svg', ARRAY['shots/lanterna-minima-shot-1.svg', 'shots/lanterna-minima-shot-2.svg', 'shots/lanterna-minima-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10","cpu":"Dual core 2.4 GHz","ram":"4 GB","gpu":"Integrada com DirectX 11","storage":"2 GB"},"recommended":{"os":"Windows 10/11","cpu":"Quad core 3.0 GHz","ram":"8 GB","gpu":"GTX 750 / RX 560","storage":"2 GB"}}'::jsonb, 0, 0, 1618, false
from public.categories c where c.slug = 'indie';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'sopa-de-estrelas', 'Sopa de Estrelas', 'Cozinhe receitas intergalácticas com amigos em cozinhas que giram, voam e explodem.', 'Cozinhe receitas intergalácticas com amigos em cozinhas que giram, voam e explodem.

Feito por uma equipe pequena e apaixonada: curto, inventivo e cheio de personalidade.

Desenvolvido por Panela Cósmica e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Panela Cósmica', 'Brisa Interativa', 3990, '2025-12-22', 0, 'covers/sopa-de-estrelas-cover.svg', 'banners/sopa-de-estrelas-banner.svg', ARRAY['shots/sopa-de-estrelas-shot-1.svg', 'shots/sopa-de-estrelas-shot-2.svg', 'shots/sopa-de-estrelas-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10","cpu":"Dual core 2.4 GHz","ram":"4 GB","gpu":"Integrada com DirectX 11","storage":"2 GB"},"recommended":{"os":"Windows 10/11","cpu":"Quad core 3.0 GHz","ram":"8 GB","gpu":"GTX 750 / RX 560","storage":"2 GB"}}'::jsonb, 0, 0, 470, false
from public.categories c where c.slug = 'indie';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'coruja-engrenagem', 'Coruja & Engrenagem', 'Uma coruja mecânica conserta o relógio de uma cidade que perdeu o amanhã.', 'Uma coruja mecânica conserta o relógio de uma cidade que perdeu o amanhã.

Feito por uma equipe pequena e apaixonada: curto, inventivo e cheio de personalidade.

Desenvolvido por Relojoaria Indie e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Relojoaria Indie', 'Brisa Interativa', 4490, '2026-07-30', 0, 'covers/coruja-engrenagem-cover.svg', 'banners/coruja-engrenagem-banner.svg', ARRAY['shots/coruja-engrenagem-shot-1.svg', 'shots/coruja-engrenagem-shot-2.svg', 'shots/coruja-engrenagem-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10","cpu":"Dual core 2.4 GHz","ram":"4 GB","gpu":"Integrada com DirectX 11","storage":"2 GB"},"recommended":{"os":"Windows 10/11","cpu":"Quad core 3.0 GHz","ram":"8 GB","gpu":"GTX 750 / RX 560","storage":"2 GB"}}'::jsonb, 0, 0, 459, false
from public.categories c where c.slug = 'indie';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'fazenda-lua-nova', 'Fazenda Lua Nova', 'Planeje plantações pela fase da lua, crie bichos curiosos e transforme um terreno em um lar.', 'Planeje plantações pela fase da lua, crie bichos curiosos e transforme um terreno em um lar.

Sistemas profundos e relaxantes, progresso constante e liberdade para jogar do seu jeito.

Desenvolvido por Terra Boa Studio e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Terra Boa Studio', 'Brisa Interativa', 6990, '2025-09-05', 0, 'covers/fazenda-lua-nova-cover.svg', 'banners/fazenda-lua-nova-banner.svg', ARRAY['shots/fazenda-lua-nova-shot-1.svg', 'shots/fazenda-lua-nova-shot-2.svg', 'shots/fazenda-lua-nova-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 2808, false
from public.categories c where c.slug = 'simulacao';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'torre-de-controle-360', 'Torre de Controle 360', 'Coordene pousos e decolagens em um aeroporto internacional e mantenha tudo no horário.', 'Coordene pousos e decolagens em um aeroporto internacional e mantenha tudo no horário.

Sistemas profundos e relaxantes, progresso constante e liberdade para jogar do seu jeito.

Desenvolvido por Pista Livre e publicado por Ferro & Fogo Entretenimento. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Pista Livre', 'Ferro & Fogo Entretenimento', 9990, '2026-03-27', 0, 'covers/torre-de-controle-360-cover.svg', 'banners/torre-de-controle-360-banner.svg', ARRAY['shots/torre-de-controle-360-shot-1.svg', 'shots/torre-de-controle-360-shot-2.svg', 'shots/torre-de-controle-360-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 488, false
from public.categories c where c.slug = 'simulacao';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'cafeteria-quantica', 'Cafeteria Quântica', 'Abra uma cafeteria onde o café chega de todas as dimensões e os clientes também.', 'Abra uma cafeteria onde o café chega de todas as dimensões e os clientes também.

Sistemas profundos e relaxantes, progresso constante e liberdade para jogar do seu jeito.

Desenvolvido por Grão Estelar e publicado por Pulsar Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Grão Estelar', 'Pulsar Publishing', 5990, '2026-09-12', 0, 'covers/cafeteria-quantica-cover.svg', 'banners/cafeteria-quantica-banner.svg', ARRAY['shots/cafeteria-quantica-shot-1.svg', 'shots/cafeteria-quantica-shot-2.svg', 'shots/cafeteria-quantica-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 2252, false
from public.categories c where c.slug = 'simulacao';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'arena-quorum', 'Arena Quórum', 'Arena 5x5 com heróis de habilidades únicas e partidas de 15 minutos. Fácil de aprender, difícil de dominar.', 'Arena 5x5 com heróis de habilidades únicas e partidas de 15 minutos. Fácil de aprender, difícil de dominar.

Partidas rápidas, matchmaking por habilidade e atualizações periódicas com novos mapas e modos.

Desenvolvido por Quorum Labs e publicado por Pulsar Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Quorum Labs', 'Pulsar Publishing', 0, '2026-01-20', 12, 'covers/arena-quorum-cover.svg', 'banners/arena-quorum-banner.svg', ARRAY['shots/arena-quorum-shot-1.svg', 'shots/arena-quorum-shot-2.svg', 'shots/arena-quorum-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 1090, false
from public.categories c where c.slug = 'multiplayer';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'esquadrao-vortice', 'Esquadrão Vórtice', 'Esquadrões de quatro pessoas disputam o controle de portais que alteram as regras da partida.', 'Esquadrões de quatro pessoas disputam o controle de portais que alteram as regras da partida.

Partidas rápidas, matchmaking por habilidade e atualizações periódicas com novos mapas e modos.

Desenvolvido por Cabo Largo e publicado por Ferro & Fogo Entretenimento. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Cabo Largo', 'Ferro & Fogo Entretenimento', 7990, '2025-08-29', 16, 'covers/esquadrao-vortice-cover.svg', 'banners/esquadrao-vortice-banner.svg', ARRAY['shots/esquadrao-vortice-shot-1.svg', 'shots/esquadrao-vortice-shot-2.svg', 'shots/esquadrao-vortice-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 2187, false
from public.categories c where c.slug = 'multiplayer';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'festa-caotica-online', 'Festa Caótica Online', 'Minijogos rápidos e absurdos para até 8 jogadores. Perfeito para sofá, TV e risada alta.', 'Minijogos rápidos e absurdos para até 8 jogadores. Perfeito para sofá, TV e risada alta.

Partidas rápidas, matchmaking por habilidade e atualizações periódicas com novos mapas e modos.

Desenvolvido por Confete Digital e publicado por Brisa Interativa. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Confete Digital', 'Brisa Interativa', 0, '2026-05-16', 0, 'covers/festa-caotica-online-cover.svg', 'banners/festa-caotica-online-banner.svg', ARRAY['shots/festa-caotica-online-shot-1.svg', 'shots/festa-caotica-online-shot-2.svg', 'shots/festa-caotica-online-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 2357, false
from public.categories c where c.slug = 'multiplayer';
insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select 'guerra-de-clas-muralhas', 'Guerra de Clãs: Muralhas', 'Construa muralhas, forme um clã e dispute territórios em guerras que duram dias.', 'Construa muralhas, forme um clã e dispute territórios em guerras que duram dias.

Partidas rápidas, matchmaking por habilidade e atualizações periódicas com novos mapas e modos.

Desenvolvido por Cavalaria Móvel e publicado por Grimório Publishing. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.', c.id, 'Cavalaria Móvel', 'Grimório Publishing', 0, '2026-06-25', 10, 'covers/guerra-de-clas-muralhas-cover.svg', 'banners/guerra-de-clas-muralhas-banner.svg', ARRAY['shots/guerra-de-clas-muralhas-shot-1.svg', 'shots/guerra-de-clas-muralhas-shot-2.svg', 'shots/guerra-de-clas-muralhas-shot-3.svg']::text[], '{"minimum":{"os":"Windows 10 64 bits","cpu":"Core i3-8100 / Ryzen 3 2200G","ram":"8 GB","gpu":"GTX 960 / RX 470","storage":"20 GB"},"recommended":{"os":"Windows 10/11 64 bits","cpu":"Core i5-9400F / Ryzen 5 3500","ram":"16 GB","gpu":"GTX 1660 / RX 5500 XT","storage":"20 GB"}}'::jsonb, 0, 0, 1796, false
from public.categories c where c.slug = 'multiplayer';

insert into public.game_tags (game_id, tag_id)
select g.id, t.id from (values
  ('lamina-do-eclipse', 'single-player'),
  ('lamina-do-eclipse', 'dificil'),
  ('lamina-do-eclipse', 'fantasia'),
  ('lamina-do-eclipse', 'combate-corpo-a-corpo'),
  ('furia-de-neon', 'cyberpunk'),
  ('furia-de-neon', 'frenetico'),
  ('furia-de-neon', 'single-player'),
  ('furia-de-neon', 'hack-and-slash'),
  ('operacao-cinzas', 'tiro-tatico'),
  ('operacao-cinzas', 'cooperativo'),
  ('operacao-cinzas', 'pos-apocaliptico'),
  ('operacao-cinzas', 'campanha'),
  ('ronin-cibernetico', 'cyberpunk'),
  ('ronin-cibernetico', 'plataforma'),
  ('ronin-cibernetico', 'pixel-art'),
  ('ronin-cibernetico', 'dificil'),
  ('brigada-vertice', 'mechas'),
  ('brigada-vertice', 'ficcao-cientifica'),
  ('brigada-vertice', 'single-player'),
  ('brigada-vertice', 'campanha'),
  ('ilhas-de-aurora', 'mundo-aberto'),
  ('ilhas-de-aurora', 'relaxante'),
  ('ilhas-de-aurora', 'exploracao'),
  ('ilhas-de-aurora', 'narrativa'),
  ('a-trilha-dos-vagalumes', 'narrativa'),
  ('a-trilha-dos-vagalumes', 'familia'),
  ('a-trilha-dos-vagalumes', 'relaxante'),
  ('a-trilha-dos-vagalumes', 'puzzle'),
  ('relicario-de-areia', 'exploracao'),
  ('relicario-de-areia', 'misterio'),
  ('relicario-de-areia', 'acao-aventura'),
  ('relicario-de-areia', 'single-player'),
  ('cartografo-das-nuvens', 'exploracao'),
  ('cartografo-das-nuvens', 'relaxante'),
  ('cartografo-das-nuvens', 'mundo-aberto'),
  ('cartografo-das-nuvens', 'puzzle'),
  ('cronicas-de-valdoran', 'fantasia'),
  ('cronicas-de-valdoran', 'mundo-aberto'),
  ('cronicas-de-valdoran', 'escolhas-importam'),
  ('cronicas-de-valdoran', 'single-player'),
  ('herdeiros-da-runa-partida', 'fantasia'),
  ('herdeiros-da-runa-partida', 'combate-por-turnos'),
  ('herdeiros-da-runa-partida', 'narrativa'),
  ('herdeiros-da-runa-partida', 'cooperativo'),
  ('sombras-de-ember', 'sombrio'),
  ('sombras-de-ember', 'dificil'),
  ('sombras-de-ember', 'roguelike'),
  ('sombras-de-ember', 'fantasia'),
  ('lorde-dos-mil-sinos', 'fantasia'),
  ('lorde-dos-mil-sinos', 'gestao'),
  ('lorde-dos-mil-sinos', 'combate-por-turnos'),
  ('lorde-dos-mil-sinos', 'humor'),
  ('pacto-de-cinzas-e-ouro', 'mundo-aberto'),
  ('pacto-de-cinzas-e-ouro', 'sombrio'),
  ('pacto-de-cinzas-e-ouro', 'escolhas-importam'),
  ('pacto-de-cinzas-e-ouro', 'mercenarios'),
  ('asfalto-solar', 'corrida-arcade'),
  ('asfalto-solar', 'multijogador-local'),
  ('asfalto-solar', 'colorido'),
  ('asfalto-solar', 'carros'),
  ('gravitron-gp', 'futurista'),
  ('gravitron-gp', 'corrida-arcade'),
  ('gravitron-gp', 'online'),
  ('gravitron-gp', 'rapido'),
  ('rali-das-dunas-vermelhas', 'simulacao'),
  ('rali-das-dunas-vermelhas', 'rali'),
  ('rali-das-dunas-vermelhas', 'mundo-aberto'),
  ('rali-das-dunas-vermelhas', 'carros'),
  ('turbo-quartzo', 'corrida-arcade'),
  ('turbo-quartzo', 'pixel-art'),
  ('turbo-quartzo', 'multijogador-local'),
  ('turbo-quartzo', 'retro'),
  ('futsal-arena-pro', 'futebol'),
  ('futsal-arena-pro', 'online'),
  ('futsal-arena-pro', 'multijogador-local'),
  ('futsal-arena-pro', 'competitivo'),
  ('cesta-maxima-street', 'basquete'),
  ('cesta-maxima-street', 'street'),
  ('cesta-maxima-street', 'multijogador-local'),
  ('cesta-maxima-street', 'competitivo'),
  ('volei-de-praia-mare-alta', 'volei'),
  ('volei-de-praia-mare-alta', 'multijogador-local'),
  ('volei-de-praia-mare-alta', 'relaxante'),
  ('volei-de-praia-mare-alta', 'colorido'),
  ('ace-point-tenis', 'tenis'),
  ('ace-point-tenis', 'online'),
  ('ace-point-tenis', 'competitivo'),
  ('ace-point-tenis', 'simulacao'),
  ('imperio-de-cobre', 'estrategia-em-tempo-real'),
  ('imperio-de-cobre', 'steampunk'),
  ('imperio-de-cobre', 'construcao-de-base'),
  ('imperio-de-cobre', 'campanha'),
  ('sentinelas-do-vale', 'tower-defense'),
  ('sentinelas-do-vale', 'fantasia'),
  ('sentinelas-do-vale', 'taticas'),
  ('sentinelas-do-vale', 'single-player'),
  ('mares-de-guerra', 'naval'),
  ('mares-de-guerra', 'taticas-por-turno'),
  ('mares-de-guerra', 'campanha'),
  ('mares-de-guerra', 'historia-alternativa'),
  ('colonia-kepler', 'ficcao-cientifica'),
  ('colonia-kepler', 'gestao'),
  ('colonia-kepler', 'construcao-de-base'),
  ('colonia-kepler', 'sobrevivencia'),
  ('o-porao-de-marrowgate', 'terror-psicologico'),
  ('o-porao-de-marrowgate', 'furtivo'),
  ('o-porao-de-marrowgate', 'atmosferico'),
  ('o-porao-de-marrowgate', 'single-player'),
  ('sussurros-na-estacao-9', 'terror-psicologico'),
  ('sussurros-na-estacao-9', 'ficcao-cientifica'),
  ('sussurros-na-estacao-9', 'atmosferico'),
  ('sussurros-na-estacao-9', 'sobrevivencia'),
  ('casa-dos-espelhos-cegos', 'puzzle'),
  ('casa-dos-espelhos-cegos', 'terror-psicologico'),
  ('casa-dos-espelhos-cegos', 'misterio'),
  ('casa-dos-espelhos-cegos', 'atmosferico'),
  ('vigilia-escarlate', 'sobrevivencia'),
  ('vigilia-escarlate', 'gotico'),
  ('vigilia-escarlate', 'furtivo'),
  ('vigilia-escarlate', 'sombrio'),
  ('pixel-pomar', 'pixel-art'),
  ('pixel-pomar', 'relaxante'),
  ('pixel-pomar', 'gratuito-para-jogar'),
  ('pixel-pomar', 'gestao'),
  ('lanterna-minima', 'puzzle'),
  ('lanterna-minima', 'minimalista'),
  ('lanterna-minima', 'atmosferico'),
  ('lanterna-minima', 'plataforma'),
  ('sopa-de-estrelas', 'culinaria'),
  ('sopa-de-estrelas', 'familia'),
  ('sopa-de-estrelas', 'colorido'),
  ('sopa-de-estrelas', 'cooperativo'),
  ('coruja-engrenagem', 'steampunk'),
  ('coruja-engrenagem', 'plataforma'),
  ('coruja-engrenagem', 'narrativa'),
  ('coruja-engrenagem', 'pixel-art'),
  ('fazenda-lua-nova', 'fazenda'),
  ('fazenda-lua-nova', 'relaxante'),
  ('fazenda-lua-nova', 'gestao'),
  ('fazenda-lua-nova', 'familia'),
  ('torre-de-controle-360', 'simulador'),
  ('torre-de-controle-360', 'gestao'),
  ('torre-de-controle-360', 'realista'),
  ('torre-de-controle-360', 'single-player'),
  ('cafeteria-quantica', 'gestao'),
  ('cafeteria-quantica', 'cozinha'),
  ('cafeteria-quantica', 'humor'),
  ('cafeteria-quantica', 'ficcao-cientifica'),
  ('arena-quorum', 'gratuito-para-jogar'),
  ('arena-quorum', 'competitivo'),
  ('arena-quorum', 'online'),
  ('arena-quorum', 'herois'),
  ('esquadrao-vortice', 'tiro-tatico'),
  ('esquadrao-vortice', 'cooperativo'),
  ('esquadrao-vortice', 'online'),
  ('esquadrao-vortice', 'competitivo'),
  ('festa-caotica-online', 'gratuito-para-jogar'),
  ('festa-caotica-online', 'familia'),
  ('festa-caotica-online', 'multijogador-local'),
  ('festa-caotica-online', 'party-game'),
  ('guerra-de-clas-muralhas', 'gratuito-para-jogar'),
  ('guerra-de-clas-muralhas', 'estrategia-em-tempo-real'),
  ('guerra-de-clas-muralhas', 'online'),
  ('guerra-de-clas-muralhas', 'competitivo')
) v(gs, ts) join public.games g on g.slug = v.gs join public.tags t on t.slug = v.ts;

insert into public.game_platforms (game_id, platform_id)
select g.id, p.id from (values
  ('lamina-do-eclipse', 'pc'),
  ('lamina-do-eclipse', 'pen-drive'),
  ('furia-de-neon', 'pc'),
  ('furia-de-neon', 'game-stick'),
  ('furia-de-neon', 'pen-drive'),
  ('operacao-cinzas', 'pc'),
  ('operacao-cinzas', 'pen-drive'),
  ('ronin-cibernetico', 'pc'),
  ('ronin-cibernetico', 'game-stick'),
  ('ronin-cibernetico', 'android'),
  ('ronin-cibernetico', 'pen-drive'),
  ('brigada-vertice', 'pc'),
  ('brigada-vertice', 'game-stick'),
  ('brigada-vertice', 'pen-drive'),
  ('ilhas-de-aurora', 'pc'),
  ('ilhas-de-aurora', 'game-stick'),
  ('ilhas-de-aurora', 'android'),
  ('ilhas-de-aurora', 'pen-drive'),
  ('a-trilha-dos-vagalumes', 'pc'),
  ('a-trilha-dos-vagalumes', 'game-stick'),
  ('a-trilha-dos-vagalumes', 'android'),
  ('a-trilha-dos-vagalumes', 'pen-drive'),
  ('relicario-de-areia', 'pc'),
  ('relicario-de-areia', 'pen-drive'),
  ('cartografo-das-nuvens', 'pc'),
  ('cartografo-das-nuvens', 'game-stick'),
  ('cartografo-das-nuvens', 'android'),
  ('cartografo-das-nuvens', 'pen-drive'),
  ('cronicas-de-valdoran', 'pc'),
  ('cronicas-de-valdoran', 'pen-drive'),
  ('herdeiros-da-runa-partida', 'pc'),
  ('herdeiros-da-runa-partida', 'pen-drive'),
  ('sombras-de-ember', 'pc'),
  ('sombras-de-ember', 'pen-drive'),
  ('lorde-dos-mil-sinos', 'pc'),
  ('lorde-dos-mil-sinos', 'game-stick'),
  ('lorde-dos-mil-sinos', 'pen-drive'),
  ('pacto-de-cinzas-e-ouro', 'pc'),
  ('pacto-de-cinzas-e-ouro', 'pen-drive'),
  ('asfalto-solar', 'pc'),
  ('asfalto-solar', 'game-stick'),
  ('asfalto-solar', 'pen-drive'),
  ('gravitron-gp', 'pc'),
  ('gravitron-gp', 'game-stick'),
  ('gravitron-gp', 'pen-drive'),
  ('rali-das-dunas-vermelhas', 'pc'),
  ('rali-das-dunas-vermelhas', 'pen-drive'),
  ('turbo-quartzo', 'pc'),
  ('turbo-quartzo', 'game-stick'),
  ('turbo-quartzo', 'android'),
  ('turbo-quartzo', 'pen-drive'),
  ('futsal-arena-pro', 'pc'),
  ('futsal-arena-pro', 'game-stick'),
  ('futsal-arena-pro', 'pen-drive'),
  ('cesta-maxima-street', 'pc'),
  ('cesta-maxima-street', 'game-stick'),
  ('cesta-maxima-street', 'pen-drive'),
  ('volei-de-praia-mare-alta', 'pc'),
  ('volei-de-praia-mare-alta', 'game-stick'),
  ('volei-de-praia-mare-alta', 'android'),
  ('volei-de-praia-mare-alta', 'pen-drive'),
  ('ace-point-tenis', 'pc'),
  ('ace-point-tenis', 'pen-drive'),
  ('imperio-de-cobre', 'pc'),
  ('imperio-de-cobre', 'pen-drive'),
  ('sentinelas-do-vale', 'pc'),
  ('sentinelas-do-vale', 'game-stick'),
  ('sentinelas-do-vale', 'pen-drive'),
  ('mares-de-guerra', 'pc'),
  ('mares-de-guerra', 'pen-drive'),
  ('colonia-kepler', 'pc'),
  ('colonia-kepler', 'pen-drive'),
  ('o-porao-de-marrowgate', 'pc'),
  ('o-porao-de-marrowgate', 'pen-drive'),
  ('sussurros-na-estacao-9', 'pc'),
  ('sussurros-na-estacao-9', 'pen-drive'),
  ('casa-dos-espelhos-cegos', 'pc'),
  ('casa-dos-espelhos-cegos', 'game-stick'),
  ('casa-dos-espelhos-cegos', 'pen-drive'),
  ('vigilia-escarlate', 'pc'),
  ('vigilia-escarlate', 'pen-drive'),
  ('pixel-pomar', 'pc'),
  ('pixel-pomar', 'game-stick'),
  ('pixel-pomar', 'android'),
  ('pixel-pomar', 'pen-drive'),
  ('lanterna-minima', 'pc'),
  ('lanterna-minima', 'game-stick'),
  ('lanterna-minima', 'android'),
  ('lanterna-minima', 'pen-drive'),
  ('sopa-de-estrelas', 'pc'),
  ('sopa-de-estrelas', 'game-stick'),
  ('sopa-de-estrelas', 'android'),
  ('sopa-de-estrelas', 'pen-drive'),
  ('coruja-engrenagem', 'pc'),
  ('coruja-engrenagem', 'game-stick'),
  ('coruja-engrenagem', 'android'),
  ('coruja-engrenagem', 'pen-drive'),
  ('fazenda-lua-nova', 'pc'),
  ('fazenda-lua-nova', 'game-stick'),
  ('fazenda-lua-nova', 'android'),
  ('fazenda-lua-nova', 'pen-drive'),
  ('torre-de-controle-360', 'pc'),
  ('torre-de-controle-360', 'pen-drive'),
  ('cafeteria-quantica', 'pc'),
  ('cafeteria-quantica', 'game-stick'),
  ('cafeteria-quantica', 'pen-drive'),
  ('arena-quorum', 'pc'),
  ('arena-quorum', 'game-stick'),
  ('arena-quorum', 'pen-drive'),
  ('esquadrao-vortice', 'pc'),
  ('esquadrao-vortice', 'pen-drive'),
  ('festa-caotica-online', 'pc'),
  ('festa-caotica-online', 'game-stick'),
  ('festa-caotica-online', 'android'),
  ('festa-caotica-online', 'pen-drive'),
  ('guerra-de-clas-muralhas', 'pc'),
  ('guerra-de-clas-muralhas', 'game-stick'),
  ('guerra-de-clas-muralhas', 'android'),
  ('guerra-de-clas-muralhas', 'pen-drive')
) v(gs, ps) join public.games g on g.slug = v.gs join public.platforms p on p.slug = v.ps;

insert into public.promotions (game_id, discount_percent, starts_at, ends_at)
select g.id, v.d, now() - interval '2 days', now() + interval '30 days' from (values
  ('lamina-do-eclipse', 25),
  ('operacao-cinzas', 40),
  ('brigada-vertice', 15),
  ('ilhas-de-aurora', 20),
  ('relicario-de-areia', 30),
  ('cronicas-de-valdoran', 35),
  ('sombras-de-ember', 20),
  ('pacto-de-cinzas-e-ouro', 45),
  ('asfalto-solar', 20),
  ('rali-das-dunas-vermelhas', 30),
  ('futsal-arena-pro', 20),
  ('volei-de-praia-mare-alta', 25),
  ('imperio-de-cobre', 30),
  ('mares-de-guerra', 20),
  ('sussurros-na-estacao-9', 35),
  ('vigilia-escarlate', 25),
  ('sopa-de-estrelas', 20),
  ('fazenda-lua-nova', 25),
  ('esquadrao-vortice', 30)
) v(gs, d) join public.games g on g.slug = v.gs;

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change) values
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000a1', 'authenticated', 'authenticated', 'admin@pixelporto.test', crypt('Admin@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Admin GameZone"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000c1', 'authenticated', 'authenticated', 'ana@pixelporto.test', crypt('Cliente@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Ana Souza"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000c2', 'authenticated', 'authenticated', 'bruno@pixelporto.test', crypt('Cliente@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Bruno Lima"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000c3', 'authenticated', 'authenticated', 'carla@pixelporto.test', crypt('Cliente@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Carla Mendes"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000e1', 'authenticated', 'authenticated', 'demo@pixelporto.test', crypt('Demo@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Jogador Demo"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d0', 'authenticated', 'authenticated', 'avaliador1@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Marcos Tavares"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d1', 'authenticated', 'authenticated', 'avaliador2@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Júlia Ferraz"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d2', 'authenticated', 'authenticated', 'avaliador3@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Pedro Albuquerque"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d3', 'authenticated', 'authenticated', 'avaliador4@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Larissa Mota"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d4', 'authenticated', 'authenticated', 'avaliador5@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Rafael Brandão"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d5', 'authenticated', 'authenticated', 'avaliador6@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Camila Duarte"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d6', 'authenticated', 'authenticated', 'avaliador7@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Thiago Nogueira"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d7', 'authenticated', 'authenticated', 'avaliador8@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Beatriz Lima"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d8', 'authenticated', 'authenticated', 'avaliador9@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Gustavo Reis"}'::jsonb, now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000d9', 'authenticated', 'authenticated', 'avaliador10@pixelporto.test', crypt('Avaliador@123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"display_name":"Fernanda Pires"}'::jsonb, now(), now(), '', '', '', '');

insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-0000000000a1', '{"sub":"00000000-0000-4000-8000-0000000000a1","email":"admin@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000c1', '00000000-0000-4000-8000-0000000000c1', '{"sub":"00000000-0000-4000-8000-0000000000c1","email":"ana@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000c2', '00000000-0000-4000-8000-0000000000c2', '{"sub":"00000000-0000-4000-8000-0000000000c2","email":"bruno@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000c3', '00000000-0000-4000-8000-0000000000c3', '{"sub":"00000000-0000-4000-8000-0000000000c3","email":"carla@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000e1', '00000000-0000-4000-8000-0000000000e1', '{"sub":"00000000-0000-4000-8000-0000000000e1","email":"demo@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d0', '00000000-0000-4000-8000-0000000000d0', '{"sub":"00000000-0000-4000-8000-0000000000d0","email":"avaliador1@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000d1', '{"sub":"00000000-0000-4000-8000-0000000000d1","email":"avaliador2@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000d2', '{"sub":"00000000-0000-4000-8000-0000000000d2","email":"avaliador3@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d3', '00000000-0000-4000-8000-0000000000d3', '{"sub":"00000000-0000-4000-8000-0000000000d3","email":"avaliador4@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d4', '00000000-0000-4000-8000-0000000000d4', '{"sub":"00000000-0000-4000-8000-0000000000d4","email":"avaliador5@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d5', '00000000-0000-4000-8000-0000000000d5', '{"sub":"00000000-0000-4000-8000-0000000000d5","email":"avaliador6@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d6', '00000000-0000-4000-8000-0000000000d6', '{"sub":"00000000-0000-4000-8000-0000000000d6","email":"avaliador7@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d7', '00000000-0000-4000-8000-0000000000d7', '{"sub":"00000000-0000-4000-8000-0000000000d7","email":"avaliador8@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d8', '00000000-0000-4000-8000-0000000000d8', '{"sub":"00000000-0000-4000-8000-0000000000d8","email":"avaliador9@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now()),
  (gen_random_uuid(), '00000000-0000-4000-8000-0000000000d9', '00000000-0000-4000-8000-0000000000d9', '{"sub":"00000000-0000-4000-8000-0000000000d9","email":"avaliador10@pixelporto.test","email_verified":true}'::jsonb, 'email', now(), now(), now());

update public.profiles set role = 'admin' where id = '00000000-0000-4000-8000-0000000000a1';

insert into public.reviews (user_id, game_id, rating, comment, created_at)
select u.id, g.id, v.rating, v.comment, now() - make_interval(days => v.days) from (values
  ('lamina-do-eclipse', 'avaliador5@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 26),
  ('lamina-do-eclipse', 'avaliador4@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 46),
  ('lamina-do-eclipse', 'avaliador8@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 54),
  ('lamina-do-eclipse', 'avaliador3@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 2),
  ('furia-de-neon', 'avaliador4@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 56),
  ('furia-de-neon', 'avaliador6@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 86),
  ('furia-de-neon', 'avaliador3@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 31),
  ('operacao-cinzas', 'avaliador6@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 82),
  ('operacao-cinzas', 'avaliador1@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 63),
  ('operacao-cinzas', 'avaliador2@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 25),
  ('operacao-cinzas', 'avaliador4@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Operação Cinzas é daqueles jogos que a gente recomenda para todo mundo.', 46),
  ('operacao-cinzas', 'avaliador5@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 27),
  ('ronin-cibernetico', 'avaliador4@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 32),
  ('ronin-cibernetico', 'avaliador8@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 44),
  ('ronin-cibernetico', 'avaliador2@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 81),
  ('brigada-vertice', 'avaliador7@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 87),
  ('brigada-vertice', 'avaliador8@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Brigada Vértice é daqueles jogos que a gente recomenda para todo mundo.', 68),
  ('brigada-vertice', 'avaliador10@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 12),
  ('brigada-vertice', 'avaliador4@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 52),
  ('ilhas-de-aurora', 'avaliador6@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 83),
  ('ilhas-de-aurora', 'avaliador1@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 79),
  ('ilhas-de-aurora', 'avaliador9@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Ilhas de Aurora é daqueles jogos que a gente recomenda para todo mundo.', 26),
  ('a-trilha-dos-vagalumes', 'avaliador9@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 1),
  ('a-trilha-dos-vagalumes', 'avaliador3@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 87),
  ('a-trilha-dos-vagalumes', 'avaliador2@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 66),
  ('relicario-de-areia', 'avaliador6@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 42),
  ('relicario-de-areia', 'avaliador8@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 19),
  ('relicario-de-areia', 'avaliador4@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Relicário de Areia é daqueles jogos que a gente recomenda para todo mundo.', 68),
  ('relicario-de-areia', 'avaliador9@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Relicário de Areia é daqueles jogos que a gente recomenda para todo mundo.', 67),
  ('cartografo-das-nuvens', 'avaliador9@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 13),
  ('cartografo-das-nuvens', 'avaliador8@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 52),
  ('cartografo-das-nuvens', 'avaliador3@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 59),
  ('cronicas-de-valdoran', 'avaliador3@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 51),
  ('cronicas-de-valdoran', 'avaliador4@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 3),
  ('cronicas-de-valdoran', 'avaliador10@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 9),
  ('cronicas-de-valdoran', 'avaliador6@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 31),
  ('cronicas-de-valdoran', 'avaliador2@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 71),
  ('herdeiros-da-runa-partida', 'avaliador4@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Herdeiros da Runa Partida é daqueles jogos que a gente recomenda para todo mundo.', 65),
  ('herdeiros-da-runa-partida', 'avaliador7@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 22),
  ('herdeiros-da-runa-partida', 'avaliador10@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 75),
  ('herdeiros-da-runa-partida', 'avaliador1@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 47),
  ('herdeiros-da-runa-partida', 'avaliador9@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 62),
  ('sombras-de-ember', 'avaliador9@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 19),
  ('sombras-de-ember', 'avaliador4@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 76),
  ('sombras-de-ember', 'avaliador10@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 53),
  ('sombras-de-ember', 'avaliador3@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 61),
  ('lorde-dos-mil-sinos', 'avaliador7@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 54),
  ('lorde-dos-mil-sinos', 'avaliador3@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Lorde dos Mil Sinos é daqueles jogos que a gente recomenda para todo mundo.', 54),
  ('lorde-dos-mil-sinos', 'avaliador1@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 45),
  ('lorde-dos-mil-sinos', 'avaliador9@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 63),
  ('lorde-dos-mil-sinos', 'avaliador10@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 28),
  ('pacto-de-cinzas-e-ouro', 'avaliador1@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 80),
  ('pacto-de-cinzas-e-ouro', 'avaliador6@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 13),
  ('pacto-de-cinzas-e-ouro', 'avaliador9@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 75),
  ('pacto-de-cinzas-e-ouro', 'avaliador8@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 70),
  ('pacto-de-cinzas-e-ouro', 'avaliador5@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 2),
  ('asfalto-solar', 'avaliador2@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 68),
  ('asfalto-solar', 'avaliador1@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 25),
  ('asfalto-solar', 'avaliador8@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 81),
  ('gravitron-gp', 'avaliador1@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 18),
  ('gravitron-gp', 'avaliador5@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 72),
  ('gravitron-gp', 'avaliador6@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 3),
  ('rali-das-dunas-vermelhas', 'avaliador7@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 83),
  ('rali-das-dunas-vermelhas', 'avaliador8@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 71),
  ('rali-das-dunas-vermelhas', 'avaliador10@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 6),
  ('rali-das-dunas-vermelhas', 'avaliador4@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 64),
  ('rali-das-dunas-vermelhas', 'avaliador9@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 43),
  ('turbo-quartzo', 'avaliador1@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Turbo Quartzo é daqueles jogos que a gente recomenda para todo mundo.', 74),
  ('turbo-quartzo', 'avaliador2@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 52),
  ('turbo-quartzo', 'avaliador5@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Turbo Quartzo é daqueles jogos que a gente recomenda para todo mundo.', 46),
  ('turbo-quartzo', 'avaliador8@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 72),
  ('turbo-quartzo', 'avaliador6@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 64),
  ('futsal-arena-pro', 'avaliador7@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 26),
  ('futsal-arena-pro', 'avaliador4@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 16),
  ('futsal-arena-pro', 'avaliador3@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 50),
  ('futsal-arena-pro', 'avaliador8@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 66),
  ('cesta-maxima-street', 'avaliador6@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 41),
  ('cesta-maxima-street', 'avaliador1@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 72),
  ('cesta-maxima-street', 'avaliador2@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 12),
  ('cesta-maxima-street', 'avaliador3@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 88),
  ('cesta-maxima-street', 'avaliador4@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 56),
  ('volei-de-praia-mare-alta', 'avaliador7@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 2),
  ('volei-de-praia-mare-alta', 'avaliador3@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 61),
  ('volei-de-praia-mare-alta', 'avaliador9@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 15),
  ('ace-point-tenis', 'avaliador1@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 14),
  ('ace-point-tenis', 'avaliador2@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Ace Point Tênis é daqueles jogos que a gente recomenda para todo mundo.', 79),
  ('ace-point-tenis', 'avaliador3@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 40),
  ('ace-point-tenis', 'avaliador5@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 83),
  ('ace-point-tenis', 'avaliador9@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 62),
  ('imperio-de-cobre', 'avaliador7@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 25),
  ('imperio-de-cobre', 'avaliador3@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 63),
  ('imperio-de-cobre', 'avaliador8@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 72),
  ('sentinelas-do-vale', 'avaliador1@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 58),
  ('sentinelas-do-vale', 'avaliador6@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 28),
  ('sentinelas-do-vale', 'avaliador5@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 48),
  ('sentinelas-do-vale', 'avaliador2@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 56),
  ('mares-de-guerra', 'avaliador6@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 27),
  ('mares-de-guerra', 'avaliador5@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 35),
  ('mares-de-guerra', 'avaliador2@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 48),
  ('mares-de-guerra', 'avaliador1@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 66),
  ('colonia-kepler', 'avaliador10@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Colônia Kepler é daqueles jogos que a gente recomenda para todo mundo.', 77),
  ('colonia-kepler', 'avaliador3@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Colônia Kepler é daqueles jogos que a gente recomenda para todo mundo.', 68),
  ('colonia-kepler', 'avaliador6@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 14),
  ('colonia-kepler', 'avaliador1@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 43),
  ('colonia-kepler', 'avaliador8@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 80),
  ('o-porao-de-marrowgate', 'avaliador8@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 15),
  ('o-porao-de-marrowgate', 'avaliador1@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 10),
  ('o-porao-de-marrowgate', 'avaliador2@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 44),
  ('sussurros-na-estacao-9', 'avaliador8@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 52),
  ('sussurros-na-estacao-9', 'avaliador3@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 85),
  ('sussurros-na-estacao-9', 'avaliador10@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 84),
  ('sussurros-na-estacao-9', 'avaliador5@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 42),
  ('sussurros-na-estacao-9', 'avaliador6@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 77),
  ('casa-dos-espelhos-cegos', 'avaliador1@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 28),
  ('casa-dos-espelhos-cegos', 'avaliador2@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 52),
  ('casa-dos-espelhos-cegos', 'avaliador8@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 10),
  ('casa-dos-espelhos-cegos', 'avaliador10@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 42),
  ('vigilia-escarlate', 'avaliador3@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 8),
  ('vigilia-escarlate', 'avaliador5@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Vigília Escarlate é daqueles jogos que a gente recomenda para todo mundo.', 4),
  ('vigilia-escarlate', 'avaliador6@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 61),
  ('vigilia-escarlate', 'avaliador2@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 80),
  ('pixel-pomar', 'avaliador9@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 46),
  ('pixel-pomar', 'avaliador4@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 47),
  ('pixel-pomar', 'avaliador1@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 77),
  ('lanterna-minima', 'avaliador4@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 16),
  ('lanterna-minima', 'avaliador1@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 30),
  ('lanterna-minima', 'avaliador7@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 19),
  ('sopa-de-estrelas', 'avaliador2@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Sopa de Estrelas é daqueles jogos que a gente recomenda para todo mundo.', 87),
  ('sopa-de-estrelas', 'avaliador6@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 46),
  ('sopa-de-estrelas', 'avaliador8@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 49),
  ('coruja-engrenagem', 'avaliador1@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Coruja & Engrenagem é daqueles jogos que a gente recomenda para todo mundo.', 35),
  ('coruja-engrenagem', 'avaliador2@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 39),
  ('coruja-engrenagem', 'avaliador6@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 41),
  ('fazenda-lua-nova', 'avaliador2@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Fazenda Lua Nova é daqueles jogos que a gente recomenda para todo mundo.', 51),
  ('fazenda-lua-nova', 'avaliador6@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 76),
  ('fazenda-lua-nova', 'avaliador5@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Fazenda Lua Nova é daqueles jogos que a gente recomenda para todo mundo.', 78),
  ('fazenda-lua-nova', 'avaliador7@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 47),
  ('torre-de-controle-360', 'avaliador2@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 88),
  ('torre-de-controle-360', 'avaliador5@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 21),
  ('torre-de-controle-360', 'avaliador7@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 28),
  ('cafeteria-quantica', 'avaliador5@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 16),
  ('cafeteria-quantica', 'avaliador1@pixelporto.test', 5, 'Direção de arte linda, jogabilidade redonda e ótima trilha sonora. Melhor compra do mês.', 26),
  ('cafeteria-quantica', 'avaliador2@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 44),
  ('cafeteria-quantica', 'avaliador8@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 37),
  ('cafeteria-quantica', 'avaliador3@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 79),
  ('arena-quorum', 'avaliador3@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Arena Quórum é daqueles jogos que a gente recomenda para todo mundo.', 84),
  ('arena-quorum', 'avaliador4@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 33),
  ('arena-quorum', 'avaliador9@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Arena Quórum é daqueles jogos que a gente recomenda para todo mundo.', 87),
  ('arena-quorum', 'avaliador6@pixelporto.test', 5, 'Chave chegou na hora e o download foi tranquilo. O jogo é incrível, vale cada centavo.', 78),
  ('esquadrao-vortice', 'avaliador6@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 18),
  ('esquadrao-vortice', 'avaliador1@pixelporto.test', 2, 'Esperava mais. A parte técnica precisa de ajustes e a história é fraca.', 54),
  ('esquadrao-vortice', 'avaliador8@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 53),
  ('esquadrao-vortice', 'avaliador2@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 37),
  ('esquadrao-vortice', 'avaliador5@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 49),
  ('festa-caotica-online', 'avaliador1@pixelporto.test', 4, 'Divertido e bem polido. Com mais conteúdo no fim seria perfeito.', 16),
  ('festa-caotica-online', 'avaliador7@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 63),
  ('festa-caotica-online', 'avaliador8@pixelporto.test', 4, 'Gostei bastante da proposta e do visual. Roda liso no meu equipamento.', 31),
  ('guerra-de-clas-muralhas', 'avaliador9@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 38),
  ('guerra-de-clas-muralhas', 'avaliador7@pixelporto.test', 5, 'Joguei por horas sem ver o tempo passar. Guerra de Clãs: Muralhas é daqueles jogos que a gente recomenda para todo mundo.', 13),
  ('guerra-de-clas-muralhas', 'avaliador6@pixelporto.test', 3, 'Tem ideias legais e execução irregular. Dá para se divertir um bocado.', 48),
  ('guerra-de-clas-muralhas', 'avaliador1@pixelporto.test', 3, 'Bom, mas poderia ser mais ambicioso. Vale esperar uma promoção.', 31),
  ('guerra-de-clas-muralhas', 'avaliador5@pixelporto.test', 4, 'Muito bom! Tem alguns tropeços de ritmo no meio, mas o conjunto é excelente.', 84)
) v(gs, email, rating, comment, days) join public.games g on g.slug = v.gs join auth.users u on u.email = v.email;

create or replace function pg_temp.seed_order(p_email text, p_slugs text[], p_method public.payment_method, p_outcome public.payment_status, p_days_ago int)
returns void language plpgsql as $f$
declare v_uid uuid; v_order uuid; v_pay uuid; v_total int; v_at timestamptz := now() - make_interval(days => p_days_ago);
begin
  select id into v_uid from auth.users where email = p_email;
  select coalesce(sum(final_price_cents), 0) into v_total from public.catalog_games where slug = any(p_slugs);
  insert into public.orders (user_id, total_cents) values (v_uid, v_total) returning id into v_order;
  insert into public.order_items (order_id, game_id, game_title, unit_price_cents, discount_percent)
    select v_order, id, title, final_price_cents, discount_percent from public.catalog_games where slug = any(p_slugs);
  insert into public.payments (order_id, method, amount_cents) values (v_order, case when v_total = 0 then 'free'::public.payment_method else p_method end, v_total) returning id into v_pay;
  if p_outcome = 'approved' then
    perform public.confirm_payment(v_pay, 'approved', 'mock-' || substr(v_pay::text, 1, 8));
  elsif p_outcome = 'declined' then
    perform public.confirm_payment(v_pay, 'declined', 'mock-' || substr(v_pay::text, 1, 8), 'Cartão recusado pelo emissor');
  end if;
  update public.orders set created_at = v_at, paid_at = case when status = 'paid' then v_at + interval '1 minute' end where id = v_order;
  update public.payments set created_at = v_at where id = v_pay;
  update public.library_items set acquired_at = v_at + interval '1 minute' where order_id = v_order;
end $f$;

select pg_temp.seed_order('ana@pixelporto.test', array['lamina-do-eclipse','ilhas-de-aurora','cronicas-de-valdoran'], 'card', 'approved', 20);
select pg_temp.seed_order('ana@pixelporto.test', array['asfalto-solar','pixel-pomar'], 'pix', 'approved', 8);
select pg_temp.seed_order('bruno@pixelporto.test', array['operacao-cinzas','esquadrao-vortice'], 'card', 'approved', 15);
select pg_temp.seed_order('bruno@pixelporto.test', array['futsal-arena-pro'], 'card', 'declined', 6);
select pg_temp.seed_order('bruno@pixelporto.test', array['gravitron-gp'], 'card', 'approved', 3);
select pg_temp.seed_order('carla@pixelporto.test', array['fazenda-lua-nova','sopa-de-estrelas'], 'pix', 'approved', 12);
select pg_temp.seed_order('carla@pixelporto.test', array['colonia-kepler'], 'boleto', 'pending', 1);
-- Usuario demo (modo demonstracao): biblioteca com 3 jogos; o mais recente (RPG) alimenta "Porque voce jogou X"
select pg_temp.seed_order('demo@pixelporto.test', array['lamina-do-eclipse','ilhas-de-aurora'], 'card', 'approved', 18);
select pg_temp.seed_order('demo@pixelporto.test', array['cronicas-de-valdoran'], 'pix', 'approved', 5);

insert into public.wishlists (user_id, game_id)
select u.id, g.id from auth.users u join public.games g on g.slug in ('gravitron-gp', 'relicario-de-areia', 'sopa-de-estrelas')
where u.email = 'demo@pixelporto.test';
