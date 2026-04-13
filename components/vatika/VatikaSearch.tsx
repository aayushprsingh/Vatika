import { SearchInput } from '@/components/ui/search-input';

export function VatikaSearch() {
  return (
    <div className="relative z-10 -mt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="p-4">
            <SearchInput
              placeholder="Search medicinal plants..."
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
