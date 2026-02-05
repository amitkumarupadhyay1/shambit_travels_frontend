'use client';

import { useState, useEffect } from 'react';
import { CloudSun, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';

interface WeatherData {
    temp: number;
    condition: string;
    city: string;
}

const TopBar = () => {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<string>('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    const getWeatherCondition = (code: number): string => {
        if (code === 0) return 'Clear Sky';
        if (code >= 1 && code <= 3) return 'Partly Cloudy';
        if (code >= 45 && code <= 48) return 'Foggy';
        if (code >= 51 && code <= 55) return 'Drizzle';
        if (code >= 61 && code <= 67) return 'Rain';
        if (code >= 71 && code <= 77) return 'Snow';
        if (code >= 80 && code <= 82) return 'Showers';
        if (code >= 95 && code <= 99) return 'Thunderstorm';
        return 'Clear';
    };

    useEffect(() => {
        // 1. Clock Logic
        const updateDateTime = () => {
            const now = new Date();

            const time = new Intl.DateTimeFormat('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            }).format(now);

            const date = new Intl.DateTimeFormat('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                timeZone: 'Asia/Kolkata'
            }).format(now);

            setCurrentTime(time);
            setCurrentDate(date);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);

        // 2. Location & Weather Logic (GPS First)
        const fetchWeather = async (lat: number, lon: number, cityName?: string) => {
            try {
                let resolvedCity = cityName;

                // If we only have coordinates (from GPS), reverse geocode to get city name
                if (!resolvedCity) {
                    try {
                        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                        const geoData = await geoRes.json();
                        resolvedCity = geoData.city || geoData.locality || 'Current Location';
                    } catch {
                        resolvedCity = 'Local Area';
                    }
                }

                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
                );
                const weatherData = await weatherRes.json();

                if (weatherData.current) {
                    setWeather({
                        city: resolvedCity || 'Unknown Location',
                        temp: Math.round(weatherData.current.temperature_2m),
                        condition: getWeatherCondition(weatherData.current.weather_code)
                    });
                }
            } catch (error) {
                console.error('Weather fetch error:', error);
                setWeather({ city: 'India', temp: 0, condition: 'Unavailable' });
            } finally {
                setLoading(false);
            }
        };

        const getLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Success: User allowed GPS
                        fetchWeather(position.coords.latitude, position.coords.longitude);
                    },
                    async () => {
                        // Failure or Denial: Fallback to IP
                        console.warn('Geolocation error, falling back to IP');
                        try {
                            const locationRes = await fetch('https://ipapi.co/json/');
                            const locationData = await locationRes.json();
                            if (locationData.error) throw new Error('IP lookup failed');
                            fetchWeather(locationData.latitude, locationData.longitude, locationData.city);
                        } catch {
                            setLoading(false);
                        }
                    },
                    { timeout: 10000 }
                );
            } else {
                // Fallback to IP immediately if geolocation is not supported
                fetch('https://ipapi.co/json/')
                    .then(res => res.json())
                    .then(data => fetchWeather(data.latitude, data.longitude, data.city))
                    .catch(() => setLoading(false));
            }
        };

        getLocation();

        return () => clearInterval(interval);
    }, []);

    if (!currentTime) return null;

    return (
        <div className="bg-slate-900 text-gray-300 text-xs py-2 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">

                <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" />
                        <span className="font-medium tracking-wide">{currentDate}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span className="font-medium tracking-wide uppercase">{currentTime} IST</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2 min-w-[100px] justify-end">
                    {loading ? (
                        <div className="flex items-center space-x-2 opacity-50 text-[10px] md:text-xs">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Detecting Location...</span>
                        </div>
                    ) : weather ? (
                        <>
                            <div className="flex items-center space-x-1 text-gray-400">
                                <MapPin className="w-3 h-3" />
                                <span>{weather.city}:</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <CloudSun className="w-3.5 h-3.5 text-yellow-400" />
                                <span className="font-medium text-white">
                                    {weather.temp}°C {weather.condition}
                                </span>
                            </div>
                        </>
                    ) : null}
                </div>

            </div>
        </div>
    );
};

export default TopBar;
