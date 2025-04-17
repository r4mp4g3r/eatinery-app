import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Restaurant, MenuItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { MapPin, Star, Plus, Clock } from "lucide-react";
import { getCalorieClass } from "@/lib/utils/distance-calculator";

interface RestaurantWithMenuItems extends Restaurant {
  recommendedMenuItems: MenuItem[];
}

export default function Home() {
  const { toast } = useToast();
  const [calorieLimit, setCalorieLimit] = useState<number>(1500);
  const [cuisineType, setCuisineType] = useState<string>("Korean");
  const [mealType, setMealType] = useState<string>("Any Meal");
  const [isHpbHealthy, setIsHpbHealthy] = useState<boolean>(true);
  const [location, setLocation] = useState<string>("Jurong East MRT");

  // Query to filter restaurants based on selections
  const { data: restaurants, isLoading, error } = useQuery<RestaurantWithMenuItems[]>({
    queryKey: ["/api/restaurants/filter"],
    queryFn: async () => {
      const response = await fetch("/api/restaurants/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: calorieLimit,
          cuisineType: cuisineType,
          isHpbHealthy: isHpbHealthy,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      
      return response.json();
    },
  });

  // Handle errors
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load restaurant data. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <div className="pb-6">
      {/* Search Filters */}
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="calorieLimit" className="block text-sm font-medium text-neutral-700 mb-1">
                Daily Calorie Limit
              </label>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setCalorieLimit(1200)}
                  variant={calorieLimit === 1200 ? "default" : "outline"}
                  className={calorieLimit === 1200 ? "bg-primary" : ""}
                >
                  1200 kcal
                </Button>
                <Button
                  onClick={() => setCalorieLimit(1500)}
                  variant={calorieLimit === 1500 ? "default" : "outline"}
                  className={calorieLimit === 1500 ? "bg-primary" : ""}
                >
                  1500 kcal
                </Button>
                <Button
                  onClick={() => setCalorieLimit(1800)}
                  variant={calorieLimit === 1800 ? "default" : "outline"}
                  className={calorieLimit === 1800 ? "bg-primary" : ""}
                >
                  1800 kcal
                </Button>
                <Button
                  onClick={() => setCalorieLimit(2000)}
                  variant={calorieLimit === 2000 ? "default" : "outline"}
                  className={calorieLimit === 2000 ? "bg-primary" : ""}
                >
                  Custom
                </Button>
              </div>
            </div>
            
            <div>
              <label htmlFor="mealType" className="block text-sm font-medium text-neutral-700 mb-1">
                Meal Type
              </label>
              <div className="flex space-x-3 overflow-x-auto pb-1">
                <Button
                  onClick={() => setMealType("Any Meal")}
                  variant={mealType === "Any Meal" ? "default" : "outline"}
                  className={`whitespace-nowrap ${mealType === "Any Meal" ? "bg-primary" : ""}`}
                >
                  Any Meal
                </Button>
                <Button
                  onClick={() => setMealType("Breakfast")}
                  variant={mealType === "Breakfast" ? "default" : "outline"}
                  className={`whitespace-nowrap ${mealType === "Breakfast" ? "bg-primary" : ""}`}
                >
                  Breakfast
                </Button>
                <Button
                  onClick={() => setMealType("Lunch")}
                  variant={mealType === "Lunch" ? "default" : "outline"}
                  className={`whitespace-nowrap ${mealType === "Lunch" ? "bg-primary" : ""}`}
                >
                  Lunch
                </Button>
                <Button
                  onClick={() => setMealType("Dinner")}
                  variant={mealType === "Dinner" ? "default" : "outline"}
                  className={`whitespace-nowrap ${mealType === "Dinner" ? "bg-primary" : ""}`}
                >
                  Dinner
                </Button>
              </div>
            </div>
            
            <div>
              <label htmlFor="cuisine" className="block text-sm font-medium text-neutral-700 mb-1">
                Cuisine Type
              </label>
              <div className="relative">
                <select
                  id="cuisine"
                  name="cuisine"
                  className="block w-full pl-3 pr-10 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary text-neutral-700"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                >
                  <option value="Korean">Korean Food</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Western">Western</option>
                  <option value="Indian">Indian</option>
                  <option value="Thai">Thai</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Singaporean">Local Singaporean</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium text-neutral-700">HPB Healthy Choice</span>
              <Switch
                checked={isHpbHealthy}
                onCheckedChange={setIsHpbHealthy}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Banner */}
      <div className="max-w-screen-xl mx-auto px-4 mb-4">
        <div className="bg-primary/10 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-primary mr-2" />
            <span className="text-sm text-neutral-700 font-medium">Near {location}</span>
          </div>
          <button className="text-primary text-sm font-medium">Change</button>
        </div>
      </div>

      {/* Restaurant Results */}
      <div className="max-w-screen-xl mx-auto px-4 mb-6">
        <h2 className="font-heading font-bold text-lg text-neutral-800 mb-3">
          {isLoading ? "Loading restaurants..." : `Found ${restaurants?.length || 0} ${cuisineType} Restaurants`}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 2 }).map((_, index) => (
              <Card key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <CardContent className="p-4">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </CardContent>
                <div className="p-4 border-t border-neutral-100">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="space-y-3">
                    <div className="h-14 bg-gray-200 rounded"></div>
                    <div className="h-14 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            restaurants?.map((restaurant) => (
              <Card key={restaurant.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        {restaurant.isHpbHealthy && (
                          <span className="bg-success/20 text-success text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                            HPB Healthy Choice
                          </span>
                        )}
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-[#F97316]" />
                          <span className="text-xs font-medium text-neutral-700 ml-1">{restaurant.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-heading font-bold text-neutral-800">{restaurant.name}</h3>
                      <p className="text-sm text-neutral-500">{cuisineType} • {restaurant.isHpbHealthy ? "Healthy Options" : "Casual Dining"}</p>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-neutral-400" />
                        <span className="text-xs text-neutral-500 ml-1">
                          {restaurant.distanceInMeters}m away • {restaurant.walkTimeMinutes} min walk
                        </span>
                        <span className="text-xs font-medium text-success ml-2">
                          +{restaurant.distanceInMeters ? Math.round(restaurant.distanceInMeters / 14) : 0} kcal burn
                        </span>
                      </div>
                    </div>
                    <img 
                      src={restaurant.imageUrl} 
                      alt={`${restaurant.name} restaurant`} 
                      className="w-24 h-24 rounded-lg object-cover" 
                    />
                  </div>
                </CardContent>
                
                <div className="p-4 border-t border-neutral-100">
                  <h4 className="font-medium text-sm text-neutral-700 mb-2">Recommended Meals</h4>
                  <div className="space-y-3">
                    {restaurant.recommendedMenuItems.slice(0, 2).map((menuItem) => (
                      <div key={menuItem.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={menuItem.imageUrl} 
                            alt={menuItem.name} 
                            className="w-14 h-14 rounded object-cover" 
                          />
                          <div className="ml-3">
                            <h5 className="font-medium text-neutral-800">{menuItem.name}</h5>
                            <div className="flex items-center">
                              <span className={`text-sm font-medium ${getCalorieClass(menuItem.calories)}`}>
                                {menuItem.calories} kcal
                              </span>
                              <span className="text-xs text-neutral-500 ml-2">
                                • {menuItem.tags?.[0] || "Healthy option"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 rounded-full bg-primary/10 text-primary">
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <Link href={`/restaurant/${restaurant.id}`}>
                    <a className="mt-3 block w-full py-2 text-center text-sm font-medium text-primary hover:bg-primary/5 rounded-lg">
                      See all healthy options
                    </a>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
        
        {restaurants && restaurants.length > 0 && (
          <button className="mt-6 w-full py-3 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg">
            Show more restaurants
          </button>
        )}
      </div>
    </div>
  );
}
