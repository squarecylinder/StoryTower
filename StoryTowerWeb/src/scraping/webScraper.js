// webScraper.js
const puppeteer = require('puppeteer-core');
const os = require('os');

async function performWebScraping() {
  let executablePath;

    // Determine the appropriate executable path based on the current environment
    if (os.platform() === 'darwin') {
      // Mac path
      executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else if (os.platform() === 'win32') {
      // Windows path
      executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    } else {
      throw new Error('Unsupported platform');
    }

  const browser = await puppeteer.launch({
    executablePath: executablePath,
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
        link: link.href,
        provider: "asura"
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
