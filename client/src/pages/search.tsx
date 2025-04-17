import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin, Filter } from "lucide-react";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(null);
  
  const cuisineOptions = [
    "Korean", "Japanese", "Chinese", "Western", 
    "Indian", "Thai", "Vietnamese", "Singaporean"
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-6">
      <div className="py-4">
        <h1 className="font-heading font-bold text-xl text-neutral-800 mb-4">Search</h1>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Input
            className="w-full pr-10 py-3 pl-4 rounded-xl border-neutral-200"
            placeholder="Search for restaurants or dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Location Banner */}
        <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-neutral-700 font-medium">Near Jurong East MRT</span>
          </div>
          <button className="text-primary text-sm font-medium">Change</button>
        </div>

        {/* Cuisine Filters */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium text-neutral-800">Filter by Cuisine</h2>
            <button className="text-primary text-sm flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              More Filters
            </button>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {cuisineOptions.map((cuisine) => (
              <Button
                key={cuisine}
                onClick={() => setCuisineFilter(cuisine === cuisineFilter ? null : cuisine)}
                variant={cuisine === cuisineFilter ? "default" : "outline"}
                className={`whitespace-nowrap ${cuisine === cuisineFilter ? "bg-primary" : ""}`}
              >
                {cuisine}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Result content */}
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <SearchIcon className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="font-medium text-neutral-800 mb-1">Search for Restaurants</h3>
          <p className="text-sm text-neutral-500 mb-4">
            Find healthy restaurants and dishes based on your preferences.
          </p>
          <Button className="w-full">Try Popular Searches</Button>
        </div>
      </div>
    </div>
  );
}