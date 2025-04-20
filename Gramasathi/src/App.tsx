import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import VoiceControl from './components/ui/VoiceControl';

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
  return (
    <AuthProvider>
      <VoiceProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
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
          <Footer />
          <VoiceControl />
        </div>
      </VoiceProvider>
    </AuthProvider>
  );
};

export default App;