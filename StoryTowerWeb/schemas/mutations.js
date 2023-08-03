const { StoryCatalog } = require('../models');

const addScrapedDataToCatalog = async ({ scrapedData }) => {
  console.log('GraphQL mutation for adding scraped data to catalog is executed!');
  try {
    for (const data of scrapedData) {
      const existingData = await StoryCatalog.findOne({
        link: data.link,
        provider: data.provider,
      });

      if (!existingData) {
        // Document does not exist, save the data
        await StoryCatalog.create({
          name: data.name,
          link: data.link,
          provider: data.provider,
        });
      } else {
        // Document already exists, skip saving
        console.log(`Data with link: ${data.link} and provider: ${data.provider} already exists.`);
      }
    }

    return true; // Indicate that the data was successfully processed
  } catch (error) {
    console.error('Error saving scraped data to catalog:', error);
    throw new Error('Internal Server Error');
  }
};

module.exports = {
  addScrapedDataToCatalog,
};
