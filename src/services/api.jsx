export const getSubscriptionDetails = async () => {
  // Check if user is authenticated before making the call
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    // Return a default empty response instead of making the API call
    return { data: null };
  }
  
  try {
    const response = await axiosInstance.get('/api/v1/subscription');
    return response.data;
  } catch (error) {
    // Handle the error quietly without showing a toast
    console.error('Error fetching subscription details:', error);
    return { data: null };
  }
}; 