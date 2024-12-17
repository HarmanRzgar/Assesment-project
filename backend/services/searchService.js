const fs = require('fs');
const path = require('path');
const elasticClient = require('../config/database');

const ELASTIC_INDEX = process.env.ELASTIC_INDEX 


const searchService = {
  searchPdfs: async (query) => {
    try {
      // First, clean up any stale entries
      const cleanupResult = await elasticClient.search({
        index: ELASTIC_INDEX,
        index: ELASTIC_INDEX,
        size: 1000,
        body: {
          query: {
            match_all: {}
          }
        }
      });

    

      // Perform the actual search
      const result = await elasticClient.search({
        index: ELASTIC_INDEX,
        index: ELASTIC_INDEX,
        body: {
          query: {
            match: {
              content: query,
            },
          },
          highlight: {
            fields: {
               content: {
              pre_tags: ['<strong style="background-color:lightblue;" >'],  // Custom highlight tags
              post_tags: ['</strong>'],
              fragment_size: 200,        // Length of the highlighted snippet
              number_of_fragments: 10    // Number of snippets to return
            },
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