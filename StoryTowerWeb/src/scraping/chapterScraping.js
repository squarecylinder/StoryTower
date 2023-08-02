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
              await scrapeChapterData(page, existingStory, firstChapterURL);
            } else {

              const lastChapterId = existingStory.chapters[existingStory.chapters.length - 1];
              const lastChapter = await Chapter.findById(lastChapterId)

              const lastChapterNumberOnSite = await page.evaluate(() => {
                const chapterTitleElement = document.querySelector('.chapternum');
                return parseInt(chapterTitleElement.textContent.match(/Chapter (\d+)/)[1], 10);
              });

              // Get the last chapter number from the database chapter call
              const existingLastChapterNumber = parseInt(lastChapter.title.match(/Chapter (\d+)/)[1], 10);

              const chapterDifference = lastChapterNumberOnSite - existingLastChapterNumber;
              if (chapterDifference !== 0) {
                const chapterIndex = chapterDifference - 1;
                const chapterURL = await page.evaluate(el => el.href, chapterElements[chapterIndex]); try {
                  await scrapeChapterData(page, existingStory, chapterURL);
                } catch (error) {
                  console.error(`Error while scraping chapter ${chapterTitle} for ${story.name}:`, error);
                }
              } else console.log(`${existingStory.title} has no new chapters. Last saved chapter ${existingLastChapterNumber}. Last chapter on site ${lastChapterNumberOnSite}.`)
              // if (existingLastChapterNumber < lastChapterNumberOnSite) {
              //   for (let i = existingLastChapterNumber + 1; i <= lastChapterNumberOnSite; i++) {
              //     const chapterIndex = totalChapters - i;
              //     const chapterURL = await page.evaluate(el => el.href, chapterElements[chapterIndex]);
              //     try {
              //       await scrapeChapterData(page, existingStory, chapterURL);
              //     } catch (error) {
              //       console.error(`Error while scraping chapter ${chapterTitle} for ${story.name}:`, error);
              //     }
              //   }
              // }
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
              console.log(`${newStory} saved to the database.`);
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

async function scrapeChapterData(page, existingStory, chapterURL) {
  // const DELAY_BETWEEN_CHAPTERS = 5000;
  try {
    while (chapterURL) {
      try {
        // Navigate to the chapter page using the provided URL
        await page.goto(chapterURL, { timeout: 60000 });

        // Step 1: Get the chapter content element
        const chapterContentElement = await page.$('#readerarea');
        const chapterTitleElement = await page.$('.entry-title');
        let chapterTitle = await chapterTitleElement.evaluate((el) => el.innerText.trim());

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
        // Step 4: Associate the chapter with the story
        existingStory.chapters.push(newChapter);
        await existingStory.save();
        console.log(`Saved ${chapterTitle} to ${existingStory.title}.`)

        try {
          // Click the "Next" button to navigate to the next chapter page
          await page.goto(chapterURL); // Re-visit the chapter page URL to navigate to the next chapter
        } catch (error) {
          console.error(`Error while navigating to the next chapter page for ${existingStory.title}`, error);
          break; // Exit the loop if there's an error in navigation
        }
        // Check if the "Next" button is disabled (indicating no more chapters)
        const nextButton = await page.$('.ch-next-btn');
        const isNextButtonDisabled = await nextButton.evaluate((btn) => btn.classList.contains('disabled'));
        console.log(`Next button???? ${nextButton}`);
        if (isNextButtonDisabled) {
          console.log(`No more chapters to scrape for ${existingStory.title}`);
          break;
        } else {
          chapterURL = await page.evaluate(el => el.href, nextButton);
          // await page.waitForTimeout(DELAY_BETWEEN_CHAPTERS)
        }
      } catch (error) {
        console.error(`Error while scraping chapter for ${existingStory.title}`, error);
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
