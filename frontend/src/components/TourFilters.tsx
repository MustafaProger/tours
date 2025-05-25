import { useState, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  minPrice: number;
  maxPrice: number;
}

interface FilterState {
  search: string;
  priceRange: [number, number];
  duration: string;
  date: string;
}

const TourFilters = ({ onFilterChange, minPrice, maxPrice }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [minPrice, maxPrice],
    duration: '',
    date: '',
  });

  // Update price range when min/max values change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [minPrice, maxPrice],
    }));
  }, [minPrice, maxPrice]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      search: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (index: number, value: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > newPriceRange[1]) {
      newPriceRange[1] = value;
    }
    if (index === 1 && value < newPriceRange[0]) {
      newPriceRange[0] = value;
    }
    
    const newFilters = {
      ...filters,
      priceRange: newPriceRange,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = {
      ...filters,
      duration: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      date: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const newFilters = {
      search: '',
      priceRange: [minPrice, maxPrice],
      duration: '',
      date: '',
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-8">
      {/* Search Bar - Always visible */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Поиск туров..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500"
        />
      </div>
      
      {/* Filter Toggle - Mobile */}
      <div className="mt-4 flex items-center justify-between md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-600 font-medium"
        >
          Фильтры
          <ChevronDown size={18} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {Object.values(filters).some(value => 
          Array.isArray(value) 
            ? value[0] !== minPrice || value[1] !== maxPrice
            : value !== '') && (
          <button 
            onClick={resetFilters}
            className="text-blue-600 text-sm flex items-center"
          >
            Сбросить <X size={14} className="ml-1" />
          </button>
        )}
      </div>
      
      {/* Filter Options */}
      <div className={`mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 ${isOpen ? 'block' : 'hidden md:grid'}`}>
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₽)</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
              min={minPrice}
              max={maxPrice}
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
            />
            <span className="text-gray-500">—</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
              min={minPrice}
              max={maxPrice}
              className="w-full border border-gray-200 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        
        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Продолжительность</label>
          <select
            value={filters.duration}
            onChange={handleDurationChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 appearance-none bg-white"
          >
            <option value="">Любая</option>
            <option value="1-3 дня">1-3 дня</option>
            <option value="4-7 дней">4-7 дней</option>
            <option value="8-14 дней">8-14 дней</option>
            <option value="15+ дней">15+ дней</option>
          </select>
        </div>
        
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата начала</label>
          <input
            type="date"
            value={filters.date}
            onChange={handleDateChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2"
          />
        </div>
      </div>
      
      {/* Reset Filters - Desktop */}
      <div className="mt-4 hidden md:flex justify-end">
        {Object.values(filters).some(value => 
          Array.isArray(value) 
            ? value[0] !== minPrice || value[1] !== maxPrice
            : value !== '') && (
          <button 
            onClick={resetFilters}
            className="text-blue-600 text-sm flex items-center hover:text-blue-700"
          >
            Сбросить все фильтры <X size={14} className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TourFilters;