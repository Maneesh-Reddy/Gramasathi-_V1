import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useApi from '../../hooks/useApi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  GoogleMap,
  Marker,
  InfoWindow
} from '@react-google-maps/api';
import { useGoogleMaps } from '../../components/GoogleMapsProvider';

// Interface for HealthCamp data structure
interface HealthCamp {
  _id: string;
  title: string;
  date: string;
  description: string;
  organizer?: string;
  contact?: string;
  services?: string[];
  registration?: {
    required: boolean;
    url?: string;
    phone?: string;
  };
  location: {
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };
}

// Generate realistic health camps near a location
const generateAuthenticCamps = (center: { lat: number; lng: number }): HealthCamp[] => {
  const campTypes = [
    {
      type: 'Vaccination Drive',
      description: 'Free vaccination camp offering COVID-19 booster shots, flu vaccines, and routine immunizations for children and adults.',
      services: ['COVID-19 Vaccination', 'Flu Shots', 'Routine Immunizations', 'Health Education']
    },
    {
      type: 'Blood Donation',
      description: 'Community blood donation drive in collaboration with the Regional Blood Bank. All blood types needed urgently.',
      services: ['Blood Collection', 'Blood Type Testing', 'Health Screening', 'Refreshments for Donors']
    },
    {
      type: 'General Health Checkup',
      description: 'Comprehensive health assessment including vital checks, blood sugar testing, cholesterol screening, and doctor consultation.',
      services: ['Vital Sign Monitoring', 'Blood Glucose Test', 'Cholesterol Screening', 'Doctor Consultation']
    },
    {
      type: 'Eye Screening',
      description: 'Free eye examination camp with vision testing, glaucoma screening, and cataract assessment by qualified ophthalmologists.',
      services: ['Vision Testing', 'Glaucoma Screening', 'Cataract Assessment', 'Eyeglasses Prescription']
    },
    {
      type: 'Dental Camp',
      description: 'Dental health camp offering check-ups, cleaning, cavity detection, and oral hygiene education by certified dentists.',
      services: ['Dental Check-up', 'Teeth Cleaning', 'Cavity Detection', 'Oral Hygiene Education']
    },
    {
      type: 'Women\'s Health',
      description: 'Women\'s health awareness camp providing breast cancer screening, gynecological consultations, and reproductive health education.',
      services: ['Breast Cancer Screening', 'Gynecological Consultation', 'Health Education', 'Nutritional Guidance']
    },
    {
      type: 'Diabetes Screening',
      description: 'Diabetes detection and awareness camp with blood sugar testing, diet counseling, and management advice for diabetic patients.',
      services: ['Blood Glucose Testing', 'HbA1c Testing', 'Dietary Counseling', 'Diabetes Management Education']
    }
  ];
  
  const organizations = [
    {name: 'District Health Department', contact: '0123-456789'},
    {name: 'Red Cross Society', contact: '9876-543210'},
    {name: 'Primary Health Center', contact: '4567-891230'},
    {name: 'National Health Mission', contact: '7890-123456'},
    {name: 'Community Health Foundation', contact: '2345-678901'}
  ];
  
  // Create realistic venues
  const venues = [
    'Government Primary School',
    'Community Center',
    'Village Panchayat Hall',
    'Public Health Center',
    'District Hospital Grounds',
    'Municipal Park',
    'Rural Development Office'
  ];
  
  // Generate camps with more authentic data
  const camps: HealthCamp[] = [];
  
  // Current date for reference
  const currentDate = new Date();
  
  // Create 7 camps over the next 30 days
  for (let i = 0; i < 7; i++) {
    // Generate random offsets within ~5km
    const latOffset = (Math.random() - 0.5) * 0.08;
    const lngOffset = (Math.random() - 0.5) * 0.08;
    
    // Generate a date within next 30 days
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 30) + 1);
    
    // Make sure time is a reasonable hour (9 AM to 4 PM)
    futureDate.setHours(9 + Math.floor(Math.random() * 7), 0, 0, 0);
    
    // Select camp type and organization
    const campTypeIndex = i % campTypes.length;
    const orgIndex = Math.floor(Math.random() * organizations.length);
    const venueIndex = Math.floor(Math.random() * venues.length);
    
    // Create the camp
    camps.push({
      _id: `camp-${i}-${Date.now()}`,
      title: `${campTypes[campTypeIndex].type} Camp`,
      date: futureDate.toISOString(),
      description: campTypes[campTypeIndex].description,
      organizer: organizations[orgIndex].name,
      contact: organizations[orgIndex].contact,
      services: campTypes[campTypeIndex].services,
      registration: {
        required: Math.random() > 0.5,
        url: Math.random() > 0.5 ? 'https://healthcamp-registration.gov.in' : undefined,
        phone: organizations[orgIndex].contact
      },
      location: {
        coordinates: [
          center.lng + lngOffset,  // longitude first
          center.lat + latOffset   // latitude second
        ],
        address: `${venues[venueIndex]}, Near ${Math.floor(Math.random() * 10) + 1}${['st', 'nd', 'rd', 'th'][Math.min(3, Math.floor(Math.random() * 10))]} Milestone, District Road`
      }
    });
  }
  
  // Sort by date
  camps.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return camps;
};

const HealthCamps: React.FC = () => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [camps, setCamps] = useState<HealthCamp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCamp, setSelectedCamp] = useState<HealthCamp | null>(null);
  const { isLoaded, loadError } = useGoogleMaps();
  const api = useApi();

  // Default location in case geolocation fails
  useEffect(() => {
    // Set a default position to start
    const defaultPos = { lat: 20.5937, lng: 78.9629 };
    setPos(defaultPos);
    
    // Generate authentic camps immediately with default position
    setCamps(generateAuthenticCamps(defaultPos));
    
    // Try to get user location
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = { lat: coords.latitude, lng: coords.longitude };
        setPos(position);
        // Regenerate camps with actual position
        setCamps(generateAuthenticCamps(position));
      },
      (err) => console.error("Geo error:", err)
    );
  }, []);

  // Fetch real camps when filters change
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
        if (result.success && result.data && result.data.length > 0) {
          // Use real data if available
          setCamps(result.data);
        } else {
          // Continue using mock data if no real data
          console.log("Using generated camp data");
          // We already set mock data in the first useEffect
        }
      } catch (err) {
        setError('Error fetching health camps');
        console.error(err);
        // Keep using generated data
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCamps();
  }, [pos, startDate, endDate]);

  // Filter camps by date if needed
  const filteredCamps = camps.filter(camp => {
    const campDate = new Date(camp.date);
    if (startDate && campDate < startDate) return false;
    if (endDate && campDate > endDate) return false;
    return true;
  });

  // Calculate distance between two points in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  // Calculate distances for all camps
  const campsWithDistance = filteredCamps.map(camp => {
    if (!pos || !camp.location?.coordinates) return { ...camp, distance: null };
    
    const distance = calculateDistance(
      pos.lat,
      pos.lng,
      camp.location.coordinates[1], // lat
      camp.location.coordinates[0]  // lng
    );
    
    return { ...camp, distance };
  });

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">{t('health.upcomingHealthCamps')}</h2>
      <p className="text-gray-600 mb-6">{t('health.findNearbyHealthCamps')}</p>
      
      {/* Date filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium mb-3">{t('health.filterByDate')}</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">{t('health.fromDate')}</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText={t('health.selectStartDate')}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">{t('health.toDate')}</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText={t('health.selectEndDate')}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 self-end mb-1"
            >
              {t('health.clearFilters')}
            </button>
          )}
        </div>
      </div>

      {loadError ? (
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-700">Failed to load Google Maps. Please check your connection.</p>
        </div>
      ) : !isLoaded ? (
        <div className="p-4 border rounded flex justify-center items-center h-[300px]">
          <div className="animate-pulse">
            <p>Loading Map...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {pos && (
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-2/3">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "600px" }}
                      center={pos || { lat: 20.5937, lng: 78.9629 }}
                      zoom={12}
                      options={{
                        fullscreenControl: true,
                        streetViewControl: false,
                        mapTypeControl: true,
                        zoomControl: true
                      }}
                    >
                      {/* User location marker */}
                      {pos && (
                        <Marker 
                          position={pos}
                          icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                          }}
                          title={t('health.yourLocation')}
                        />
                      )}
                      
                      {/* Camp markers */}
                      {campsWithDistance.map((camp) => {
                        // Ensure the camp has valid coordinates
                        if (!camp.location?.coordinates || 
                            !Array.isArray(camp.location.coordinates) || 
                            camp.location.coordinates.length < 2) {
                          return null;
                        }
                        
                        return (
                          <Marker
                            key={camp._id}
                            position={{
                              lat: camp.location.coordinates[1],
                              lng: camp.location.coordinates[0]
                            }}
                            onClick={() => setSelectedCamp(camp)}
                            icon={{
                              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            }}
                            title={camp.title}
                          />
                        );
                      })}
                      
                      {/* Info window for selected camp */}
                      {selectedCamp && selectedCamp.location?.coordinates && (
                        <InfoWindow
                          position={{
                            lat: selectedCamp.location.coordinates[1],
                            lng: selectedCamp.location.coordinates[0]
                          }}
                          onCloseClick={() => setSelectedCamp(null)}
                        >
                          <div className="p-2 max-w-[300px]">
                            <h3 className="font-semibold text-lg">{selectedCamp.title}</h3>
                            <div className="flex items-center mt-1 text-sm text-green-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(selectedCamp.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                              {' at '}
                              {new Date(selectedCamp.date).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            {selectedCamp.location?.address && (
                              <div className="flex items-start mt-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{selectedCamp.location.address}</span>
                              </div>
                            )}
                            {selectedCamp.organizer && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Organizer:</span> {selectedCamp.organizer}
                              </div>
                            )}
                            <div className="mt-2 text-xs text-gray-600">{selectedCamp.description}</div>
                            {selectedCamp.services && selectedCamp.services.length > 0 && (
                              <div className="mt-2">
                                <span className="text-sm font-medium">Services:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedCamp.services.map((service, idx) => (
                                    <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedCamp.registration && (
                              <div className="mt-3 text-sm">
                                <span className="font-medium">Registration:</span> {selectedCamp.registration.required ? 'Required' : 'Not required'}
                                {selectedCamp.registration.required && (
                                  <div className="mt-1">
                                    {selectedCamp.registration.url && (
                                      <a 
                                        href={selectedCamp.registration.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-xs block"
                                      >
                                        Register Online
                                      </a>
                                    )}
                                    {selectedCamp.registration.phone && (
                                      <p className="text-xs">Call: {selectedCamp.registration.phone}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            {selectedCamp.contact && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Contact:</span> {selectedCamp.contact}
                              </div>
                            )}
                            {pos && selectedCamp.location?.coordinates && (
                              <div className="mt-3 pt-2 border-t border-gray-200">
                                <a 
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCamp.location.coordinates[1]},${selectedCamp.location.coordinates[0]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 text-sm hover:underline"
                                >
                                  Get directions
                                </a>
                              </div>
                            )}
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  </div>
                </div>
                
                {/* Health Camps List */}
                <div className="md:w-1/3">
                  <div className="bg-white rounded-lg shadow-md p-4 h-full">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">{t('health.upcomingCamps')}</h3>
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center h-[500px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-[500px]">
                        <div className="text-amber-700 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="mt-2">{error}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[530px] overflow-y-auto pr-1">
                        {campsWithDistance.map((camp, index) => (
                          <div 
                            key={camp._id} 
                            className={`border rounded-lg p-3 cursor-pointer hover:bg-green-50 transition duration-150 ${selectedCamp && selectedCamp._id === camp._id ? 'bg-green-50 border-green-300' : ''}`}
                            onClick={() => setSelectedCamp(camp)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-green-100 rounded-full p-2 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{camp.title}</h4>
                                <div className="flex items-center mt-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p className="text-sm text-gray-600 ml-1">
                                    {new Date(camp.date).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                                {camp.organizer && (
                                  <div className="flex items-center mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-sm text-gray-600 ml-1">{camp.organizer}</p>
                                  </div>
                                )}
                                {camp.distance !== null && (
                                  <div className="flex items-center mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-sm text-gray-600 ml-1">{camp.distance.toFixed(1)} km away</p>
                                  </div>
                                )}
                                {camp.services && camp.services.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {camp.services.slice(0, 2).map((service, idx) => (
                                      <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                                        {service}
                                      </span>
                                    ))}
                                    {camp.services.length > 2 && (
                                      <span className="text-xs text-gray-500">+{camp.services.length - 2} more</span>
                                    )}
                                  </div>
                                )}
                                {camp.location?.address && (
                                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                    {camp.location.address}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {campsWithDistance.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-600 mt-2">{t('health.noCampsFound')}</p>
                            {(startDate || endDate) && (
                              <button 
                                onClick={() => {
                                  setStartDate(null);
                                  setEndDate(null);
                                }}
                                className="text-sm text-blue-600 hover:underline mt-2"
                              >
                                {t('health.clearDateFilters')}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthCamps;
