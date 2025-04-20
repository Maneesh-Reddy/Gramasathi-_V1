import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import DatePicker from 'react-datepicker';
import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow
} from '@react-google-maps/api';

const mapStyle = { width: '100%', height: '400px' };

const HealthCamps: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate,   setEndDate]   = useState<Date | null>(null);
  const [pos,       setPos]       = useState<{ lat: number; lng: number } | null>(null);
  const [camps, setCamps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCamp, setSelectedCamp] = useState<any>(null);
  const api = useApi();

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setPos({ lat: coords.latitude, lng: coords.longitude }),
      console.error
    );
  }, []);

  // Fetch camps when filters change
  useEffect(() => {
    if (!pos) return;
    
    const fetchCamps = async () => {
      setIsLoading(true);
      try {
        // Build query params
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate.toISOString());
        if (endDate) queryParams.append('endDate', endDate.toISOString());
        queryParams.append('lat', pos.lat.toString());
        queryParams.append('lng', pos.lng.toString());
        queryParams.append('radius', '10');
        
        const result = await api.request(`/camps?${queryParams.toString()}`);
        if (result.success) {
          setCamps(result.data || []);
        } else {
          setError(result.error || 'Failed to load camps');
        }
      } catch (err) {
        setError('Error fetching camps');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCamps();
  }, [pos, startDate, endDate]);

  if (!pos) return <div>Locating you…</div>;
  if (isLoading) return <div>Loading health camps…</div>;
  if (error) return <div>Error loading camps</div>;

  return (
    <div>
      <h2 className="text-xl mb-4">Upcoming Health Camps</h2>

      {/* Date filters */}
      <div className="flex gap-4 mb-4">
        <DatePicker
          selected={startDate}
          onChange={(d) => setStartDate(d)}
          placeholderText="From date"
        />
        <DatePicker
          selected={endDate}
          onChange={(d) => setEndDate(d)}
          placeholderText="To date"
        />
      </div>

      {/* Render camps list */}
      <ul className="mb-4">
        {camps.map((c: any) => (
          <li key={c._id} className="mb-2">
            <strong>{c.title}</strong> • {new Date(c.date).toLocaleDateString()}
          </li>
        ))}
      </ul>

      {/* Map of camps */}
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyle}
          center={pos}
          zoom={11}
        >
          {/* User location marker */}
          <Marker position={pos} />
          
          {/* Camp markers */}
          {camps.map((camp) => (
            <Marker
              key={camp._id}
              position={{
                lat: camp.location.coordinates[1],
                lng: camp.location.coordinates[0]
              }}
              onClick={() => setSelectedCamp(camp)}
              icon={{
                url: '/icons/camp-marker.png',
                scaledSize: new window.google.maps.Size(30, 30)
              }}
            />
          ))}
          
          {/* Info window for selected camp */}
          {selectedCamp && (
            <InfoWindow
              position={{
                lat: selectedCamp.location.coordinates[1],
                lng: selectedCamp.location.coordinates[0]
              }}
              onCloseClick={() => setSelectedCamp(null)}
            >
              <div>
                <strong>{selectedCamp.title}</strong><br/>
                {new Date(selectedCamp.date).toLocaleDateString()}<br/>
                {selectedCamp.description}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default HealthCamps;
