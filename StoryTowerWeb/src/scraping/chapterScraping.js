// chapterScraping.js
const puppeteer = require('puppeteer-core');
const os = require('os');
const { StoryCatalog } = require('../../models');

// Function to fetch the chapter links and images from a given story link
async function getChapterLinksAndImages(storyLink) {
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
  await page.goto(storyLink);

  // Perform web scraping tasks to get chapter links and images here...
  // For example, use page.evaluate() to get the chapter links and images
  // and store them in variables.

  // Example (replace this with your actual scraping logic):
  const chapterLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('.chapter-link');
    return Array.from(links).map((link) => link.href);
  });

  const chapterImages = await page.evaluate(() => {
    const images = document.querySelectorAll('.chapter-image');
    return Array.from(images).map((image) => image.src);
  });

  await browser.close();

  // Return the chapter links and images
  return { chapterLinks, chapterImages };
}

// Function to fetch the story links from the StoryCatalog model
async function getStoryLinksFromCatalog() {
  // Replace this with your logic to fetch story links from the database
  // For example, you can use StoryCatalog.find() to fetch all story links
  const storyLinks = await StoryCatalog.find().select('link');

  return storyLinks;
}

module.exports = {
  getChapterLinksAndImages,
  getStoryLinksFromCatalog,
};
