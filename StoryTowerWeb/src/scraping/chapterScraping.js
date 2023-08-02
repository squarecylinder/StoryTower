// chapterScraping.js
const puppeteer = require('puppeteer-core');
const os = require('os');
const { Story, StoryCatalog, Chapter } = require('../../models');

// Fetch only the links from the StoryCatalog collection
const getStoryCatalogInformation = async () => {
  try {
    // Use find() with the select() method to retrieve 'name', 'link', and 'provider' fields
    const storyCatalogInfo = await StoryCatalog.find().select('name link provider');

    // Extract the necessary fields from the result and return them as an array
    const storyCatalogArray = storyCatalogInfo.map((catalog) => ({
      name: catalog.name,
      link: catalog.link,
      provider: catalog.provider,
    }));
    return storyCatalogArray;
  } catch (error) {
    console.error('Error fetching StoryCatalog links:', error);
    throw new Error('Internal Server Error');
  }
};

// Function to fetch the chapter links and images from a given story link
async function getStoryInformation(storyCatalogArray) {
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

  try {
    for (const story of storyCatalogArray) {
      const existingStory = await Story.findOne({ title: story.name });
      if (story.link != "https://asura.gg/manga/0223090894-everyone-regressed-except-me/" && story.link != "https://asura.gg/discord") {
        console.log(`Connecting to ${story.link}`);
        await page.goto(story.link);
        console.log(`Connected to ${story.link}`);
        // Wait for the element to appear on the page (use the appropriate selector)
        await page.waitForSelector('.epcurfirst');

        const coverArtElement = await page.$('.wp-post-image');
        const coverArtSrc = await coverArtElement.evaluate((el) => el.src);

        const synopsisElement = await page.$('.entry-content');
        const synopsisText = await synopsisElement.evaluate((el) => el.textContent.trim());

        const genreElement = await page.$('.mgen');
        let genres = []; // Initialize genres as an empty array

        if (genreElement) {
          const genreLinks = await genreElement.$$('a');
          genres = await Promise.all(
            genreLinks.map(async (link) => {
              const genreText = await link.evaluate((el) => el.textContent);
              return genreText;
            })
          );
        } else {
          console.log('No genres found for this story.');
        }

        const chapterElements = await page.$$('.chbox');
        const firstChapterLinkElement = await chapterElements[chapterElements.length - 1].$('a');
        const firstChapterURL = firstChapterLinkElement ? await page.evaluate(el => el.href, firstChapterLinkElement) : null;
        console.log("First Chapter URL: " + firstChapterURL);

        const lastChapterLinkElement = await chapterElements[0].$('a');
        const lastChapterURL = lastChapterLinkElement ? await page.evaluate(el => el.href, lastChapterLinkElement) : null;
        console.log("Last Chapter URL: " + lastChapterURL);

        let chapterTitleElement = await chapterElements[chapterElements.length - 1].$('.chapternum');
        let chapterTitle = chapterTitleElement ? await page.evaluate(el => el.textContent, chapterTitleElement) : null;
        console.log(chapterTitle)

        const totalChapters = chapterElements.length;

        console.log(`${story.name} exists in the database: ${!!existingStory}`);
        try {
          if (existingStory) {
            if (existingStory.synopsis !== synopsisText) {
              existingStory.synopsis = synopsisText;
              await existingStory.save();
              console.log('Synopsis updated in the database.');
            } else {
              console.log('Synopsis matches the database.');
            }

            if (existingStory.chapters.length === 0) {
              await scrapeChapterData(page, existingStory, chapterTitle, firstChapterURL);
            } else {
              const lastChapterNumber = parseInt(existingStory.chapters[existingStory.chapters.length - 1].title.match(/Chapter (\d+)/)[1], 10);
              for (let i = lastChapterNumber + 1; i <= totalChapters; i++) {
                chapterTitle = `Chapter ${i}`;
                const chapterIndex = i - 1;
                const chapterURL = await page.evaluate(el => el.href, chapterElements[chapterIndex]);
                try {
                  await scrapeChapterData(page, existingStory, chapterTitle, chapterURL);
                } catch (error) {
                  console.error(`Error while scraping chapter ${chapterTitle} for ${story.name}:`, error);
                }
              }
            }
          } else {
            const newStory = new Story({
              title: story.name,
              rating: 0,
              lastUpdated: new Date(),
              chapterCount: totalChapters,
              synopsis: synopsisText,
              genres: genres, // Assuming the story link is the unique identifier
              chapters: [], // An array to store chapter references (you can update this as needed)
              coverArt: coverArtSrc,
            });
            try {
              await newStory.save();
              console.log('Story saved to the database.');
              await scrapeChapterData(page, existingStory, chapterTitle, firstChapterURL);
            } catch (error) {
              console.error('Error while saving new story or scraping chapters:', error);
            }
          }
        } catch (error) {
          console.error('Error while processing story:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error while fetching story links:', error);
  } finally {
    console.log('Completed');
    await browser.close();
  }
}

async function scrapeChapterData(page, existingStory, story, chapterURL) {
  const DELAY_BETWEEN_CHAPTERS = 5000;
  console.log("Starting scrape chapter");
  try {
    while (chapterURL) {
      console.log("In the While Loop");
      try {
        let currentURL = await page.url();
        console.log(`Navigating to ${chapterURL} from ${currentURL}`);
        // Navigate to the chapter page using the provided URL
        await page.goto(chapterURL, { timeout: 60000 });
        currentURL = await page.url()
        console.log(`Current URL is now: ${currentURL}`);

        // Step 1: Get the chapter content element
        const chapterContentElement = await page.$('#readerarea');
        const chapterTitleElement = await page.$('.entry-title');
        let chapterTitle = await chapterTitleElement.evaluate((el) => el.innerText.trim());
        chapterTitle = chapterTitle.replace(story.name, '').trim();

        // Extract the chapter number from the selected option value (if needed)
        // Step 2: Extract the image URLs
        const imageElements = await chapterContentElement.$$('img');
        const imageUrls = await Promise.all(
          imageElements.map(async (element) => {
            const imageUrl = await element.evaluate((el) => el.src);
            return imageUrl;
          })
        );

        // Step 3: Save the images to the database
        const newChapter = new Chapter({
          title: chapterTitle, // Use the extracted chapter title
          images: imageUrls, // Save the image URLs as an array of strings
          story: existingStory._id
        });

        await newChapter.save();
        console.log("Should save a new chapter?")
        // Step 4: Associate the chapter with the story
        existingStory.chapters.push(newChapter);
        await existingStory.save();
        console.log("Should save to a story")

        try {
          // Click the "Next" button to navigate to the next chapter page
          await page.goto(chapterURL); // Re-visit the chapter page URL to navigate to the next chapter
        } catch (error) {
          console.error(`Error while navigating to the next chapter page for ${story.name}`, error);
          break; // Exit the loop if there's an error in navigation
        }
        // Check if the "Next" button is disabled (indicating no more chapters)
        const nextButton = await page.$('.ch-next-btn');
        const isNextButtonDisabled = await nextButton.evaluate((btn) => btn.classList.contains('disabled'));
        console.log(`Next button???? ${nextButton}`);
        if (isNextButtonDisabled) {
          console.log(`No more chapters to scrape for ${story.name}`);
          break;
        } else {
          chapterURL = await page.evaluate(el => el.href, nextButton);
          await page.waitForTimeout(DELAY_BETWEEN_CHAPTERS)
        }
      } catch (error) {
        console.error(`Error while scraping chapter for ${story.name}`, error);
      }
    }
  } catch (error) {
    console.error('Error while scraping chapters:', error);
  }
}



// Call the function to get the links
getStoryCatalogInformation()
  .then((storyCatalogArray) => {
    getStoryInformation(storyCatalogArray);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
