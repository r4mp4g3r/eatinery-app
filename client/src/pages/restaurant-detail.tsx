import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, ChevronLeft, Map, Plus } from "lucide-react";
import { Restaurant, MenuItem } from "@shared/schema";
import LeafletMap from "@/components/ui/leaflet-map";
import { getCalorieClass } from "@/lib/utils/distance-calculator";

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Fetch restaurant details
  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery<Restaurant>({
    queryKey: [`/api/restaurants/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant");
      }
      return response.json();
    },
  });
  
  // Fetch menu items with calorie limit of 600 (can be adjusted)
  const { data: menuItems, isLoading: isLoadingMenu } = useQuery<MenuItem[]>({
    queryKey: [`/api/restaurants/${id}/menu`, 600],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${id}/menu?calorieLimit=600`);
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      return response.json();
    },
    enabled: !!restaurant,
  });
  
  // Handle errors
  const handleError = (error: Error) => {
    toast({
      title: "Error",
      description: error.message || "Something went wrong. Please try again.",
      variant: "destructive",
    });
  };
  
  if (isLoadingRestaurant) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded-t-xl"></div>
          <div className="bg-white p-4 rounded-b-xl">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!restaurant) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <h2 className="text-lg font-bold text-neutral-800 mb-2">Restaurant Not Found</h2>
          <p className="text-neutral-500 mb-4">The restaurant you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <a className="text-primary font-medium">Go back to home</a>
          </Link>
        </div>
      </div>
    );
  }
  
  // Placeholder values for the map
  const currentLocation: [number, number] = [1.3347, 103.7406]; // Jurong East MRT
  const restaurantLocation: [number, number] = [restaurant.latitude || 1.3329, restaurant.longitude || 103.7436];
  
  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="h-40 bg-neutral-200 relative">
          <img 
            src={restaurant.imageUrl || "https://via.placeholder.com/600x400?text=Restaurant"} 
            alt={`${restaurant.name} restaurant`} 
            className="w-full h-full object-cover"
          />
          <Link href="/">
            <div className="absolute top-4 left-4 p-2 rounded-full bg-white/80 backdrop-blur-sm cursor-pointer">
              <ChevronLeft className="h-5 w-5 text-neutral-700" />
            </div>
          </Link>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            {restaurant.isHpbHealthy && (
              <span className="inline-block bg-success text-white text-xs font-medium px-2 py-0.5 rounded-full mb-1">
                HPB Healthy Choice
              </span>
            )}
            <h3 className="font-heading font-bold text-white text-xl">{restaurant.name}</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-[#F97316]" />
              <span className="text-sm font-medium text-neutral-700 ml-1">
                {restaurant.rating} {restaurant.rating && "(258 reviews)"}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-neutral-400" />
              <span className="text-sm text-neutral-500 ml-1">
                Open now • Closes at {restaurant.openingHours ? restaurant.openingHours.split('-')[1].trim() : "10PM"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-neutral-400" />
            <span className="text-sm text-neutral-500 ml-2">{restaurant.address}</span>
          </div>
          
          <div className="rounded-lg mb-4 overflow-hidden" aria-label="Map showing the location of restaurant and walking directions">
            <LeafletMap 
              center={currentLocation} 
              destination={restaurantLocation} 
              className="h-48"
            />
            <div className="bg-white p-2 border border-neutral-200 rounded-b-lg">
              <div className="flex items-center">
                <span className="text-xs font-medium text-neutral-800">
                  {restaurant.distanceInMeters}m away • {restaurant.walkTimeMinutes} min walk
                </span>
                <span className="text-xs font-medium text-success ml-2">
                  +{Math.round((restaurant.distanceInMeters || 0) / 14)} kcal burn
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mb-4">
            <Link href={`/restaurant/${restaurant.id}/directions`}>
              <div className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium flex justify-center items-center cursor-pointer">
                <Map className="h-5 w-5 mr-1" />
                Walking Directions
              </div>
            </Link>
            <Button variant="outline" size="icon" className="p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </Button>
          </div>
        </div>
        
        <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between">
          <h4 className="font-medium text-neutral-800">Healthy Meal Options</h4>
          <div className="flex items-center text-sm text-primary font-medium">
            <span>Showing meals under 600 kcal</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {isLoadingMenu ? (
            // Loading skeleton for menu items
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex justify-between animate-pulse">
                <div className="flex">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="ml-3">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                  </div>
                </div>
              </div>
            ))
          ) : menuItems?.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-neutral-500">No healthy menu items found under 600 calories.</p>
            </div>
          ) : (
            menuItems?.map((menuItem) => (
              <div key={menuItem.id} className="flex justify-between">
                <div className="flex">
                  <img 
                    src={menuItem.imageUrl || "https://via.placeholder.com/400x400?text=Food+Item"} 
                    alt={menuItem.name} 
                    className="w-20 h-20 rounded-lg object-cover" 
                  />
                  <div className="ml-3">
                    <h5 className="font-medium text-neutral-800">{menuItem.name}</h5>
                    <p className="text-sm text-neutral-500 mt-0.5 mb-1">{menuItem.description}</p>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getCalorieClass(menuItem.calories)}`}>
                        {menuItem.calories} kcal
                      </span>
                      <div className="ml-2 pl-2 border-l border-neutral-200">
                        <span className="text-xs text-neutral-500">
                          Protein: {menuItem.protein}g • Carbs: {menuItem.carbs}g • Fat: {menuItem.fat}g
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="font-medium text-neutral-800">${menuItem.price?.toFixed(2)}</span>
                  <Button className="px-3 py-1">Add</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
