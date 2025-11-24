const express = require('express');
const router = express.Router();
const aqiService = require('../services/aqiService');

router.get('/search', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const data = await aqiService.getAqiByCity(city);
        res.json(data);
    } catch (error) {
        // Distinguish between "City not found" (often 404 or specific error from API) and server error
        // The AQICN API might return "Unknown station" which we can map to 404
        if (error.message.includes('Unknown station')) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(500).json({ error: 'Failed to fetch AQI data' });
    }
});

module.exports = router;
