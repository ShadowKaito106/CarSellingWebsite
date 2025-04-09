'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';
import CustomFilter from '@/components/CustomFilter';
import VehicleCard from '@/components/VehicleCard';
import ShowMore from '@/components/ShowMore';
import { fuels, yearsOfProduction } from '@/constants';
import { fetchVehicles, PaginationResult } from '@/utils';
import { Vehicle, SearchManufacturerProps } from '@/types';

export default function Home() {
  const [manufacturer, setManufacturer] = useState('');
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationResult<Vehicle>['pagination'] | null>(null);
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const getVehicles = async () => {
      setIsLoading(true);
      try {
        const currentPage = Number(searchParams.get('page')) || 1;
        const pageSize = Number(searchParams.get('limit')) || 10;
        
        const result = await fetchVehicles({
          manufacturer: searchParams.get('manufacturer') || '',
          year: Number(searchParams.get('year')) || new Date().getFullYear(),
          fuel: searchParams.get('fuel') || '',
          limit: pageSize,
          page: currentPage,
          model: searchParams.get('model') || '',
        });
        
        setAllVehicles(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setAllVehicles([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    getVehicles();
  }, [searchParams]);

  const isDataEmpty = !Array.isArray(allVehicles) || allVehicles.length < 1 || !allVehicles;

  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        {/* Search and Filters */}
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Vehicle Catalogue</h1>
          <p>Explore our vehicles you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar manufacturer={manufacturer} setManufacturer={setManufacturer} />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>

        {/* Vehicle Listings */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-blue"></div>
          </div>
        ) : !isDataEmpty ? (
          <section>
            <div className="home__vehicles-wrapper">
              {allVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="mt-10 flex justify-center">
                <div className="flex gap-2">
                  {pagination.page > 1 && (
                    <Link
                      href={`/?page=${pagination.page - 1}`}
                      className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      Previous
                    </Link>
                  )}
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      // Calculate page numbers to show (centered around current page)
                      const pageNum = 
                        pagination.pages <= 5 
                          ? i + 1 
                          : Math.min(
                              Math.max(1, pagination.page - 2) + i,
                              pagination.pages
                            );
                      
                      return (
                        <Link
                          key={pageNum}
                          href={`/?page=${pageNum}`}
                          className={`px-4 py-2 border rounded-md ${
                            pagination.page === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>
                  
                  {pagination.page < pagination.pages && (
                    <Link
                      href={`/?page=${pagination.page + 1}`}
                      className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            <p>No vehicles found. Try adjusting your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}
