/**
 * Calculates distance between two coordinates in meters
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
}

/**
 * Estimates walking time in minutes based on distance
 * Assumes average walking speed of 5km/h or ~83m/min
 */
export function calculateWalkingTime(distanceInMeters: number): number {
  const walkingSpeedMeterPerMinute = 83;
  return Math.round(distanceInMeters / walkingSpeedMeterPerMinute);
}

/**
 * Estimates calories burned while walking
 * Formula: (distance in km) * 65 kcal/km for an average person
 */
export function calculateCaloriesBurned(distanceInMeters: number): number {
  const caloriesPerKm = 65;
  const distanceInKm = distanceInMeters / 1000;
  return Math.round(distanceInKm * caloriesPerKm);
}

/**
 * Gets calorie range classification (low, medium, high)
 */
export function getCalorieClass(calories: number): string {
  if (calories <= 400) return "calorie-low";
  if (calories <= 600) return "calorie-medium";
  return "calorie-high";
}
