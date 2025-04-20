import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import { getMedicalCamps } from '../../data/healthData';

interface HealthCampsProps {
  searchQuery: string;
  dateFilter: string;
  locationFilter: string;
}

const HealthCamps: React.FC<HealthCampsProps> = ({ 
  searchQuery, 
  dateFilter, 
  locationFilter 
}) => {
  const { t } = useTranslation();
  const camps = getMedicalCamps();
  
  // Apply filters
  const filteredCamps = camps.filter(camp => {
    // Search filter
    if (searchQuery && !camp.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !camp.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Date filter
    if (dateFilter) {
      // This would be more complex in a real app with actual date handling
      if (dateFilter === 'today' && !camp.date.includes('Today')) return false;
      if (dateFilter === 'thisWeek' && !camp.date.includes('Week')) return false;
      if (dateFilter === 'thisMonth' && !camp.date.includes('Month')) return false;
    }
    
    // Location filter
    if (locationFilter && camp.location !== locationFilter) {
      return false;
    }
    
    return true;
  });

  if (filteredCamps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('common.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCamps.map((camp) => (
        <Card
          key={camp.id}
          title={camp.title}
          content={camp.description}
          image={camp.image}
          date={camp.date}
          location={camp.location}
          link={camp.link}
          linkText={t('common.readMore')}
        />
      ))}
    </div>
  );
};

export default HealthCamps;