'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterState {
  search: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  capacity: string;
  city: string;
}

interface PropertyFilterProps {
    onFilterChange: (filters: FilterState) => void;
}

export default function PropertyFilter({ onFilterChange }: PropertyFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        type: '',
        minPrice: '',
        maxPrice: '',
        capacity: '',
        city: ''
    });

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            type: '',
            minPrice: '',
            maxPrice: '',
            capacity: '',
            city: ''
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search properties..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-2"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filters</span>
                </Button>

                {Object.values(filters).some(v => v !== '') && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="flex items-center space-x-1"
                    >
                        <X className="h-4 w-4" />
                        <span>Clear</span>
                    </Button>
                )}
            </div>

            {/* Filter Options */}
            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Type
                        </label>
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        >
                            <option value="">All Types</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                            <option value="studio">Studio</option>
                        </select>
                    </div>

                    <Input
                        label="City"
                        placeholder="Any city"
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                    />

                    <Input
                        label="Min Price"
                        type="number"
                        placeholder="$0"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />

                    <Input
                        label="Max Price"
                        type="number"
                        placeholder="Any"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />

                    <Input
                        label="Guests"
                        type="number"
                        placeholder="Any"
                        value={filters.capacity}
                        onChange={(e) => handleFilterChange('capacity', e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}