const express = require('express');
const router = express.Router();
const glossaryData = require('../data/glossary.json');

router.get('/', (req, res, next) => {
  try {
    const { search } = req.query;
    
    let terms = glossaryData;

    if (search) {
      const lowerSearch = search.toLowerCase();
      terms = terms.filter(item => 
        item.term.toLowerCase().includes(lowerSearch) || 
        item.definition.toLowerCase().includes(lowerSearch)
      );
    }

    res.json({ terms });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
