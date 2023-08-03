const typeDefs = require('./typeDefs');
const {resolvers, addScrapedDataToCatalog} = require('./resolvers');

module.exports = { typeDefs, resolvers, addScrapedDataToCatalog };