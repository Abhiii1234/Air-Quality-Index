import React, { useState } from 'react';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import AqiCard from './components/AqiCard';
import { CloudFog } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
    const [aqiData, setAqiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (city) => {
        setLoading(true);
        setError(null);
        setAqiData(null);

        try {
            // Use environment variable for production, fallback to localhost for development
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.get(`${API_URL}/api/search`, {
                params: { city }
            });
            setAqiData(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch AQI data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        className="flex justify-center mb-6"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                    >
                        <motion.div
                            className="p-4 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 animate-pulse-glow"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            <CloudFog className="w-16 h-16 text-white" />
                        </motion.div>
                    </motion.div>
                    <motion.h1
                        className="text-5xl font-black text-white tracking-tight sm:text-6xl mb-3 drop-shadow-lg"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Air Quality Index
                    </motion.h1>
                    <motion.p
                        className="text-xl text-white/90 font-medium drop-shadow-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Real-time air quality monitoring worldwide
                    </motion.p>
                    <motion.div
                        className="mt-4 flex justify-center gap-4 text-sm text-white/80 flex-wrap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        {['🌍 Global Coverage', '⚡ Real-time Data', '📊 6 Parameters'].map((badge, index) => (
                            <motion.span
                                key={badge}
                                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all cursor-default"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                                whileHover={{ scale: 1.1, y: -5 }}
                            >
                                {badge}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>

                <SearchBox onSearch={handleSearch} />

                {loading && (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <CloudFog className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="mt-4 text-white font-medium">Fetching air quality data...</p>
                    </div>
                )}

                {error && (
                    <div className="mt-8 p-6 bg-red-500/20 backdrop-blur-lg border-l-4 border-red-500 rounded-r-2xl max-w-md mx-auto shadow-xl">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-white font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-10">
                    <AqiCard data={aqiData} />
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-white/60 text-sm">
                    <p>
                        Built with <span className="text-red-500 animate-pulse">❤</span> by{' '}
                        <a
                            href="https://www.linkedin.com/in/abhigyan-pushkar-778420266/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-semibold hover:text-purple-300 transition-colors duration-200 underline decoration-purple-400"
                        >
                            ABHIGYAN PUSHKAR
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
