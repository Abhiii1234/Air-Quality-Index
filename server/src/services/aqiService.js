const axios = require('axios');
const NodeCache = require('node-cache');

// Cache for 1 hour
const aqiCache = new NodeCache({ stdTTL: 3600 });

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const AQI_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const getAqiByCity = async (city) => {
    const normalizedCity = city.toLowerCase().trim();

    // Check cache
    const cachedData = aqiCache.get(normalizedCity);
    if (cachedData) {
        console.log(`✅ Serving from cache for: ${city}`);
        return { ...cachedData, source: 'cache' };
    }

    try {
        // Extract just the city name if full location string is provided
        // Handles formats like:
        // "Ahmedabad, Gujarat, India" -> "Ahmedabad"
        // "Ahmedabad (Gujarat), India" -> "Ahmedabad"
        // "Ahmedabad" -> "Ahmedabad"
        let cityName = city.split(',')[0].trim();
        cityName = cityName.split('(')[0].trim(); // Remove parentheses

        console.log(`🔍 Searching for city: "${cityName}" (original input: "${city}")`);

        // Step 1: Geocode the city
        const geoResponse = await axios.get(GEOCODING_API_URL, {
            params: {
                name: cityName,
                count: 1,
                language: 'en',
                format: 'json'
            }
        });

        console.log(`📍 Geocoding response for "${cityName}":`, geoResponse.data.results ? `Found ${geoResponse.data.results.length} results` : 'No results');

        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            console.error(`❌ City not found: "${cityName}"`);
            throw new Error('City not found');
        }

        const location = geoResponse.data.results[0];
        const { latitude, longitude, name, country } = location;

        console.log(`✅ Found location: ${name}, ${country} (${latitude}, ${longitude})`);

        // Step 2: Fetch AQI data
        const aqiResponse = await axios.get(AQI_API_URL, {
            params: {
                latitude,
                longitude,
                current: 'us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide,carbon_monoxide'
            }
        });

        console.log(`🌫️  AQI data fetched for ${name}`);

        // Step 3: Fetch temperature from weather API
        const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude,
                longitude,
                current: 'temperature_2m'
            }
        });

        const current = aqiResponse.data.current;
        const temperature = weatherResponse.data.current.temperature_2m;

        console.log(`🌡️  Temperature: ${temperature}°C`);

        // Map to structure expected by frontend
        const mappedData = {
            aqi: current.us_aqi,
            city: {
                name: `${name}, ${country}`
            },
            iaqi: {
                pm25: { v: current.pm2_5 },
                pm10: { v: current.pm10 },
                o3: { v: current.ozone },
                no2: { v: current.nitrogen_dioxide },
                co: { v: current.carbon_monoxide },
                t: { v: temperature }
            },
            time: {
                s: new Date().toISOString()
            }
        };

        // Store in cache
        aqiCache.set(normalizedCity, mappedData);

        console.log(`✅ Successfully fetched AQI data for ${city}`);

        return { ...mappedData, source: 'api' };

    } catch (error) {
        console.error(`❌ Error fetching AQI data for "${city}":`, error.message);
        if (error.response) {
            console.error('API Error Response:', error.response.data);
        }
        if (error.message === 'City not found') {
            throw error;
        }
        throw new Error('Failed to fetch AQI data');
    }
};

module.exports = {
    getAqiByCity
};
