const fs = require('fs');
const path = require('path');
const elasticClient = require('../config/database');

const ELASTIC_INDEX = process.env.ELASTIC_INDEX  // You can change this to whatever you want

const searchService = {
  searchPdfs: async (query) => {
    try {
      // First, clean up any stale entries
      const cleanupResult = await elasticClient.search({
        index: ELASTIC_INDEX,
        size: 1000,
        body: {
          query: {
            match_all: {}
          }
        }
      });

      // // Delete entries for files that no longer exist
      // for (const hit of cleanupResult.hits.hits) {
      //   const filePath = path.join(__dirname, '..', 'uploads', hit._source.filepath);
      //   if (!fs.existsSync(filePath)) {
      //     await elasticClient.delete({
      //       index: 'xap',
      //       id: hit._id
      //     });
      //   }
      // }

      // Perform the actual search
      const result = await elasticClient.search({
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
              pre_tags: ['<strong class="bg-yellow-200">'],  // Custom highlight tags
              post_tags: ['</strong>'],
              fragment_size: 150,        // Length of the highlighted snippet
              number_of_fragments: 3     // Number of snippets to return
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