// webScraper.js
const puppeteer = require('puppeteer-core');

async function performWebScraping() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();
  await page.goto('https://asura.gg/manga/list-mode');

  // Perform web scraping tasks here...
  const scrapedData = await page.evaluate(() => {
    const manwhaContent = document.querySelectorAll('.soralist a.series');
    const manwhaData = [];

    manwhaContent.forEach((link) => {
      const series = {
        name: link.textContent,
        link: link.href
      }
      manwhaData.push(series);
    })

    return manwhaData;
  });

  await browser.close();

  return scrapedData;
}

module.exports = {
  performWebScraping,
};
