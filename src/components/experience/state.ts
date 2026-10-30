/**
 * Estado mutável compartilhado entre o scroll (GSAP/Lenis) e a cena 3D. Fica fora do React de propósito:
 * é lido a cada frame em `useFrame`, sem causar re-render.
 *  - pos: posição contínua na narrativa (0 a 6): parte inteira = jogo atual, fração = progresso na seção.
 *  - px/py: ponteiro normalizado (-1 a 1).
 *  - vel: velocidade de rolagem (px/frame, com sinal), atualizada pelo Lenis e suavizada pela cena.
 *  - w: peso (0 a 1) de cada cena, calculado pelo palco: 1 = cena totalmente visível.
 */
export const expState = { pos: 0, px: 0, py: 0, vel: 0, w: [1, 0, 0, 0, 0, 0] as number[] };
