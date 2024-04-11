// chapterScraping.js
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require("puppeteer");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(
  AdblockerPlugin({
    // Optionally enable Cooperative Mode for several request interceptors
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
  })
);

const { Story, StoryCatalog, Chapter } = require("../../models");

async function performAsuraChapterScraping() {
  // Fetch only the links from the StoryCatalog collection
  const getStoryCatalogInformation = async () => {
    try {
      // Use find() with the select() method to retrieve 'name', 'link', and 'provider' fields
      const storyCatalogInfo = await StoryCatalog.find(
        {name: "Death Is the Only Ending for the Villainess"}
      ).select("name link provider");

      // Extract the necessary fields from the result and return them as an array
      const storyCatalogArray = storyCatalogInfo.map((catalog) => ({
        name: catalog.name,
        link: catalog.link,
        provider: catalog.provider,
      }));
      return storyCatalogArray;
    } catch (error) {
      console.error("Error fetching StoryCatalog links:", error);
      throw new Error("Internal Server Error");
    }
  };

  // Function to fetch the chapter links and images from a given story link
  async function getStoryInformation(storyCatalogArray) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      for (const story of storyCatalogArray) {
        const existingStory = await Story.findOne({ title: story.name });
        if (
          story.name != "(AD) Everyone Regressed Except Me" &&
          !story.name.includes("discord") &&
          !story.link.includes(".gg") &&
          story.name != "Nano Machine" &&
          story.name != "The Greatest Sword Hero Returns After 69420 Years"
        ) {
          await page.goto(story.link);
          // Wait for the element to appear on the page (use the appropriate selector)
          await page.waitForSelector(".epcurfirst");

          const coverArtElement = await page.$(".wp-post-image");
          const coverArtSrc = await coverArtElement.evaluate((el) => el.src);

          const synopsisElement = await page.$(".entry-content");
          const synopsisText = await synopsisElement.evaluate((el) =>
            el.textContent
              .split("var ")[0]
              .split("Ads by")[0]
              .split("iframe")[0]
              .trim()
          );

          const genreElement = await page.$(".mgen");
          let genres = []; // Initialize genres as an empty array

          if (genreElement) {
            const genreLinks = await genreElement.$$("a");
            genres = await Promise.all(
              genreLinks.map(async (link) => {
                const genreText = await link.evaluate((el) => el.textContent);
                return genreText;
              })
            );
          } else {
            console.log("No genres found for this story.");
          }

          const chapterElements = await page.$$(".chbox");
          const firstChapterLinkElement = await chapterElements[
            chapterElements.length - 1
          ].$("a");
          const firstChapterURL = firstChapterLinkElement
            ? await page.evaluate((el) => el.href, firstChapterLinkElement)
            : null;

          const totalChapters = chapterElements.length;

          try {
            if (existingStory) {
              if (existingStory.synopsis !== synopsisText) {
                existingStory.synopsis = synopsisText;
                await existingStory.save();
                console.log(`Updating Synopsis for ${existingStory.title}`);
              }

              if (existingStory.coverArt !== coverArtSrc) {
                existingStory.coverArt = coverArtSrc;
                await existingStory.save();
                console.log(`Updating Cover art for ${existingStory.title}`);
              }

              if (
                existingStory.chapters.length !== existingStory.chapterCount
              ) {
                existingStory.chapterCount = existingStory.chapters.length;
                await existingStory.save();
                console.log(
                  `Updating chapter count for ${existingStory.title}`
                );
              }

              if (existingStory.chapters.length === 0) {
                await scrapeChapterData(page, existingStory, firstChapterURL);
              } else {
                const chapterCount = existingStory.chapters.length;
                console.log(
                  `${existingStory.title}: Total chapters on site ${totalChapters}, Total chapters in DB ${chapterCount}`
                );
                // const chapterDifference = totalChapters - chapterCount;
                const chapterNumElement = await page.$$(".chapternum");
                const chapterDateElement = await page.$$(".chapterdate");
                const monthNames = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ];
                const chapterURLArray = [];
                for (
                  let chapterIndex = chapterElements.length - 1;
                  0 <= chapterIndex;
                  chapterIndex--
                ) {
                  const chapterNum = await chapterNumElement[
                    chapterIndex
                  ].evaluate((el) => el.innerText.trim());
                  const chapterDate = await chapterDateElement[
                    chapterIndex
                  ].evaluate((el) => el.innerText.trim());
                  const formattedChapterDate = new Date(chapterDate);
                  //TODO: rip the chapter number down to just the digits
                  const chapterNumber = chapterNum.split(' ')[1]
                  const chapterTitleToFind = `${story.name} ${chapterNumber}`;
                  // console.log(chapterNumber)
                  let existingChapter = await Chapter.findOne({
                    title: {$regex: new RegExp(`\\b${chapterNumber}\\b`, 'i')},
                    story: existingStory._id
                  });
                  if (!existingChapter) {
                    console.log(
                      `${chapterTitleToFind} does not exist in the database.`
                    );
                    const newChapterLinkElement = await chapterElements[
                      chapterIndex
                    ].$("a");
                    const chapterURL = await page.evaluate(
                      (el) => el.href,
                      newChapterLinkElement
                    );
                    chapterURLArray.push(chapterURL);
                  } else {
                    const uploadedDateString =
                      monthNames[existingChapter.uploaded.getMonth()] +
                      " " +
                      existingChapter.uploaded.getDate() +
                      ", " +
                      existingChapter.uploaded.getFullYear();

                    if (uploadedDateString != chapterDate) {
                      console.log(
                        `Updating ${existingChapter.title}'s uploaded date from ${existingChapter.uploadedDateString} to ${chapterDate}`
                      );
                      await Chapter.updateOne(
                        { _id: existingChapter._id },
                        { uploaded: formattedChapterDate }
                      );
                    }
                  }
                }
                // if (chapterDifference !== 0) {
                //   const chapterIndex = chapterDifference - 1;
                //   const newChapterLinkElement = await chapterElements[
                //     chapterIndex
                //   ].$("a");
                //   const chapterURL = await page.evaluate(
                //     (el) => el.href,
                //     newChapterLinkElement
                //   );
                //   try {
                //     await scrapeChapterData(page, existingStory, chapterURL);
                //   } catch (error) {
                //     console.error(
                //       `Error while scraping chapter ${chapterURL} for ${story.name}:`,
                //       error
                //     );
                //   }
                // }
                if (chapterURLArray.length > 0) {
                  for (let i = 0; i < chapterURLArray.length; i++) {
                    await scrapeChapterData(
                      page,
                      existingStory,
                      chapterURLArray[i],
                      true
                    );
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
                genres: genres,
                chapters: [],
                coverArt: coverArtSrc,
              });
              try {
                await newStory.save();
                console.log(`${newStory.title} saved to the database.`);
                await scrapeChapterData(page, newStory, firstChapterURL);
              } catch (error) {
                console.error(
                  "Error while saving new story or scraping chapters:",
                  error
                );
              }
            }
          } catch (error) {
            console.error("Error while processing story:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error while fetching story links:", error);
    } finally {
      console.log("Completed");
      await browser.close();
    }
  }

  async function scrapeChapterData(
    page,
    existingStory,
    chapterURL,
    fromArray = false
  ) {
    try {
      while (chapterURL) {
        if (chapterURL.includes("discord")) {
          return;
        }
        try {
          console.log(`Chapter URL ${chapterURL}`)
          // Navigate to the chapter page using the provided URL
          await page.goto(chapterURL, { timeout: 60000 });
          // Step 1: Get the chapter content element
          const chapterContentElement = await page.$("#readerarea");
          const chapterTitleElement = await page.$(".entry-title");
          let chapterTitle = await chapterTitleElement.evaluate(
            (el) => el.innerText.trim()
          );
          let chapterExists = await Chapter.findOne({ title: chapterTitle });
          if (!chapterExists) {
            console.log("Chapter does not exist: " + chapterTitle);
            // Extract the chapter number from the selected option value (if needed)
            // Step 2: Extract the image URLs
            const imageElements = await chapterContentElement.$$("img");
            const imageUrls = await Promise.all(
              imageElements.map(async (element) => {
                const imageUrl = await element.evaluate((el) => {
                  return el.src;
                });
                return imageUrl;
              })
            );

            // Step 3: Save the images to the database
            const newChapter = new Chapter({
              title: chapterTitle, // Use the extracted chapter title
              images: imageUrls, // Save the image URLs as an array of strings
              story: existingStory._id,
              uploaded: new Date(),
            });

            await newChapter.save();
            // Step 4: Associate the chapter with the story
            existingStory.chapters.push(newChapter);
            existingStory.lastUpdated = new Date();
            existingStory.chapterCount = existingStory.chapters.length;
            await existingStory.save();
            console.log(`Saved ${chapterTitle} to ${existingStory.title}.`);
          }
          // Check if the "Next" button is disabled (indicating no more chapters)
          const nextButton = await page.$(".ch-next-btn");
          const isNextButtonDisabled = await nextButton.evaluate((btn) =>
            btn.classList.contains("disabled")
          );
          if (isNextButtonDisabled || fromArray) {
            console.log(
              `No more chapters to scrape for ${existingStory.title}`
            );
            break;
          } else {
            chapterURL = await page.evaluate((el) => el.href, nextButton);
          }
        } catch (error) {
          console.error(
            `Error while scraping ${chapterURL} chapter for ${existingStory.title}`,
            error
          );
        }
      }
    } catch (error) {
      console.error(`Error while scraping ${chapterURL} chapters:`, error);
    }
  }
  try {
    const storyCatalogArray = await getStoryCatalogInformation();
    await getStoryInformation(storyCatalogArray);
  } catch (error) {
    console.error("Error performing the chapter scraping:", error);
  }
}

module.exports = { performAsuraChapterScraping };
