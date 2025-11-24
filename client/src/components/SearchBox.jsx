import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const SearchBox = ({ onSearch }) => {
    const [city, setCity] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const debounceTimer = useRef(null);

    const popularCities = [
        { name: 'London', country: 'United Kingdom', emoji: '🇬🇧', fullName: 'London, United Kingdom' },
        { name: 'New York', country: 'United States', emoji: '🇺🇸', fullName: 'New York, United States' },
        { name: 'Tokyo', country: 'Japan', emoji: '🇯🇵', fullName: 'Tokyo, Japan' },
        { name: 'Paris', country: 'France', emoji: '🇫🇷', fullName: 'Paris, France' },
        { name: 'Dubai', country: 'UAE', emoji: '🇦🇪', fullName: 'Dubai, UAE' },
        { name: 'Singapore', country: 'Singapore', emoji: '🇸🇬', fullName: 'Singapore, Singapore' },
        { name: 'Mumbai', country: 'India', emoji: '🇮🇳', fullName: 'Mumbai, India' },
        { name: 'Sydney', country: 'Australia', emoji: '🇦🇺', fullName: 'Sydney, Australia' },
        { name: 'Berlin', country: 'Germany', emoji: '🇩🇪', fullName: 'Berlin, Germany' },
        { name: 'Toronto', country: 'Canada', emoji: '🇨🇦', fullName: 'Toronto, Canada' }
    ];

    const getCountryFlag = (countryCode) => {
        if (!countryCode || countryCode.length !== 2) return '🌍';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchCitySuggestions = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setSuggestions(popularCities);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: {
                    name: searchTerm,
                    count: 15,
                    language: 'en',
                    format: 'json'
                }
            });

            if (response.data && response.data.results) {
                const cities = response.data.results.map(result => ({
                    name: result.name,
                    country: result.country || 'Unknown',
                    emoji: getCountryFlag(result.country_code),
                    admin1: result.admin1 || '',
                    latitude: result.latitude,
                    longitude: result.longitude,
                    fullName: `${result.name}${result.admin1 && result.admin1 !== result.name ? ', ' + result.admin1 : ''}, ${result.country}`
                }));
                setSuggestions(cities);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
            setSuggestions(popularCities.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city);
            setShowDropdown(false);
        }
    };

    const handleCitySelect = (cityItem) => {
        const searchQuery = cityItem.fullName || cityItem.name;
        setCity(searchQuery);
        onSearch(searchQuery);
        setShowDropdown(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setCity(value);
        setShowDropdown(true);
        setSelectedIndex(-1);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchCitySuggestions(value);
        }, 300);
    };

    const handleInputFocus = () => {
        setShowDropdown(true);
        if (suggestions.length === 0) {
            setSuggestions(popularCities);
        }
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleCitySelect(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            ref={dropdownRef}
        >
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500 animate-gradient"></div>

                <div className="relative flex items-center bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" style={{ padding: '2px' }}>
                        <div className="w-full h-full bg-white rounded-3xl"></div>
                    </div>

                    <div className="relative z-10 pl-6 flex items-center gap-2">
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Loader2 className="text-purple-500 w-6 h-6" />
                            </motion.div>
                        ) : (
                            <>
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                >
                                    <Search className="text-purple-500 w-6 h-6 drop-shadow-lg" />
                                </motion.div>
                                <motion.div
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                                >
                                    <Sparkles className="text-pink-400 w-4 h-4" />
                                </motion.div>
                            </>
                        )}
                    </div>

                    <input
                        type="text"
                        value={city}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onKeyDown={handleKeyDown}
                        placeholder="Search any city worldwide... ✨"
                        className="relative z-10 flex-1 py-5 px-4 text-gray-700 bg-transparent focus:outline-none placeholder-gray-400 font-medium text-lg"
                        autoComplete="off"
                    />

                    <motion.button
                        type="submit"
                        className="relative z-10 mr-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl font-bold text-sm overflow-hidden group/btn shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>

                        <span className="relative z-10 flex items-center gap-2">
                            <span>Search</span>
                            <motion.span
                                animate={{ x: [0, 3, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                →
                            </motion.span>
                        </span>

                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                            initial={{ x: '100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        ></motion.div>
                    </motion.button>
                </div>

                <AnimatePresence>
                    {showDropdown && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-200/50 overflow-hidden z-50"
                        >
                            <div className="p-2 max-h-96 overflow-y-auto dropdown-scroll">
                                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <MapPin className="w-3 h-3" />
                                    {city.trim() ? `Found ${suggestions.length} cities` : 'Popular Cities'}
                                </div>
                                {suggestions.map((cityItem, index) => (
                                    <motion.div
                                        key={`${cityItem.fullName}-${index}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        onClick={() => handleCitySelect(cityItem)}
                                        className={`px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 ${selectedIndex === index
                                                ? 'bg-gradient-to-r from-purple-100 to-pink-100 scale-[1.02]'
                                                : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                                            }`}
                                    >
                                        <span className="text-2xl">{cityItem.emoji}</span>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-800">
                                                {cityItem.name}
                                                {cityItem.admin1 && cityItem.admin1 !== cityItem.name && (
                                                    <span className="text-xs text-gray-500 ml-1">({cityItem.admin1})</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">{cityItem.country}</div>
                                        </div>
                                        <motion.div
                                            className="text-purple-500"
                                            whileHover={{ x: 3 }}
                                        >
                                            →
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    className="absolute -top-2 left-1/4 w-2 h-2 bg-purple-400 rounded-full blur-sm"
                    animate={{
                        y: [-10, -20, -10],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 3, delay: 0 }}
                ></motion.div>
                <motion.div
                    className="absolute -top-2 right-1/3 w-2 h-2 bg-pink-400 rounded-full blur-sm"
                    animate={{
                        y: [-10, -25, -10],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                ></motion.div>
                <motion.div
                    className="absolute -top-2 right-1/4 w-2 h-2 bg-blue-400 rounded-full blur-sm"
                    animate={{
                        y: [-10, -20, -10],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 3, delay: 2 }}
                ></motion.div>
            </div>
        </motion.form>
    );
};

export default SearchBox;
