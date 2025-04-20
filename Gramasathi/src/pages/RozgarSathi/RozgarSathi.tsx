import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';  // Use icons from lucide-react or any other icon library you prefer

const RozgarSathi: React.FC = () => {
  const { t } = useTranslation();
  
  // State for storing job listings
  const [jobs, setJobs] = useState<any[]>([]); // You can replace 'any' with a proper type for jobs
  const [jobTypeFilter, setJobTypeFilter] = useState<string>(''); // For filtering jobs (optional)

  // Simulate fetching job data (replace this with actual API call)
  useEffect(() => {
    // Example job data (replace with an actual API call)
    const jobData = [
      { id: 1, title: 'Farm Worker', type: 'Agriculture', location: 'Guntur', description: 'Help with planting and harvesting crops.' },
      { id: 2, title: 'Construction Worker', type: 'Construction', location: 'Amaravathi', description: 'Assist with building residential homes.' },
      { id: 3, title: 'Teacher', type: 'Education', location: 'Guntur', description: 'Teach basic education to rural children.' },
    ];

    // Set job data to state
    setJobs(jobData);
  }, []);

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobTypeFilter(e.target.value);
  };

  // Filter jobs based on the selected job type
  const filteredJobs = jobTypeFilter
    ? jobs.filter(job => job.type === jobTypeFilter)
    : jobs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-primary-600">{t('rozgar.title')}</h1>
      <p className="mt-2 text-lg text-gray-600">{t('rozgar.subtitle')}</p>

      {/* Filter Section */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            className="px-3 py-2 rounded-md bg-primary-100 text-primary-600"
            value={jobTypeFilter}
            onChange={handleFilterChange}
          >
            <option value="">{t('rozgar.selectJobType')}</option>
            <option value="Agriculture">{t('rozgar.agriculture')}</option>
            <option value="Construction">{t('rozgar.construction')}</option>
            <option value="Education">{t('rozgar.education')}</option>
          </select>
        </div>
        <Link
          to="/add-job"  // Route to a job submission page (you need to create this page separately)
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-400"
        >
          <PlusCircle className="inline-block mr-2" size={20} /> {t('rozgar.addJob')}
        </Link>
      </div>

      {/* Job Listings */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white shadow-lg rounded-md p-4">
            <h2 className="font-semibold text-xl text-primary-600">{job.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{job.description}</p>
            <p className="mt-2 text-sm text-gray-500">{t('rozgar.location')}: {job.location}</p>
            <p className="mt-1 text-sm text-gray-500">{t('rozgar.jobType')}: {job.type}</p>
            <Link
              to={`/job-details/${job.id}`}  // Route to a job detail page
              className="mt-3 inline-block text-primary-500 hover:text-primary-700"
            >
              {t('rozgar.viewDetails')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RozgarSathi;
