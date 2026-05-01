const express = require('express');
const router = express.Router();
const electionStepsData = require('../data/electionSteps.json');

router.get('/', (req, res, next) => {
  try {
    const { country = 'IN', year = '2024' } = req.query;
    
    // Fallback to IN if country not found
    const countryData = electionStepsData[country] || electionStepsData['IN'];
    
    // We assume 'general' election type for now
    const steps = countryData['general'] || [];

    res.json({ steps });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
