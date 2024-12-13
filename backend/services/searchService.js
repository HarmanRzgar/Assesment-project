const fs = require('fs');
const path = require('path');
const elasticClient = require('../config/database');

const searchService = {
  searchPdfs: async (query) => {
    try {
      // First, clean up any stale entries
      const cleanupResult = await elasticClient.search({
        index: "pdfs",
        size: 1000,
        body: {
          query: {
            match_all: {}
          }
        }
      });

      // Delete entries for files that no longer exist
      for (const hit of cleanupResult.hits.hits) {
        const filePath = path.join(__dirname, '..', 'uploads', hit._source.filepath);
        if (!fs.existsSync(filePath)) {
          await elasticClient.delete({
            index: 'pdfs',
            id: hit._id
          });
        }
      }

      // Perform the actual search
      const result = await elasticClient.search({
        index: "pdfs",
        body: {
          query: {
            match: {
              content: query,
            },
          },
          highlight: {
            fields: {
              content: {},
            },
          },
        },
      });

      // Validate results against filesystem
      const validResults = [];
      for (const hit of result.hits.hits) {
        const filePath = path.join(__dirname, '..', 'uploads', hit._source.filepath);
        if (fs.existsSync(filePath)) {
          validResults.push({
            filename: hit._source.filename,
            filepath: hit._source.filepath,
            highlights: hit.highlight.content,
            score: hit._score,
          });
        }
      }

      return validResults;
    } catch (error) {
      throw new Error('Search failed: ' + error.message);
    }
  }
};

module.exports = searchService;