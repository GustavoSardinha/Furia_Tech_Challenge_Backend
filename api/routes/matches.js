import express from 'express';
import fetch from 'node-fetch';
import { load } from 'cheerio';

const router = express.Router();

async function obterPagina(pagina) {
  const apiUrl = `https://liquipedia.net/counterstrike/api.php?action=parse&page=${encodeURIComponent(pagina)}&format=json`;
  const resposta = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'FuriaChatbot/1.0 (http://meusite.com; gustavosardinha643@gmail.com)',
      'Accept-Encoding': 'gzip',
      'Referer': 'https://liquipedia.net',
      'Origin': 'https://liquipedia.net'
    }
  });
  if (!resposta.ok) throw new Error(`Erro ao buscar página: ${resposta.status} ${resposta.statusText}`);

  const dados = await resposta.json();
  if (dados.error) throw new Error(dados.error.info || 'Erro desconhecido');
  if (!dados.parse?.text?.['*']) throw new Error('Conteúdo da página não encontrado');

  return dados.parse.text['*'];
}

function extrairResultados(html) {
  const $ = load(html);
  const resultados = [];

  $('div.table-responsive.recent-matches table.wikitable tbody tr').each((_, row) => {
    const cols = $(row).find('td');
    if (cols.length < 9) return;

    const date = $(cols[0]).text().trim();
    const tier = $(cols[2]).text().trim();
    const score = $(cols[7]).text().trim().replace(/\s+/g, ' ');
    const tournament = $(cols[6]).text().trim();

    const opponentCell = $(cols[8]);
    const opponent = opponentCell.find('a').last().text().trim();
  
    resultados.push({ date, tier, tournament, opponent, score });
  });

  return resultados;
}


function extrairUpcoming(html) {
  const $ = load(html);
  const upcoming = [];
  $('table.infobox_matches_content').each((_, table) => {
    const $table = $(table);
    // Nome e imagem do torneio na primeira linha
    const versusTd = $table.find('tr').first().find('td.versus');
    const tournamentName = versusTd.find('a').last().text().trim();
    let tournamentImage = versusTd.find('img').first().attr('src') || '';
    if (tournamentImage.startsWith('/')) tournamentImage = `https://liquipedia.net${tournamentImage}`;
    const matchFillerTd = $table.find('tr').eq(1).find('td.match-filler');
    const timer = matchFillerTd.find('.timer-object-countdown-only');
    const date = timer.text().trim();
    const timeLeft = timer.attr('data-countdown-end-text') || '';
    upcoming.push({ tournamentName, tournamentImage, date, timeLeft });
  });
  return upcoming;
}


router.get('/', async (req, res) => {
  const pagina = (req.query.page || 'FURIA').trim();
  try {
    const html = await obterPagina(pagina);
    const results = extrairResultados(html);
    const upcoming = extrairUpcoming(html);
    res.json({ page: pagina, results, upcoming });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;