import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import { getCropTips } from '../../data/krishiData';

interface CropTipsProps {
  searchQuery: string;
  cropFilter: string;
  seasonFilter: string;
}

const CropTips: React.FC<CropTipsProps> = ({ 
  searchQuery, 
  cropFilter, 
  seasonFilter 
}) => {
  const { t } = useTranslation();
  const tips = getCropTips();
  
  // Apply filters
  const filteredTips = tips.filter(tip => {
    // Search filter
    if (searchQuery && !tip.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tip.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Crop filter
    if (cropFilter && tip.crop !== cropFilter) {
      return false;
    }
    
    // Season filter
    if (seasonFilter && tip.season !== seasonFilter) {
      return false;
    }
    
    return true;
  });

  if (filteredTips.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('common.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTips.map((tip) => (
        <Card
          key={tip.id}
          title={tip.title}
          content={tip.description}
          image={tip.image}
          link={tip.link}
          linkText={t('common.readMore')}
        />
      ))}
    </div>
  );
};

export default CropTips;