const searchService = require('../services/searchService');

const searchController = {
  search: async (req, res, next) => {
    try {
      const { query } = req.query;
      const results = await searchService.searchPdfs(query);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = searchController;