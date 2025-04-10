import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SearchManufacturerProps } from '@/types';
import SearchManufacturer from './SearchManufacturer';

const SearchButton = ({ otherClasses }: { otherClasses: string }) => (
  <button type="submit" className={`-ml-3 z-10 ${otherClasses}`}>
    <Image
      src="/magnifying-glass.svg"
      alt="magnifying glass"
      width={40}
      height={40}
      className="object-contain"
    />
  </button>
);

const SearchBar = ({ manufacturer, setManufacturer }: SearchManufacturerProps) => {
  const [searchModel, setSearchModel] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!manufacturer && !searchModel) {
      return alert('Please fill in the search bar');
    }

    updateSearchParams(
      searchModel?.toLowerCase() || '',
      manufacturer?.toLowerCase() || ''
    );
  };

  const updateSearchParams = (model: string, manufacturer: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    if (model) {
      searchParams.set('model', model);
    } else {
      searchParams.delete('model');
    }

    if (manufacturer) {
      searchParams.set('manufacturer', manufacturer);
    } else {
      searchParams.delete('manufacturer');
    }

    const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

    router.push(newPathname);
  };

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div className="searchbar__item">
        <SearchManufacturer
          manufacturer={manufacturer}
          setManufacturer={setManufacturer}
        />
      </div>
      <div className="searchbar__item">
        <Image
          src="/model-icon.png"
          width={25}
          height={25}
          alt="car model"
          className="absolute w-[20px] h-[20px] ml-4"
        />
        <input
          type="text"
          name="model"
          value={searchModel}
          onChange={(e) => setSearchModel(e.target.value)}
          placeholder="Tiguan"
          className="searchbar__input"
        />
      </div>
      <SearchButton otherClasses="max-sm:hidden bg-primary-blue rounded-full p-2 hover:bg-primary-blue/80" />
    </form>
  );
};

export default SearchBar; 