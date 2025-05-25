import { useState, useEffect } from 'react';
import TourCard from './TourCard';
import TourFilters from './TourFilters';
import { Tour } from '../types/tour';
import { Loader, WifiOff } from 'lucide-react';
import { toursApi, APIError } from '../services/api';
import { motion } from 'framer-motion';

const TourList = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLocalData, setIsUsingLocalData] = useState(false);
  
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsUsingLocalData(false);
        
        let toursData: Tour[] = [];
        
        // Try to get tours from the API
        try {
          toursData = await toursApi.getAllTours();
        } catch (apiError) {
          // Log the specific API error
          if (apiError instanceof APIError) {
            console.error('API Error:', apiError.message);
          } else {
            console.error('Unexpected error:', apiError);
          }
          
          // Fallback to local JSON if API fails
          console.log('Falling back to local data');
          setIsUsingLocalData(true);
          
          const response = await fetch('/data/tours.json');
          if (!response.ok) {
            throw new Error('Failed to load local tour data');
          }
          
          const data = await response.json();
          toursData = Array.isArray(data) ? data : data.tours;
        }
        
        // Ensure we have an array of tours
        if (!Array.isArray(toursData)) {
          throw new Error('Invalid tours data format');
        }
        
        setTours(toursData);
        setFilteredTours(toursData);
        
        // Calculate min and max prices
        if (toursData.length > 0) {
          const prices = toursData.map((tour: Tour) => tour.price);
          setMinPrice(Math.min(...prices));
          setMaxPrice(Math.max(...prices));
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchTours();
  }, []);

  const handleFilterChange = (filters: {
    search: string;
    priceRange: [number, number];
    duration: string;
    date: string;
  }) => {
    const filtered = tours.filter(tour => {
      // Search filter
      const searchMatch = tour.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          tour.desc.toLowerCase().includes(filters.search.toLowerCase());
      
      // Price range filter
      const priceMatch = tour.price >= filters.priceRange[0] && tour.price <= filters.priceRange[1];
      
      // Duration filter
      let durationMatch = true;
      if (filters.duration) {
        const tourDays = parseInt(tour.duration.split(' ')[0]);
        
        switch (filters.duration) {
          case '1-3 дня':
            durationMatch = tourDays >= 1 && tourDays <= 3;
            break;
          case '4-7 дней':
            durationMatch = tourDays >= 4 && tourDays <= 7;
            break;
          case '8-14 дней':
            durationMatch = tourDays >= 8 && tourDays <= 14;
            break;
          case '15+ дней':
            durationMatch = tourDays >= 15;
            break;
        }
      }
      
      // Date filter
      let dateMatch = true;
      if (filters.date) {
        const filterDate = new Date(filters.date);
        const tourDate = new Date(tour.date);
        dateMatch = tourDate >= filterDate;
      }
      
      return searchMatch && priceMatch && durationMatch && dateMatch;
    });
    
    setFilteredTours(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin mr-2 text-blue-600" size={24} />
        <span>Loading tours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error loading tours</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {isUsingLocalData && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <WifiOff className="h-5 w-5 text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-700">
              Unable to connect to the tour service. Showing locally cached data instead.
            </p>
          </div>
        </div>
      )}
      
      <TourFilters 
        onFilterChange={handleFilterChange} 
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
      
      {filteredTours.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <p className="text-xl text-gray-600 mb-2">No tours found</p>
          <p className="text-gray-500">Try adjusting your filter settings</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredTours.map((tour, index) => (
            <motion.div
              key={tour._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <TourCard tour={tour} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TourList;