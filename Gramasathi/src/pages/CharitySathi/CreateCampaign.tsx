import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Upload, Calendar, X } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { useAuth } from '../../hooks/AuthContext';

const CreateCampaign: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const api = useApi();
  
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('elderly');
  const [targetAmount, setTargetAmount] = useState<number>(5000);
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [village, setVillage] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [beneficiaries, setBeneficiaries] = useState<number>(1);
  const [images, setImages] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    navigate('/login');
  }
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      // Limit to 5 images
      const selectedFiles = Array.from(files).slice(0, 5);
      
      // Create preview URLs
      const previews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
      
      // Set the files for upload
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach(file => {
        dataTransfer.items.add(file);
      });
      
      setImages(dataTransfer.files);
    }
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    if (images) {
      const newImages = Array.from(images);
      newImages.splice(index, 1);
      
      // Create new FileList
      const dataTransfer = new DataTransfer();
      newImages.forEach(file => {
        dataTransfer.items.add(file);
      });
      
      setImages(dataTransfer.files.length > 0 ? dataTransfer.files : null);
      
      // Update preview images
      const newPreviews = [...previewImages];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      setPreviewImages(newPreviews);
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = t('common.fieldRequired');
    }
    
    if (!description.trim()) {
      newErrors.description = t('common.fieldRequired');
    }
    
    if (!targetAmount || targetAmount <= 0) {
      newErrors.targetAmount = t('common.invalidAmount');
    }
    
    if (!endDate) {
      newErrors.endDate = t('common.fieldRequired');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(endDate);
      
      if (selectedDate <= today) {
        newErrors.endDate = t('common.dateMustBeFuture');
      }
    }
    
    if (!beneficiaries || beneficiaries <= 0) {
      newErrors.beneficiaries = t('common.invalidNumber');
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('targetAmount', targetAmount.toString());
      formData.append('endDate', new Date(endDate).toISOString());
      formData.append('village', village);
      formData.append('district', district);
      formData.append('state', state);
      formData.append('beneficiaries', beneficiaries.toString());
      
      // Add images
      if (images) {
        Array.from(images).forEach(file => {
          formData.append('images', file);
        });
      }
      
      const response = await api.request('/charity', {
        method: 'POST',
        body: formData,
        isFormData: true
      });
      
      if (response.success && response.data) {
        // Redirect to campaign page
        navigate(`/charity/${response.data._id}`);
      }
    } catch (error) {
      console.error('Create campaign error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {t('charity.campaign.create')}
          </h1>
          
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('charity.form.title')} *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('charity.form.description')} *
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            
            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                {t('charity.form.category')} *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="elderly">{t('charity.categories.elderly')}</option>
                <option value="disabled">{t('charity.categories.disabled')}</option>
                <option value="children">{t('charity.categories.children')}</option>
                <option value="women">{t('charity.categories.women')}</option>
                <option value="other">{t('charity.categories.other')}</option>
              </select>
            </div>
            
            {/* Target Amount */}
            <div className="mb-4">
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                {t('charity.form.targetAmount')} *
              </label>
              <input
                type="number"
                id="targetAmount"
                min="100"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.targetAmount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.targetAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>
              )}
            </div>
            
            {/* End Date */}
            <div className="mb-4">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('charity.form.endDate')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
            
            {/* Location */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {t('charity.campaign.location')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="village" className="block text-xs text-gray-500 mb-1">
                    {t('charity.form.village')}
                  </label>
                  <input
                    type="text"
                    id="village"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="district" className="block text-xs text-gray-500 mb-1">
                    {t('charity.form.district')}
                  </label>
                  <input
                    type="text"
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs text-gray-500 mb-1">
                    {t('charity.form.state')}
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Beneficiaries */}
            <div className="mb-4">
              <label htmlFor="beneficiaries" className="block text-sm font-medium text-gray-700 mb-1">
                {t('charity.form.beneficiaries')} *
              </label>
              <input
                type="number"
                id="beneficiaries"
                min="1"
                value={beneficiaries}
                onChange={(e) => setBeneficiaries(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.beneficiaries ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.beneficiaries && (
                <p className="mt-1 text-sm text-red-600">{errors.beneficiaries}</p>
              )}
            </div>
            
            {/* Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('charity.form.images')}
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>{t('common.uploadFiles')}</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">{t('common.orDragAndDrop')}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP {t('common.upTo')} 5MB (max 5 {t('common.images')})
                  </p>
                </div>
              </div>
              
              {/* Preview images */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                        onClick={() => removeImage(index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting ? t('common.creating') : t('charity.form.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign; 