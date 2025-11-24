import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Activity, Thermometer } from 'lucide-react';

const getAqiColor = (aqi) => {
    if (aqi <= 50) return 'bg-gradient-to-br from-green-400 to-green-600';
    if (aqi <= 100) return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
    if (aqi <= 150) return 'bg-gradient-to-br from-orange-400 to-orange-600';
    if (aqi <= 200) return 'bg-gradient-to-br from-red-400 to-red-600';
    if (aqi <= 300) return 'bg-gradient-to-br from-purple-400 to-purple-600';
    return 'bg-gradient-to-br from-red-700 to-red-900';
};

const getAqiStatus = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
};

const parameterVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            type: "spring",
            stiffness: 100
        }
    })
};

const AqiCard = ({ data }) => {
    if (!data) return null;

    const { aqi, city, iaqi } = data;
    const colorClass = getAqiColor(aqi);
    const status = getAqiStatus(aqi);

    const parameters = [
        { icon: Wind, label: 'PM2.5', value: iaqi.pm25, unit: 'µg/m³', gradient: 'from-blue-500 to-blue-600', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200/50' },
        { icon: Activity, label: 'PM10', value: iaqi.pm10, unit: 'µg/m³', gradient: 'from-orange-500 to-orange-600', bg: 'from-orange-50 to-orange-100', border: 'border-orange-200/50' },
        { icon: Wind, label: 'O₃', value: iaqi.o3, unit: 'µg/m³', gradient: 'from-purple-500 to-purple-600', bg: 'from-purple-50 to-purple-100', border: 'border-purple-200/50' },
        { icon: Activity, label: 'NO₂', value: iaqi.no2, unit: 'µg/m³', gradient: 'from-red-500 to-red-600', bg: 'from-red-50 to-red-100', border: 'border-red-200/50' },
        { icon: Droplets, label: 'CO', value: iaqi.co, unit: 'µg/m³', gradient: 'from-cyan-500 to-cyan-600', bg: 'from-cyan-50 to-cyan-100', border: 'border-cyan-200/50', decimals: 0 },
        { icon: Thermometer, label: 'Temperature', value: iaqi.t, unit: '°C', gradient: 'from-green-500 to-green-600', bg: 'from-green-50 to-green-100', border: 'border-green-200/50' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden max-w-3xl mx-auto border border-white/20 hover:shadow-purple-500/20 hover:shadow-3xl transition-all duration-500"
        >
            <motion.div
                className={`${colorClass} animate-gradient p-10 text-white text-center transition-all duration-500 relative overflow-hidden`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {/* Animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <motion.div
                    className="absolute inset-0 animate-shimmer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                ></motion.div>

                <div className="relative z-10">
                    <motion.h2
                        className="text-4xl font-black mb-3 drop-shadow-lg"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        {city.name}
                    </motion.h2>
                    <motion.div
                        className="text-7xl font-black mb-3 drop-shadow-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    >
                        {aqi}
                    </motion.div>
                    <motion.div
                        className="text-2xl font-bold tracking-wide uppercase drop-shadow-md"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {status}
                    </motion.div>
                    <motion.div
                        className="mt-5 text-sm opacity-90 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.9 }}
                        transition={{ delay: 0.6 }}
                    >
                        Last Updated: {new Date(data.time.s).toLocaleString()}
                    </motion.div>
                </div>
            </motion.div>

            <div className="p-10">
                <motion.h3
                    className="text-gray-600 uppercase text-sm font-black tracking-wider mb-8 flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <motion.div
                        className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"
                        animate={{ scaleY: [0, 1] }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    ></motion.div>
                    Air Quality Parameters
                </motion.h3>
                <div className="grid grid-cols-3 gap-6">
                    {parameters.map((param, index) => (
                        <motion.div
                            key={param.label}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={parameterVariants}
                            whileHover={{
                                scale: 1.08,
                                y: -8,
                                rotate: [0, -1, 1, 0],
                                transition: { duration: 0.3 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex flex-col items-center p-5 bg-gradient-to-br ${param.bg} rounded-2xl shadow-lg border ${param.border} transition-all duration-300 cursor-pointer group relative overflow-hidden`}
                        >
                            {/* Hover shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                            <motion.div
                                className={`p-4 bg-gradient-to-br ${param.gradient} text-white rounded-xl shadow-lg mb-3 relative z-10`}
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <param.icon className="w-7 h-7" />
                            </motion.div>
                            <div className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1 relative z-10">{param.label}</div>
                            <motion.div
                                className="text-2xl font-black text-gray-800 relative z-10"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                            >
                                {param.value && param.value.v != null ? param.value.v.toFixed(param.decimals || 1) : 'N/A'}
                            </motion.div>
                            <div className="text-xs text-gray-500 font-medium relative z-10">{param.unit}</div>
                        </motion.div>
                    ))}
                </div>

                {data.source === 'cache' && (
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                            <motion.span
                                className="w-2 h-2 bg-purple-500 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            ></motion.span>
                            Cached data for faster performance
                        </span>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default AqiCard;
