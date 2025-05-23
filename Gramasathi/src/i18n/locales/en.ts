export default {
  common: {
    search: 'Search',
    filter: 'Filter',
    submit: 'Submit',
    reset: 'Reset',
    loading: 'Loading...',
    noResults: 'No results found',
    readMore: 'Read More',
    speakInstructions: 'Speak Instructions',
    stopSpeaking: 'Stop Speaking',
    languageSwitch: 'Switch to Telugu',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    error: 'An error occurred',
    success: 'Success',
    sort: 'Sort',
    information: 'Information',
    actions: 'Actions',
    loggedOut: 'You have been logged out successfully',
  },
  
  nav: {
    home: 'Home',
    health: 'Healthcare Services',
    edu: 'Educational Services',
    krishi: 'Agricultural Services',
    grievance: 'Grievance Reporting',
    eco: 'Environmental Services',
    rozgar: 'Employment Services',
    charity: 'Community Support',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout'
  },
  
  health: {
    title: 'Healthcare Services',
    subtitle: 'Comprehensive healthcare resources and support services',
    camps: 'Medical Camps',
    tips: 'Health Tips',
    resources: 'Healthcare Facilities',
    nearbyResources: 'Nearby Healthcare Facilities',
    nearbyHealthServices: 'Nearby Healthcare Services',
    findNearbyHealthcare: 'Find and locate medical facilities in your vicinity',
    nearbyHospitals: 'Nearby Medical Facilities',
    noHospitalsFound: 'No medical facilities found in this area',
    searchingHospitals: 'Searching for medical facilities...',
    dateFilter: 'Filter by Date',
    locationFilter: 'Filter by Location',
    voiceInstructions: 'This is the Healthcare Services page where you can find information about medical camps, health tips, and nearby healthcare facilities. Use the search bar to find specific information. You can filter medical camps by date and location using the filter options.',
    upcomingHealthCamps: 'Upcoming Medical Camps',
    findNearbyHealthCamps: 'Find and register for upcoming medical camps in your region',
    filterByDate: 'Filter Camps by Date',
    fromDate: 'Start Date',
    toDate: 'End Date',
    clearFilters: 'Clear All Filters',
    yourLocation: 'Your Current Location',
    upcomingCamps: 'Scheduled Medical Camps',
    noCampsFound: 'No medical camps found for the selected dates',
    clearDateFilters: 'Clear Date Filters',
    selectStartDate: 'Select start date',
    selectEndDate: 'Select end date'
  },
  
  rozgar: {
    title: 'Employment Services',
    subtitle: 'Employment opportunities and skill development programs',
    selectJobType: 'Select Job Category',
    agriculture: 'Agriculture',
    construction: 'Construction',
    education: 'Education',
    addJob: 'Post a Job',
    location: 'Location',
    jobType: 'Job Category',
    viewDetails: 'View Details',
  },
  
  edu: {
    title: 'Educational Services',
    subtitle: 'Educational resources and learning opportunities for all',
    children: 'For Children',
    women: 'For Women',
    youth: 'For Youth',
    voiceInstructions: 'This is the Educational Services page where you can access digital learning resources. The content is organized in categories for children, women, and youth. Click on any card to access the learning material.',
  },
  
  krishi: {
    title: 'Agricultural Services',
    subtitle: 'Agricultural support and resources for farmers',
    cropTips: 'Crop Management',
    weather: 'Weather Forecasts',
    marketRates: 'Market Rates',
    selectCrop: 'Select Crop',
    selectSeason: 'Select Season',
    voiceInstructions: 'This is the Agricultural Services page where you can find farming advice. You can view crop management techniques, weather forecasts, and market rates. Use the dropdown to select a specific crop or season for advice.',
  },
  
  grievance: {
    title: 'Grievance Reporting',
    subtitle: 'Report and track local issues',
    problemDesc: 'Problem Description',
    location: 'Location',
    uploadImage: 'Upload Image (Optional)',
    submitSuccess: 'Your grievance has been submitted successfully',
    form: {
      descPlaceholder: 'Describe your problem in detail',
      locPlaceholder: 'Enter your village/town name',
      requiredField: 'This field is required',
      minLength: 'Please provide more details',
    },
    voiceInstructions: 'This is the Grievance Reporting page where you can submit issues in your community. Fill in the required fields: problem description and location. You can also upload an image if needed. Click the submit button to send your report.',
  },
  
  eco: {
    title: 'Environmental Services',
    subtitle: 'Environmental initiatives and sustainability programs',
    ecoTips: 'Sustainability Practices',
    waterConservation: 'Water Conservation',
    greenScore: 'Environmental Impact Score',
    yourScore: 'Your Environmental Impact Score',
    trackActivities: 'Track your eco-friendly activities',
    activities: {
      tree: 'Planted a tree',
      waste: 'Segregated waste',
      water: 'Saved water',
      energy: 'Saved energy',
    },
    voiceInstructions: 'This is the Environmental Services page where you can learn about sustainable living practices. You can read sustainability practices and water conservation methods. The Environmental Impact Score section allows you to track your environment-friendly activities.',
  },
  
  charity: {
    title: 'Community Support',
    subtitle: 'Support programs for elderly, disabled, and vulnerable populations',
    description: 'Community Support connects donors with those in need in rural communities. Support campaigns for the elderly, disabled, and other vulnerable groups.',
    categories: {
      elderly: 'Elderly',
      disabled: 'Disabled',
      children: 'Children',
      women: 'Women',
      other: 'Other'
    },
    filters: {
      all: 'All Campaigns',
      active: 'Active',
      completed: 'Completed'
    },
    campaign: {
      create: 'Create Campaign',
      donate: 'Donate',
      share: 'Share',
      update: 'Add Update',
      target: 'Target',
      raised: 'Raised',
      days: 'Days Left',
      beneficiaries: 'Beneficiaries',
      location: 'Location',
      organizer: 'Organizer',
      donors: 'Donors',
      updates: 'Updates',
      noUpdates: 'No updates yet'
    },
    form: {
      title: 'Campaign Title',
      description: 'Campaign Description',
      category: 'Category',
      targetAmount: 'Target Amount',
      endDate: 'End Date',
      village: 'Village',
      district: 'District',
      state: 'State',
      beneficiaries: 'Number of Beneficiaries',
      images: 'Upload Images',
      submit: 'Create Campaign'
    },
    donation: {
      amount: 'Donation Amount',
      message: 'Message (Optional)',
      anonymous: 'Donate Anonymously',
      submit: 'Complete Donation'
    }
  },
  
  auth: {
    name: 'Full Name',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phone: 'Phone Number',
    village: 'Village',
    district: 'District',
    state: 'State',
    language: 'Preferred Language',
    register: 'Register',
    login: 'Login',
    loginPrompt: 'Already have an account?',
    registerPrompt: 'Don\'t have an account?',
    loginSuccess: 'Logged in successfully',
    registerSuccess: 'Registration successful',
    invalidCredentials: 'Invalid email or password',
    requiredField: 'This field is required',
    passwordMismatch: 'Passwords do not match',
    invalidEmail: 'Please enter a valid email address',
    passwordRequirements: 'Password must be at least 8 characters'
  },
  
  profile: {
    title: 'User Profile',
    edit: 'Edit Profile',
    campaigns: 'My Campaigns',
    donations: 'My Donations',
    settings: 'Account Settings',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    save: 'Save Changes',
    uploadPicture: 'Upload Profile Picture',
    dashboard: 'Dashboard',
    grievances: 'My Grievances'
  },
  
  dashboard: {
    welcome: 'Welcome',
    overview: 'Here\'s an overview of your activity',
    loading: 'Loading your dashboard...',
    totalDonations: 'Total Donations',
    activeCampaigns: 'Active Campaigns',
    pendingGrievances: 'Pending Grievances',
    recentActivity: 'Recent Activity',
    viewAll: 'View all',
    noActivity: 'No recent activity found',
    donated: 'Donated',
    created: 'Created',
    submitted: 'Submitted'
  },
  
  status: {
    pending: 'Pending',
    inprogress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
    active: 'Active',
    completed: 'Completed'
  },
  
  voice: {
    start: 'Start Voice Input',
    stop: 'Stop Voice Input',
    speak: 'Speak Text',
    changeLanguage: 'Change Voice Language',
    listening: 'Listening...',
    processingInput: 'Processing your input...',
    langEn: 'English',
    langTe: 'Telugu',
    langHi: 'Hindi'
  },
};