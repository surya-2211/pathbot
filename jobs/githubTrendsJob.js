const axios = require('axios');
const cheerio = require('cheerio');
const Trend = require('../models/Trend');

async function fetchGitHubTrending() {
  try {
    const res = await axios.get('https://github.com/trending');
    const $ = cheerio.load(res.data);

    const trends = [];

    $('article.Box-row').each((i, el) => {
      const repo = $(el).find('h2 > a').text().trim().replace(/\s/g, '');
      const url = 'https://github.com' + $(el).find('h2 > a').attr('href');
      const language = $(el).find('[itemprop=programmingLanguage]').text().trim();
      const stars = parseInt($(el).find('.Link--muted.d-inline-block.mr-3').first().text().replace(',', '')) || 0;

      trends.push({
        tech: repo,
        source: 'GitHub',
        stars,
        url,
        language: language || 'Unknown'
      });
    });

    await Trend.deleteMany({ source: 'GitHub' }); // optional: clear old
    await Trend.insertMany(trends);
    console.log(`[✓] GitHub Trends saved: ${trends.length} items`);
  } catch (err) {
    console.error('[X] GitHub trend fetch failed:', err.message);
  }
}

module.exports = fetchGitHubTrending;
