// webScraper.js
const puppeteer = require('puppeteer-core');
const {executablePath} = require('./executablePath')

async function performAsuraCatalogScraping() {
  console.log('Checking Asura catalog...');
  const browser = await puppeteer.launch({ executablePath: executablePath});
  const page = await browser.newPage();
  await page.goto('https://asuracomics.gg/manga/list-mode');

  // Perform web scraping tasks here...
  const scrapedData = await page.evaluate(() => {
    const manwhaContent = document.querySelectorAll('.soralist a.series');
    const manwhaData = [];

    manwhaContent.forEach((link) => {
      if(!link.textContent.includes('Discord') && !link.textContent.includes('69420')){
        const series = {
          name: link.textContent,
          link: link.href,
          provider: "asura"
        }
        manwhaData.push(series);
      }
    })
    return manwhaData;
  });

  await browser.close();
  return scrapedData;
}

module.exports = {
  performAsuraCatalogScraping,
};
