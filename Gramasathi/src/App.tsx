import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import VoiceControl from './components/ui/VoiceControl';
import GoogleMapsProvider from './components/GoogleMapsProvider';

// Pages
import Home from './pages/Home';
import HealthSathi from './pages/HealthSathi/HealthSathi';
import EduSathi from './pages/EduSathi/EduSathi';
import KrishiSathi from './pages/KrishiSathi/KrishiSathi';
import GrievanceReporting from './pages/GrievanceReporting/GrievanceReporting';
import EcoSathi from './pages/EcoSathi/EcoSathi';
import RozgarSathi from './pages/RozgarSathi/RozgarSathi';
import CharitySathi from './pages/CharitySathi/CharitySathi';
import CampaignDetails from './pages/CharitySathi/CampaignDetails';
import CreateCampaign from './pages/CharitySathi/CreateCampaign';
import Donate from './pages/CharitySathi/Donate';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Profile/Dashboard';
import HealthCamps from './pages/HealthSathi/HealthCamps';

// Auth provider
import { AuthProvider } from './hooks/AuthContext';
import { VoiceProvider } from './hooks/VoiceContext';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setIsSidebarCollapsed(customEvent.detail.collapsed);
    };

    document.addEventListener('sidebar-state-change', handleSidebarStateChange);

    return () => {
      document.removeEventListener('sidebar-state-change', handleSidebarStateChange);
    };
  }, []);

  return (
    <AuthProvider>
      <VoiceProvider>
        <GoogleMapsProvider>
          <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Sidebar - managed by Header component */}
            <Header />
            
            {/* Main Content Area */}
            <div 
              className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
              }`}
            >
              {/* Main Content */}
              <main className="flex-grow px-4 py-6 md:px-8">
                <Suspense fallback={<div className="flex justify-center py-12">Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/health" element={<HealthSathi />} />
                    <Route path="/health/camps" element={<HealthCamps />} />
                    <Route path="/edu" element={<EduSathi />} />
                    <Route path="/krishi" element={<KrishiSathi />} />
                    <Route path="/grievance" element={<GrievanceReporting />} />
                    <Route path="/eco" element={<EcoSathi />} />
                    <Route path="/rozgar" element={<RozgarSathi />} />
                    <Route path="/charity" element={<CharitySathi />} />
                    <Route path="/charity/:id" element={<CampaignDetails />} />
                    <Route path="/charity/create" element={<CreateCampaign />} />
                    <Route path="/charity/:campaignId/donate" element={<Donate />} />
                    
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/dashboard" element={<Dashboard />} />
                    <Route path="/profile/donations" element={<Dashboard />} />
                    <Route path="/profile/campaigns" element={<Dashboard />} />
                    <Route path="/profile/grievances" element={<Dashboard />} />
                  </Routes>
                </Suspense>
              </main>
              
              {/* Footer */}
              <Footer />
              
              {/* Voice Control */}
              <VoiceControl />
            </div>
          </div>
        </GoogleMapsProvider>
      </VoiceProvider>
    </AuthProvider>
  );
};

export default App;