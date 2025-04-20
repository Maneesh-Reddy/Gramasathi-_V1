import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

interface WeatherDay {
  day: string;
  forecast: string;
  temperature: string;
  precipitation: string;
  wind: string;
  icon: 'sun' | 'cloud' | 'rain' | 'wind';
}

const WeatherUpdates: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock weather data
  const weatherForecast: WeatherDay[] = [
    {
      day: 'Today',
      forecast: 'Sunny',
      temperature: '32°C',
      precipitation: '0%',
      wind: '10 km/h',
      icon: 'sun'
    },
    {
      day: 'Tomorrow',
      forecast: 'Partly Cloudy',
      temperature: '30°C',
      precipitation: '10%',
      wind: '12 km/h',
      icon: 'cloud'
    },
    {
      day: 'Wednesday',
      forecast: 'Rain',
      temperature: '27°C',
      precipitation: '80%',
      wind: '18 km/h',
      icon: 'rain'
    },
    {
      day: 'Thursday',
      forecast: 'Windy',
      temperature: '29°C',
      precipitation: '20%',
      wind: '25 km/h',
      icon: 'wind'
    },
    {
      day: 'Friday',
      forecast: 'Sunny',
      temperature: '33°C',
      precipitation: '0%',
      wind: '8 km/h',
      icon: 'sun'
    },
    {
      day: 'Saturday',
      forecast: 'Partly Cloudy',
      temperature: '31°C',
      precipitation: '10%',
      wind: '10 km/h',
      icon: 'cloud'
    },
    {
      day: 'Sunday',
      forecast: 'Rain',
      temperature: '26°C',
      precipitation: '75%',
      wind: '15 km/h',
      icon: 'rain'
    }
  ];

  const renderWeatherIcon = (icon: string) => {
    switch(icon) {
      case 'sun':
        return <Sun size={32} className="text-yellow-500" />;
      case 'cloud':
        return <Cloud size={32} className="text-gray-400" />;
      case 'rain':
        return <CloudRain size={32} className="text-blue-400" />;
      case 'wind':
        return <Wind size={32} className="text-gray-500" />;
      default:
        return <Sun size={32} className="text-yellow-500" />;
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('krishi.weather')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {weatherForecast.slice(0, 4).map((day, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              index === 0 ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{day.day}</h3>
                  <p className="text-gray-600">{day.forecast}</p>
                </div>
                {renderWeatherIcon(day.icon)}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-semibold">{day.temperature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precipitation:</span>
                  <span className="font-semibold">{day.precipitation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wind:</span>
                  <span className="font-semibold">{day.wind}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Forecast</h3>
        <div className="space-y-4">
          {weatherForecast.map((day, index) => (
            <div key={index} className="flex items-center border-b border-gray-100 pb-3 last:border-0">
              <div className="w-20 font-medium">{day.day}</div>
              <div className="w-10 mr-2">
                {renderWeatherIcon(day.icon)}
              </div>
              <div className="flex-1 ml-2">{day.forecast}</div>
              <div className="w-16 text-right">{day.temperature}</div>
              <div className="w-16 text-right">{day.precipitation}</div>
              <div className="w-16 text-right">{day.wind}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherUpdates;