import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, TrendingUp, Map, MapPin } from "lucide-react";
import { Restaurant, WalkingDirection, DirectionStep } from "@shared/schema";
import LeafletMap from "@/components/ui/leaflet-map";
import { useState } from "react";

export default function WalkingDirections() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [walkingStarted, setWalkingStarted] = useState(false);
  
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
  
  // Fetch walking directions
  const { data: directions, isLoading: isLoadingDirections } = useQuery<WalkingDirection>({
    queryKey: [`/api/restaurants/${id}/directions`],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/${id}/directions`);
      if (!response.ok) {
        throw new Error("Failed to fetch walking directions");
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
  
  if (isLoadingRestaurant || isLoadingDirections) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-56 bg-gray-200 rounded-t-xl"></div>
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
  
  if (!restaurant || !directions) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <h2 className="text-lg font-bold text-neutral-800 mb-2">Information Not Found</h2>
          <p className="text-neutral-500 mb-4">The walking directions you're looking for couldn't be loaded.</p>
          <Link href="/">
            <div className="text-primary font-medium cursor-pointer">Go back to home</div>
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
      <h2 className="font-heading font-bold text-lg text-neutral-800 mb-3">Walking Directions</h2>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-56 bg-neutral-200 relative" aria-label="Map showing walking route to restaurant">
          <LeafletMap 
            center={currentLocation} 
            destination={restaurantLocation} 
            className="h-56"
          />
          <Link href={`/restaurant/${restaurant.id}`}>
            <div className="absolute top-4 left-4 p-2 rounded-full bg-white/80 backdrop-blur-sm cursor-pointer">
              <ChevronLeft className="h-5 w-5 text-neutral-700" />
            </div>
          </Link>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-heading font-bold text-neutral-800">{restaurant.name}</h3>
              <p className="text-sm text-neutral-500">{restaurant.location}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-2">
              <div className="text-center">
                <span className="block text-xl font-bold text-primary">+{directions.caloriesBurned}</span>
                <span className="text-xs text-neutral-600">kcal burn</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <span className="block text-sm font-medium text-neutral-800">{directions.totalTimeMinutes} min</span>
                <span className="text-xs text-neutral-500">Walking time</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <span className="block text-sm font-medium text-neutral-800">{directions.totalDistanceMeters} m</span>
                <span className="text-xs text-neutral-500">Distance</span>
              </div>
            </div>
          </div>
          
          <div className="border border-neutral-200 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-sm text-neutral-700 mb-2">Walking Directions</h4>
            
            <div className="space-y-3">
              {(directions.steps as DirectionStep[]).map((step: DirectionStep, index: number) => (
                <div key={index} className="flex">
                  <div className="mr-3 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
                      {step.stepNumber}
                    </div>
                    {index < (directions.steps as DirectionStep[]).length - 1 && (
                      <div className="w-0.5 h-full bg-neutral-200 my-1"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-neutral-800">{step.instruction}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {step.timeMinutes} min ({step.distanceMeters}m)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                // Create Google Maps URL with origin and destination
                const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation[0]},${currentLocation[1]}&destination=${restaurantLocation[0]},${restaurantLocation[1]}&travelmode=walking`;
                // Open in new tab
                window.open(mapUrl, '_blank');
                toast({
                  title: "Opened in Google Maps",
                  description: "Directions have been opened in Google Maps",
                });
              }}
            >
              <Map className="h-4 w-4 mr-2" />
              Open in Maps
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                setWalkingStarted(!walkingStarted);
                toast({
                  title: walkingStarted ? "Walking paused" : "Walking started",
                  description: walkingStarted 
                    ? "You've paused your walking journey." 
                    : "Your walking journey has started! Follow the directions.",
                });
              }}
            >
              {walkingStarted ? "Pause Walking" : "Start Walking"}
            </Button>
          </div>
          
          {walkingStarted && (
            <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mr-3">
                  <MapPin className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-success">Walking in Progress</h4>
                  <p className="text-sm text-neutral-700">
                    {directions.totalTimeMinutes} min • {directions.totalDistanceMeters}m • {directions.caloriesBurned} kcal
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
