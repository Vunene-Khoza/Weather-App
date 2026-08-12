import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Wind, 
  Droplets, 
  Sun, 
  Calendar, 
  Umbrella, 
  CloudRain, 
  CloudSun,
  Cloud,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRainWind,
  Snowflake,
  CloudSnow,
  CloudLightning,
  AlertTriangle
} from 'lucide-react';
import './App.css';

// Mapping WMO weather codes to labels, classes, icons, and animated GIFs
const WEATHER_CONDITIONS = {
  0: { label: 'Clear Sky', icon: Sun, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYycHpwN3VlYW90OGh5aHp0dGRsd3Fkc2tyYTZuYmZkaHpybTZrOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/928mP30Ff25W5vI250/giphy.gif', bgClass: 'bg-clear', themeColor: '#ff9800', gifEmbedUrl: 'https://tenor.com/embed/22518649' },
  1: { label: 'Mainly Clear', icon: CloudSun, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5oZnBhOTdzZDJ0YnlhOHpyc3Rndnl3a2o3YjZqdmtwOHM5Znd5MyZlcD12MV9naWZzX3NlYXJjaCZjdD1z/433IpNXsOAVU3JGX7J/giphy.gif', bgClass: 'bg-cloudy', themeColor: '#8ba4b1', gifEmbedUrl: 'https://tenor.com/embed/25666369' },
  2: { label: 'Partly Cloudy', icon: Cloud, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5oZnBhOTdzZDJ0YnlhOHpyc3Rndnl3a2o3YjZqdmtwOHM5Znd5MyZlcD12MV9naWZzX3NlYXJjaCZjdD1z/433IpNXsOAVU3JGX7J/giphy.gif', bgClass: 'bg-cloudy', themeColor: '#8ba4b1', gifEmbedUrl: 'https://tenor.com/embed/16322102684153383046' },
  3: { label: 'Overcast', icon: Cloudy, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5oZnBhOTdzZDJ0YnlhOHpyc3Rndnl3a2o3YjZqdmtwOHM5Znd5MyZlcD12MV9naWZzX3NlYXJjaCZjdD1z/433IpNXsOAVU3JGX7J/giphy.gif', bgClass: 'bg-overcast', themeColor: '#5c6b73', gifEmbedUrl: 'https://tenor.com/embed/16322102684153383046' },
  45: { label: 'Foggy', icon: CloudFog, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXlpbzBhbWRoYW15Mmx5MGc2YTBmMGxwdnJnbzdtdzB2ZTZ5aWR4diZlcD12MV9naWZzX3NlYXJjaCZjdD1z/29HRejgahYenGXbl25/giphy.gif', bgClass: 'bg-fog', themeColor: '#78909c' },
  48: { label: 'Depositing Rime Fog', icon: CloudFog, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXlpbzBhbWRoYW15Mmx5MGc2YTBmMGxwdnJnbzdtdzB2ZTZ5aWR4diZlcD12MV9naWZzX3NlYXJjaCZjdD1z/29HRejgahYenGXbl25/giphy.gif', bgClass: 'bg-fog', themeColor: '#78909c' },
  51: { label: 'Light Drizzle', icon: CloudDrizzle, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHhkaDZ6d3hpaW5mY28xNWN4bzg1NWhsb2F0dmh3NDJjdTZrNm5uMiZlcD12MV9naWZzX3NlYXJjaCZjdD1z/XIqCQx02E1U9W/giphy.gif', bgClass: 'bg-drizzle', themeColor: '#29b6f6', gifEmbedUrl: 'https://tenor.com/embed/14037158' },
  53: { label: 'Moderate Drizzle', icon: CloudDrizzle, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHhkaDZ6d3hpaW5mY28xNWN4bzg1NWhsb2F0dmh3NDJjdTZrNm5uMiZlcD12MV9naWZzX3NlYXJjaCZjdD1z/XIqCQx02E1U9W/giphy.gif', bgClass: 'bg-drizzle', themeColor: '#29b6f6', gifEmbedUrl: 'https://tenor.com/embed/14037158' },
  55: { label: 'Dense Drizzle', icon: CloudDrizzle, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHhkaDZ6d3hpaW5mY28xNWN4bzg1NWhsb2F0dmh3NDJjdTZrNm5uMiZlcD12MV9naWZzX3NlYXJjaCZjdD1z/XIqCQx02E1U9W/giphy.gif', bgClass: 'bg-drizzle', themeColor: '#0288d1', gifEmbedUrl: 'https://tenor.com/embed/14037158' },
  56: { label: 'Light Freezing Drizzle', icon: CloudSnow, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow', themeColor: '#80deea', gifEmbedUrl: 'https://tenor.com/embed/14037158' },
  57: { label: 'Dense Freezing Drizzle', icon: CloudSnow, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow', themeColor: '#80deea', gifEmbedUrl: 'https://tenor.com/embed/14037158' },
  61: { label: 'Light Rain', icon: CloudRain, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTBtcmI3eTk4ZXdzcDFoNDU5NDdhaTAxdTRiMmcycnA3dHR2bWFjOSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l0HlJdfWzoD5l62C4/giphy.gif', bgClass: 'bg-rain', themeColor: '#2196f3' },
  63: { label: 'Moderate Rain', icon: CloudRain, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTBtcmI3eTk4ZXdzcDFoNDU5NDdhaTAxdTRiMmcycnA3dHR2bWFjOSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l0HlJdfWzoD5l62C4/giphy.gif', bgClass: 'bg-rain', themeColor: '#1976d2' },
  65: { label: 'Heavy Rain', icon: CloudRainWind, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTBtcmI3eTk4ZXdzcDFoNDU5NDdhaTAxdTRiMmcycnA3dHR2bWFjOSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l0HlJdfWzoD5l62C4/giphy.gif', bgClass: 'bg-rain-heavy', themeColor: '#0d47a1' },
  66: { label: 'Light Freezing Rain', icon: CloudSnow, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow', themeColor: '#80deea' },
  67: { label: 'Heavy Freezing Rain', icon: CloudSnow, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow', themeColor: '#00ebd4' },
  71: { label: 'Light Snowfall', icon: Snowflake, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow', themeColor: '#b2ebf2' },
  73: { label: 'Moderate Snowfall', icon: Snowflake, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow', themeColor: '#b2ebf2' },
  75: { label: 'Heavy Snowfall', icon: Snowflake, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow-heavy', themeColor: '#00bcd4' },
  77: { label: 'Snow Grains', icon: Snowflake, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow', themeColor: '#b2ebf2' },
  80: { label: 'Light Rain Showers', icon: CloudRain, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTBtcmI3eTk4ZXdzcDFoNDU5NDdhaTAxdTRiMmcycnA3dHR2bWFjOSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l0HlJdfWzoD5l62C4/giphy.gif', bgClass: 'bg-rain', themeColor: '#2196f3', gifEmbedUrl: 'https://tenor.com/embed/14037158' },
  81: { label: 'Moderate Rain Showers', icon: CloudRain, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTBtcmI3eTk4ZXdzcDFoNDU5NDdhaTAxdTRiMmcycnA3dHR2bWFjOSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l0HlJdfWzoD5l62C4/giphy.gif', bgClass: 'bg-rain', themeColor: '#1976d2', gifEmbedUrl: 'https://tenor.com/embed/14037158' },
  82: { label: 'Violent Rain Showers', icon: CloudRainWind, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTBtcmI3eTk4ZXdzcDFoNDU5NDdhaTAxdTRiMmcycnA3dHR2bWFjOSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l0HlJdfWzoD5l62C4/giphy.gif', bgClass: 'bg-rain-heavy', themeColor: '#0d47a1', gifEmbedUrl: 'https://tenor.com/embed/14037158' },
  85: { label: 'Light Snow Showers', icon: CloudSnow, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow', themeColor: '#b2ebf2' },
  86: { label: 'Heavy Snow Showers', icon: CloudSnow, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDJubGplZHhuNWlyb3B5bXhvd3B2aDZyYjA0dGx6OWpuaWR4OHc4dSZlcD12MV9naWZzX3NlYXJjaCZjdD1z/xTiTgy98Ll1f5ASDFK/giphy.gif', bgClass: 'bg-snow-heavy', themeColor: '#00bcd4' },
  95: { label: 'Thunderstorm', icon: CloudLightning, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3phNXZ4eDBnbG05ZXozb2J3ZmhyN2NyeHdqMXVpNDRxczFkYmx2aiZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l3fZPf0S1fICfVSCc/giphy.gif', bgClass: 'bg-storm', themeColor: '#b388ff', gifEmbedUrl: 'https://tenor.com/embed/4098722568709273763' },
  96: { label: 'Thunderstorm with Hail', icon: CloudLightning, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3phNXZ4eDBnbG05ZXozb2J3ZmhyN2NyeHdqMXVpNDRxczFkYmx2aiZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l3fZPf0S1fICfVSCc/giphy.gif', bgClass: 'bg-storm', themeColor: '#b388ff', gifEmbedUrl: 'https://tenor.com/embed/4098722568709273763' },
  99: { label: 'Heavy Thunderstorm', icon: CloudLightning, gif: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3phNXZ4eDBnbG05ZXozb2J3ZmhyN2NyeHdqMXVpNDRxczFkYmx2aiZlcD12MV9naWZzX3NlYXJjaCZjdD1z/l3fZPf0S1fICfVSCc/giphy.gif', bgClass: 'bg-storm', themeColor: '#6200ea', gifEmbedUrl: 'https://tenor.com/embed/4098722568709273763' }
};

const getWeatherDetails = (code) => {
  return WEATHER_CONDITIONS[code] || {
    label: 'Unknown',
    icon: Sun,
    gif: WEATHER_CONDITIONS[0].gif,
    bgClass: 'bg-clear',
    themeColor: '#ff9800'
  };
};

function App() {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);

  const searchContainerRef = useRef(null);

  // Load last searched location from localStorage on mount, or fallback to default (Cape Town)
  useEffect(() => {
    const saved = localStorage.getItem('skyflow_last_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedLocation(parsed);
      } catch (e) {
        // Fallback
        loadDefaultLocation();
      }
    } else {
      // Default location
      loadDefaultLocation();
    }
  }, []);

  // Fetch suggestions when user types (debounced)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            searchQuery
          )}&count=6&language=en&format=json`
        );
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside suggestions list to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadDefaultLocation = () => {
    const capeTown = {
      name: 'Cape Town',
      latitude: -33.9249,
      longitude: 18.4241,
      country: 'South Africa',
      admin1: 'Western Cape'
    };
    setSelectedLocation(capeTown);
  };

  // Main function to fetch weather data for a specific location
  const fetchWeather = useCallback(async (location) => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_probability_max&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to retrieve weather data.');
      
      const data = await res.json();
      setWeatherData(data);
      
      // Save location to localStorage
      localStorage.setItem('skyflow_last_location', JSON.stringify(location));
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the weather details.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch weather data whenever selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      fetchWeather(selectedLocation);
    }
  }, [selectedLocation, fetchWeather]);

  // Handle geolocation trigger
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Attempt reverse geocoding to get user's location name
        let name = 'Your Location';
        let country = '';
        let admin1 = '';
        try {
          // Use Open-Meteo geocoding search or fallback
          // (Since open-meteo geocoder is forward only, we can use a free lightweight geocode service or simply label it as "Current Location")
          name = 'Current Location';
        } catch (e) {
          console.error('Reverse geocode failed, using default name');
        }

        const userLocation = {
          name,
          latitude,
          longitude,
          country,
          admin1
        };

        setLocating(false);
        setSelectedLocation(userLocation);
      },
      (err) => {
        setLocating(false);
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location access was denied. Please allow location permissions or search for a city.');
        } else {
          setError('Could not retrieve your location. Please try searching.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const selectPlace = (place) => {
    setSelectedLocation({
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      country: place.country || '',
      admin1: place.admin1 || ''
    });
    setSearchQuery('');
    setSuggestions([]);
  };

  // Helper: Format Dates
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Extract necessary weather values
  const currentDetails = weatherData?.current;
  const currentCondition = currentDetails ? getWeatherDetails(currentDetails.weather_code) : getWeatherDetails(0);
  const dailyForecast = weatherData?.daily;
  const CurrentIcon = currentCondition.icon;

  return (
    <div className="app-container">
      <main className="weather-dashboard">
        
        {/* Search Panel */}
        <section className="search-section" ref={searchContainerRef}>
          <div className="search-bar-wrapper">
            <div className="input-icon-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search places... (e.g., Cape Town, Durban)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searching && <div className="spinner-mini" />}
            </div>
            
            <button 
              className="geolocation-btn" 
              onClick={handleGeolocation} 
              title="Use current location"
              disabled={locating}
            >
              <MapPin size={20} className={locating ? "spinning-icon" : ""} />
              <span>{locating ? "Locating..." : "Locate"}</span>
            </button>
          </div>

          {/* Autocomplete Dropdown List */}
          {suggestions.length > 0 && (
            <div className="autocomplete-dropdown">
              {suggestions.map((place) => (
                <div 
                  key={place.id} 
                  className="suggestion-item" 
                  onClick={() => selectPlace(place)}
                >
                  <MapPin size={16} className="item-pin" />
                  <div className="item-details">
                    <span className="item-name">{place.name}</span>
                    <span className="item-region">
                      {place.admin1 ? `${place.admin1}, ` : ''}{place.country}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Error Messaging banner */}
        {error && (
          <div className="error-banner">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Overlay State */}
        {loading ? (
          <div className="skeleton-container">
            <div className="skeleton hero-skeleton" />
            <div className="skeleton-grid">
              <div className="skeleton grid-skeleton" />
              <div className="skeleton grid-skeleton" />
              <div className="skeleton grid-skeleton" />
              <div className="skeleton grid-skeleton" />
            </div>
            <div className="skeleton forecast-skeleton" />
          </div>
        ) : (
          weatherData && (
            <div className="dashboard-grid">
              
              {/* Main Weather Card (Hero widget) */}
              <section className="hero-card glass-panel">

                
                <div className="location-info">
                  <h2>{selectedLocation?.name}</h2>
                  <p className="location-coords">
                    {selectedLocation?.admin1 ? `${selectedLocation.admin1}, ` : ''}
                    {selectedLocation?.country || `Lat: ${selectedLocation?.latitude.toFixed(2)} Lon: ${selectedLocation?.longitude.toFixed(2)}`}
                  </p>
                </div>

                <div className="hero-main-content">
                  <div className="temperature-container">
                    <span className="temp-value">{Math.round(currentDetails?.temperature_2m)}</span>
                    <span className="temp-unit">°C</span>
                  </div>

                  <div className="condition-status">
                    <span className="condition-text">{currentCondition.label}</span>
                  </div>
                </div>

                {/* Weather Icon Container */}
                <div className="weather-icon-container">
                  {currentCondition.gifEmbedUrl ? (
                    <iframe src={currentCondition.gifEmbedUrl} title={currentCondition.label} frameBorder="0" scrolling="no" />
                  ) : (
                    <CurrentIcon size={80} style={{ color: currentCondition.themeColor }} />
                  )}
                </div>
              </section>

              {/* Weather Stats Grid */}
              <section className="stats-grid">
                <div className="stat-card glass-panel">
                  <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                    <Droplets size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-title">Humidity</span>
                    <span className="stat-value">{currentDetails?.relative_humidity_2m}%</span>
                  </div>
                </div>

                <div className="stat-card glass-panel">
                  <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                    <Wind size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-title">Wind Speed</span>
                    <span className="stat-value">{currentDetails?.wind_speed_10m} km/h</span>
                  </div>
                </div>

                <div className="stat-card glass-panel">
                  <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                    <Sun size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-title">UV Index</span>
                    <span className="stat-value">{dailyForecast?.uv_index_max[0]} / 10</span>
                  </div>
                </div>

                <div className="stat-card glass-panel">
                  <div className="stat-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
                    <Umbrella size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-title">Precipitation</span>
                    <span className="stat-value">{dailyForecast?.precipitation_probability_max[0]}%</span>
                  </div>
                </div>
              </section>


              {/* 7-Day Forecast Section */}
              <section className="seven-day-panel glass-panel">
                <h3><Calendar size={18} className="panel-title-icon" /> 7-Day Forecast</h3>
                
                <div className="forecast-list">
                  {dailyForecast?.time.map((dayStr, idx) => {
                    const code = dailyForecast.weather_code[idx];
                    const cond = getWeatherDetails(code);
                    const isToday = idx === 0;
                    const ForecastIcon = cond.icon;

                    return (
                      <div key={dayStr} className={`forecast-row ${isToday ? 'is-today' : ''}`}>
                        <div className="forecast-day-meta">
                          <span className="day-name">{isToday ? 'Today' : getDayName(dayStr)}</span>
                          <span className="day-date">
                            {new Date(dayStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <div className="forecast-condition">
                          {cond.gifEmbedUrl ? (
                            <iframe src={cond.gifEmbedUrl} className="forecast-gif-icon" title={cond.label} frameBorder="0" scrolling="no" />
                          ) : (
                            <ForecastIcon size={24} style={{ color: cond.themeColor }} />
                          )}
                          <span className="condition-txt">{cond.label}</span>
                        </div>

                        <div className="forecast-rain-prob">
                          <Umbrella size={14} className="small-rain-icon" />
                          <span>{dailyForecast.precipitation_probability_max[idx]}%</span>
                        </div>

                        <div className="forecast-temps">
                          <span className="temp-low">{Math.round(dailyForecast.temperature_2m_min[idx])}°</span>
                          <div className="temp-progress-bar">
                            <div 
                              className="temp-progress-fill" 
                              style={{ 
                                background: `linear-gradient(90deg, #60a5fa, ${cond.themeColor})` 
                              }}
                            />
                          </div>
                          <span className="temp-high">{Math.round(dailyForecast.temperature_2m_max[idx])}°</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>



            </div>
          )
        )}
      </main>
    </div>
  );
}

export default App;
