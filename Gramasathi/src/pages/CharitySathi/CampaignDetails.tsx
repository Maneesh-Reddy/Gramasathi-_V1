import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Users, Calendar, MapPin, Share2, Heart, Info, User, Clock } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { useAuth } from '../../hooks/AuthContext';
import { useVoiceContext } from '../../hooks/VoiceContext';

interface Donor {
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  amount: number;
  date: string;
  anonymous: boolean;
  message?: string;
}

interface Update {
  _id: string;
  title: string;
  content: string;
  date: string;
  images: string[];
}

interface Campaign {
  _id: string;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  raisedAmount: number;
  startDate: string;
  endDate: string;
  location: {
    village: string;
    district: string;
    state: string;
  };
  organizer: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  beneficiaries: number;
  images: string[];
  status: 'active' | 'completed' | 'cancelled';
  progressPercentage: number;
  daysRemaining: number;
  donors: Donor[];
  updates: Update[];
}

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { speak } = useVoiceContext();
  const { isAuthenticated, user } = useAuth();
  const api = useApi<Campaign>();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(100);
  const [donationMessage, setDonationMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isDonating, setIsDonating] = useState<boolean>(false);
  const [pageContent, setPageContent] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  
  // Load campaign
  useEffect(() => {
    const fetchCampaign = async () => {
      if (id) {
        const response = await api.request(`/charity/${id}`);
        
        if (response.success && response.data) {
          setCampaign(response.data);
        }
      }
    };
    
    fetchCampaign();
  }, [id]);
  
  // Generate page content for voice narration
  useEffect(() => {
    if (campaign) {
      const content = `
        ${campaign.title}. ${campaign.description}
        
        ${t('charity.campaign.raised')}: ${formatCurrency(campaign.raisedAmount)} ${t('common.of')} ${formatCurrency(campaign.targetAmount)}.
        ${campaign.daysRemaining} ${t('charity.campaign.days')}.
        ${t('charity.campaign.beneficiaries')}: ${campaign.beneficiaries}.
        ${t('charity.campaign.location')}: ${campaign.location.village}, ${campaign.location.district}, ${campaign.location.state}.
        ${t('charity.campaign.organizer')}: ${campaign.organizer.name}.
      `;
      
      setPageContent(content);
    }
  }, [campaign, t]);
  
  // Handle donation
  const handleDonate = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    
    setIsDonating(true);
    
    try {
      const response = await api.request(`/charity/${id}/donate`, {
        method: 'POST',
        body: {
          amount: donationAmount,
          message: donationMessage,
          anonymous: isAnonymous
        }
      });
      
      if (response.success) {
        setCampaign(response.data);
        // Reset form
        setDonationAmount(100);
        setDonationMessage('');
        setIsAnonymous(false);
        setIsDonating(false);
      }
    } catch (error) {
      console.error('Donation error:', error);
      setIsDonating(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  if (api.loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <p className="text-lg text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }
  
  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('common.error')}</h2>
          <p className="text-gray-600 mb-6">{t('common.campaignNotFound')}</p>
          <Link
            to="/charity"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700"
          >
            <ChevronLeft size={16} className="mr-2" />
            {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/charity"
          className="inline-flex items-center text-gray-600 hover:text-primary-600"
        >
          <ChevronLeft size={18} className="mr-1" />
          {t('common.back')}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Campaign images */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="relative aspect-video bg-gray-100">
              {campaign.images && campaign.images.length > 0 ? (
                <img
                  src={campaign.images[activeImageIndex].startsWith('http') ? campaign.images[activeImageIndex] : `http://localhost:5000${campaign.images[activeImageIndex]}`}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart size={64} className="text-gray-300" />
                </div>
              )}
              
              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status === 'active' ? t('charity.filters.active') : t('charity.filters.completed')}
                </span>
              </div>
            </div>
            
            {/* Thumbnail images */}
            {campaign.images && campaign.images.length > 1 && (
              <div className="flex p-2 overflow-x-auto space-x-2">
                {campaign.images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 rounded overflow-hidden flex-shrink-0 ${index === activeImageIndex ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Campaign title and description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
            <p className="text-gray-700 whitespace-pre-line mb-4">{campaign.description}</p>
            
            {/* Category and share */}
            <div className="flex flex-wrap justify-between items-center border-t border-gray-200 pt-4">
              <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                {t(`charity.categories.${campaign.category}`)}
              </div>
              
              <button 
                className="inline-flex items-center text-gray-600 hover:text-primary-600"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: campaign.title,
                      text: campaign.description.substring(0, 100) + '...',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
              >
                <Share2 size={18} className="mr-1" />
                {t('charity.campaign.share')}
              </button>
            </div>
          </div>
          
          {/* Campaign updates */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('charity.campaign.updates')}
            </h2>
            
            {campaign.updates && campaign.updates.length > 0 ? (
              <div className="space-y-6">
                {campaign.updates.map((update, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{update.title}</h3>
                      <span className="text-sm text-gray-500">
                        <Clock size={14} className="inline mr-1" />
                        {formatDate(update.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{update.content}</p>
                    
                    {/* Update images */}
                    {update.images && update.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {update.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="aspect-video rounded overflow-hidden">
                            <img
                              src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
                              alt={`Update ${index + 1} image ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Info size={40} className="mx-auto mb-2 text-gray-400" />
                <p>{t('charity.campaign.noUpdates')}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress and stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{t('charity.campaign.raised')}</span>
                <span className="font-medium">{formatCurrency(campaign.raisedAmount)} / {formatCurrency(campaign.targetAmount)}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-primary-500 rounded-full" 
                  style={{ width: `${campaign.progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500">
                {campaign.progressPercentage}% {t('common.complete')}
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Calendar size={18} className="mx-auto mb-1 text-primary-500" />
                <div className="text-2xl font-bold text-gray-900">{campaign.daysRemaining}</div>
                <div className="text-xs text-gray-600">{t('charity.campaign.days')}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Users size={18} className="mx-auto mb-1 text-primary-500" />
                <div className="text-2xl font-bold text-gray-900">{campaign.donors.length}</div>
                <div className="text-xs text-gray-600">{t('charity.campaign.donors')}</div>
              </div>
            </div>
            
            {/* Donation section */}
            {campaign.status === 'active' && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">{t('charity.donation.amount')}</h3>
                
                {/* Donation amount buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[100, 500, 1000].map(amount => (
                    <button
                      key={amount}
                      className={`px-3 py-2 text-sm rounded-md ${
                        donationAmount === amount 
                          ? 'bg-primary-100 text-primary-800 border border-primary-300' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => setDonationAmount(amount)}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
                
                {/* Custom amount */}
                <div className="mb-4">
                  <input
                    type="number"
                    min="10"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                {/* Message */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('charity.donation.message')}
                  </label>
                  <textarea
                    rows={3}
                    value={donationMessage}
                    onChange={(e) => setDonationMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                {/* Anonymous checkbox */}
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                    {t('charity.donation.anonymous')}
                  </label>
                </div>
                
                {/* Donate button */}
                <button
                  onClick={handleDonate}
                  disabled={isDonating || donationAmount < 10}
                  className="w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isDonating ? t('common.processing') : t('charity.campaign.donate')}
                </button>
              </div>
            )}
          </div>
          
          {/* Organizer info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-medium text-gray-900 mb-3">{t('charity.campaign.organizer')}</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {campaign.organizer.profilePicture ? (
                  <img
                    src={campaign.organizer.profilePicture.startsWith('http') ? campaign.organizer.profilePicture : `http://localhost:5000${campaign.organizer.profilePicture}`}
                    alt={campaign.organizer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">{campaign.organizer.name}</div>
                <div className="text-sm text-gray-500">{t('charity.campaign.organizer')}</div>
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-medium text-gray-900 mb-3">{t('charity.campaign.location')}</h3>
            <div className="flex items-start">
              <MapPin size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                {campaign.location.village && (
                  <div className="text-gray-800">{campaign.location.village}</div>
                )}
                {campaign.location.district && (
                  <div className="text-gray-800">{campaign.location.district}</div>
                )}
                {campaign.location.state && (
                  <div className="text-gray-800">{campaign.location.state}</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Recent donors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-medium text-gray-900 mb-3">{t('charity.campaign.donors')}</h3>
            
            {campaign.donors && campaign.donors.length > 0 ? (
              <div className="space-y-4">
                {campaign.donors.slice(0, 5).map((donor, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {!donor.anonymous && donor.user.profilePicture ? (
                        <img
                          src={donor.user.profilePicture.startsWith('http') ? donor.user.profilePicture : `http://localhost:5000${donor.user.profilePicture}`}
                          alt={donor.anonymous ? 'Anonymous donor' : donor.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-grow">
                      <div className="font-medium text-gray-900">
                        {donor.anonymous ? t('common.anonymousDonor') : donor.user.name}
                      </div>
                      {donor.message && (
                        <div className="text-sm text-gray-500">{donor.message}</div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-primary-600">
                      {formatCurrency(donor.amount)}
                    </div>
                  </div>
                ))}
                
                {campaign.donors.length > 5 && (
                  <div className="text-center text-sm text-gray-500 pt-2">
                    + {campaign.donors.length - 5} {t('common.moreDonors')}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>{t('common.noDonors')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails; 