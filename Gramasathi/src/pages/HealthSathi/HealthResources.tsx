import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import { getHealthResources } from '../../data/healthData';

interface HealthResourcesProps {
  searchQuery: string;
  locationFilter: string;
}

const HealthResources: React.FC<HealthResourcesProps> = ({ 
  searchQuery, 
  locationFilter 
}) => {
  const { t } = useTranslation();
  const resources = getHealthResources();
  
  // Apply filters
  const filteredResources = resources.filter(resource => {
    // Search filter
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Location filter
    if (locationFilter && resource.location !== locationFilter) {
      return false;
    }
    
    return true;
  });

  if (filteredResources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('common.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredResources.map((resource) => (
        <Card
          key={resource.id}
          title={resource.title}
          content={resource.description}
          image={resource.image}
          location={resource.location}
          link={resource.link}
          linkText={t('common.readMore')}
        />
      ))}
    </div>
  );
};

export default HealthResources;