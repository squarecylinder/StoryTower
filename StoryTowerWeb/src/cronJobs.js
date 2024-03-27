const cron = require('node-cron');
const { performAsuraCatalogScraping } = require('./scraping/asuraCatalogScraper');
const { performAsuraChapterScraping } = require('./scraping/asuraChapterScraper');
const { addScrapedDataToCatalog } = require('../schemas/mutations'); // Import the resolver function for saving scraped data to the catalog
console.log('Cron job is scheduled to run every 12AM/PM.')
// Set up the cron job to run every 12 hours
async function cronJob(){
// cron.schedule('0 */12 * * *', async () => {
    console.log('Starting cron job...');
    try {
        const asuraScrapingData = await performAsuraCatalogScraping();
        // Call the mutation resolver to save the scraped data into the StoryCatalog model
        await addScrapedDataToCatalog({ scrapedData: asuraScrapingData });

        await performAsuraChapterScraping();
        // You can process and save the chapter scraping data here, if needed

        console.log('Asura catalog scraping and chapter scraping executed successfully.');
    } catch (error) {
        console.error('Error executing Asura catalog scraping and chapter scraping:', error);
    } finally {
        console.log('Completed cron job!');
    }
// }
// );
}

module.exports = cronJob