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

// const doesStoryExist = async (storyName) => {
//   const existingStory = await Story.findOne({ title: storyName });
//   return existingStory !== null;
// };

// const isZeroIndexed = async (chapterElements) => {
//   try {
//     const chapterIndices = await Promise.all(
//       chapterElements.map(async (element) => {
//         const chapterNum = await element.evaluate((el) => el.querySelector('.chapternum').innerText);
//         return chapterNum;
//       })
//     );
//     return chapterIndices.includes('Chapter 0');
//   } catch (error) {
//     console.error('Error:', error);
//     return false;
//   }
// }

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
        console.log(`Connecting to ${story.link}`)
        await page.goto(story.link)
        console.log(`Connected to ${story.link}`)
        // Wait for the element to appear on the page (use the appropriate selector)
        await page.waitForSelector('.epcurfirst');

        // // Find the element using the selector
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

        const firstChapterButton = await page.$('.epcurfirst');
        const lastChapterButton = await page.$('.epcurlast');
        const lastChapterText = await page.evaluate((element) => element.textContent, lastChapterButton);
        console.log('Last chapter button text:', lastChapterText);

        const chapterElements = await page.$$('.chbox');
        const isZeroIndex = await isZeroIndexed(chapterElements);

        // console.log('Is Zero Indexed:', isZeroIndex);
        // Calculate the total number of chapters
        const totalChapters = chapterElements.length;

        // console.log(`Total number of chapters: ${totalChapters}`);

        // const storyExists = await doesStoryExist(story.name)
        console.log(`${story.name} exists in the database: ${!!existingStory}`)
        if (existingStory) {
          if (existingStory.synopsis !== synopsisText) {
            existingStory.synopsis = synopsisText;
            await existingStory.save();
            console.log('Synopsis updated in the database.')
          }
          else {
            console.log('Synopsis matches the database.')
          }
          if (existingStory.chapterCount !== totalChapters) {
            await firstChapterButton.click();

            await page.waitForNavigation();

            // Inside the function where you handle clicking on the next chapter button
            // Assuming you already have the page object and have navigated to the chapter page

            // Step 1: Get the chapter content element
            const chapterContentElement = await page.$('#readerarea');
            const selectedOptionValue = await page.$eval('#chapter', (select) => select.value);

            // Extract the chapter number from the selected option value (if needed)
            const chapterNumber = selectedOptionValue.match(/Chapter (\d+)/)[0];
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
              title: chapterNumber, // Replace with the actual title of the chapter
              images: imageUrls, // Save the image URLs as an array of strings
            });

            await newChapter.save();

            // Step 4: Associate the chapter with the story
            existingStory.chapters.push(newChapter);
            await existingStory.save();
          }
        } else {
          const newStory = new Story({
            title: story.name,
            rating: 0,
            lastUpdated: new Date(),
            chapterCount: totalChapters,
            synopsis: synopsisText,
            genres: genres,// Assuming the story link is the unique identifier
            chapters: [], // An array to store chapter references (you can update this as needed)
            coverArt: coverArtSrc
          });

          await newStory.save();
          console.log('Story saved to the database.');
        }

        //   if (firstChapterButton) {
        //     await firstChapterButton.click();
        //     console.log('Clicked on the "First Chapter" link.');
        //     // Wait for navigation to complete
        //     await page.waitForNavigation();

        //     // Check the current URL after navigation
        //     const currentUrl = page.url();
        //     console.log('Current URL after navigation:', currentUrl);
        //   } else {
        //     console.error('Element not found or not visible.');
        //   }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.log('Completed')
    await browser.close();
  }
}


// Call the function to get the links
getStoryCatalogInformation()
  .then((storyCatalogArray) => {
    getStoryInformation(storyCatalogArray)
  })
  .catch((error) => {
    console.error('Error:', error);
  });
