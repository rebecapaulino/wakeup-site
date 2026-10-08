/*
 * PIXEL ART DA CENA
 * Mesmo jeito do app (src/components/pixel): cada sprite é uma lista de linhas de texto, e
 * cada letra é um pixel de uma cor da paleta ("." é vazio). O ônibus é o MESMO desenho do
 * `BUS` em sprites.ts. O script transforma as letras em quadradinhos <rect> do SVG.
 */
const NS = 'http://www.w3.org/2000/svg';
const PX = {
  k: '#1D4A3B', G: '#2F6B57', w: '#DDEBFF', b: '#2F6B57', m: '#9FDDBA', y: '#FFE08A', d: '#133328',
  W: '#FFFFFF', s: '#D4E2F7', S: '#FFD166', o: '#F2B233', L: '#FFF3C4',
};
const BUS = [
  '.kkkkkkkkkkkkkkkk.',
  'kGGGGGGGGGGGGGGGGk',
  'kwwbwwbwwbwwbwwwGk',
  'kwwbwwbwwbwwbwwwGk',
  'kGGGGGGGGGGGGGGGGy',
  'kmmmmmmmmmmmmmmmmk',
  'kGGGGGGGGGGGGGGGGk',
  '.kk.dd.kkkkkk.dd..',
  '....dd........dd..',
];
const SUN = ['..SSSS..', '.SLSSSS.', 'SSSSSSSo', 'SSSSSSSo', 'SSSSSSSo', 'SSSSSSoo', '.SSSSoo.', '..oooo..'];
const CLOUD = ['.....WWWW.......', '...WWWWWWWW.WWW.', '.WWWWWWWWWWWWWWW', 'WWWWWWWWWWWWWWWW', '.ssssssssssssss.'];
// Placa do ponto de ônibus.
const STOP = ['GGGGG', 'GWWWG', 'GWGWG', 'GWWWG', 'GGGGG', '..k..', '..k..', '..k..', '..k..', '..k..', '..k..', '.kkk.'];

// Desenha em todo <svg class="cena"> da página (o site e o gráfico da Play Store usam este arquivo).
for (const svg of document.querySelectorAll('svg.cena')) {

  const rect = (parent, x, y, w, h, fill) => {
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h);
    r.setAttribute('fill', fill);
    parent.appendChild(r);
  };
  const group = (className) => {
    const g = document.createElementNS(NS, 'g');
    if (className) g.setAttribute('class', className);
    svg.appendChild(g);
    return g;
  };
  const sprite = (parent, rows, x, y) => {
    rows.forEach((row, j) => [...row].forEach((ch, i) => {
      if (ch !== '.' && PX[ch]) rect(parent, x + i, y + j, 1, 1, PX[ch]);
    }));
  };

  const base = group();
  rect(base, 0, 0, 96, 64, '#E7F0FF'); // céu
  sprite(base, SUN, 74, 6);

  // Nuvens andando devagar.
  const clouds = group('drift');
  sprite(clouds, CLOUD, 4, 10);
  sprite(clouds, CLOUD, 46, 4);

  // Prédios: [x, largura, altura, cor]. As janelas são pontinhos claros num padrão regular.
  const city = group();
  const buildings = [
    [0, 12, 26, '#9FDDBA'], [11, 9, 34, '#7FC9A2'], [20, 14, 22, '#C8F0D6'], [33, 10, 38, '#2F6B57'],
    [43, 13, 28, '#9FDDBA'], [56, 9, 20, '#7FC9A2'], [64, 15, 32, '#C8F0D6'], [79, 9, 24, '#2F6B57'], [87, 9, 30, '#9FDDBA'],
  ];
  const ground = 46;
  for (const [x, w, h, color] of buildings) {
    rect(city, x, ground - h, w, h, color);
    const dark = color === '#2F6B57';
    for (let yy = ground - h + 3; yy < ground - 3; yy += 4) {
      for (let xx = x + 2; xx < x + w - 2; xx += 3) rect(city, xx, yy, 1, 2, dark ? '#FFE08A' : '#FFFFFF');
    }
  }

  // Calçada, rua e faixa.
  rect(city, 0, ground, 96, 3, '#DDEEE4');
  rect(city, 0, ground + 3, 96, 15, '#3D5F53');
  for (let x = 2; x < 96; x += 10) rect(city, x, ground + 10, 5, 1, '#C8F0D6');
  sprite(city, STOP, 60, ground - 11);

  // O ônibus, andando "em saltos" de 1 pixel (classe .drive no CSS).
  const bus = group('drive');
  sprite(bus, BUS, 0, ground);
}
