import { 
  Restaurant, InsertRestaurant, 
  MenuItem, InsertMenuItem,
  WalkingDirection, InsertWalkingDirection,
  DirectionStep,
  User, InsertUser 
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Restaurant operations
  getRestaurants(
    cuisineType?: string, 
    isHpbHealthy?: boolean
  ): Promise<Restaurant[]>;
  getRestaurantById(id: number): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  
  // Menu item operations
  getMenuItems(restaurantId: number, calorieLimit?: number): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  
  // Walking directions operations
  getWalkingDirections(restaurantId: number): Promise<WalkingDirection | undefined>;
  createWalkingDirections(walkingDirection: InsertWalkingDirection): Promise<WalkingDirection>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private restaurants: Map<number, Restaurant>;
  private menuItems: Map<number, MenuItem>;
  private walkingDirections: Map<number, WalkingDirection>;
  private userCurrentId: number;
  private restaurantCurrentId: number;
  private menuItemCurrentId: number;
  private walkingDirectionsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.restaurants = new Map();
    this.menuItems = new Map();
    this.walkingDirections = new Map();
    this.userCurrentId = 1;
    this.restaurantCurrentId = 1;
    this.menuItemCurrentId = 1;
    this.walkingDirectionsCurrentId = 1;
    
    // Initialize with some sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Restaurant operations
  async getRestaurants(
    cuisineType?: string, 
    isHpbHealthy?: boolean
  ): Promise<Restaurant[]> {
    let restaurants = Array.from(this.restaurants.values());
    
    if (cuisineType) {
      restaurants = restaurants.filter(r => r.cuisineType === cuisineType);
    }
    
    if (isHpbHealthy !== undefined) {
      restaurants = restaurants.filter(r => r.isHpbHealthy === isHpbHealthy);
    }
    
    return restaurants;
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.restaurantCurrentId++;
    const restaurant: Restaurant = { ...insertRestaurant, id };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  // Menu item operations
  async getMenuItems(restaurantId: number, calorieLimit?: number): Promise<MenuItem[]> {
    let items = Array.from(this.menuItems.values())
      .filter(item => item.restaurantId === restaurantId);
    
    if (calorieLimit) {
      items = items.filter(item => item.calories <= calorieLimit);
    }
    
    return items;
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.menuItemCurrentId++;
    const menuItem: MenuItem = { ...insertMenuItem, id };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  // Walking directions operations
  async getWalkingDirections(restaurantId: number): Promise<WalkingDirection | undefined> {
    return Array.from(this.walkingDirections.values())
      .find(direction => direction.restaurantId === restaurantId);
  }

  async createWalkingDirections(insertWalkingDirection: InsertWalkingDirection): Promise<WalkingDirection> {
    const id = this.walkingDirectionsCurrentId++;
    const walkingDirection: WalkingDirection = { ...insertWalkingDirection, id };
    this.walkingDirections.set(id, walkingDirection);
    return walkingDirection;
  }

  // Initialize data with Korean restaurants
  private initializeData() {
    // Initialize restaurants
    const seoulGarden = this.createRestaurant({
      name: "Seoul Garden",
      cuisineType: "Korean",
      location: "JEM Shopping Mall, #03-14",
      latitude: 1.3329,
      longitude: 103.7436,
      rating: 4.8,
      isHpbHealthy: true,
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      openingHours: "10:00 AM - 10:00 PM",
      address: "JEM Shopping Mall, #03-14, 50 Jurong Gateway Rd",
      distanceInMeters: 650,
      walkTimeMinutes: 8
    });

    const kGrill = this.createRestaurant({
      name: "K-Grill BBQ",
      cuisineType: "Korean",
      location: "Jurong East",
      latitude: 1.3331,
      longitude: 103.7431,
      rating: 4.6,
      isHpbHealthy: false,
      imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      openingHours: "11:00 AM - 9:30 PM",
      address: "Jurong East Street 31, #01-22",
      distanceInMeters: 250,
      walkTimeMinutes: 3
    });

    // Initialize menu items for Seoul Garden
    this.createMenuItem({
      restaurantId: 1,
      name: "Veggie Bibimbap",
      description: "Mixed vegetables, rice, egg, gochujang sauce",
      calories: 420,
      price: 12.90,
      protein: 12,
      carbs: 65,
      fat: 12,
      imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isHealthy: true,
      tags: ["High protein", "Vegetarian"]
    });

    this.createMenuItem({
      restaurantId: 1,
      name: "Soft Tofu Soup",
      description: "Tofu, vegetables, seafood, served with small bowl of rice",
      calories: 310,
      price: 10.90,
      protein: 15,
      carbs: 28,
      fat: 8,
      imageUrl: "https://images.unsplash.com/photo-1533007716222-4b465613a984?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isHealthy: true,
      tags: ["Low carb", "Seafood"]
    });

    this.createMenuItem({
      restaurantId: 1,
      name: "Bulgogi Lettuce Wraps",
      description: "Marinated beef, lettuce leaves, vegetables, dipping sauce",
      calories: 450,
      price: 15.90,
      protein: 28,
      carbs: 18,
      fat: 14,
      imageUrl: "https://images.unsplash.com/photo-1635361184202-ecc9a435388c?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isHealthy: true,
      tags: ["Low carb", "High protein"]
    });

    // Initialize menu items for K-Grill
    this.createMenuItem({
      restaurantId: 2,
      name: "Chicken Bibimbap",
      description: "Rice bowl with chicken, vegetables, and gochujang sauce",
      calories: 580,
      price: 14.90,
      protein: 25,
      carbs: 70,
      fat: 18,
      imageUrl: "https://images.unsplash.com/photo-1583502070936-ebbf8f60bc3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isHealthy: true,
      tags: ["Balanced meal", "High protein"]
    });

    this.createMenuItem({
      restaurantId: 2,
      name: "Bulgogi Lettuce Wraps",
      description: "Korean BBQ beef served with lettuce leaves for wrapping",
      calories: 450,
      price: 16.90,
      protein: 30,
      carbs: 15,
      fat: 18,
      imageUrl: "https://images.unsplash.com/photo-1635361184202-ecc9a435388c?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isHealthy: true,
      tags: ["Low carb", "High protein"]
    });

    // Initialize walking directions
    const seoulGardenDirections: DirectionStep[] = [
      {
        stepNumber: 1,
        instruction: "Exit Jurong East MRT station from Exit A",
        distanceMeters: 150,
        timeMinutes: 2
      },
      {
        stepNumber: 2,
        instruction: "Walk straight along Gateway Drive until you reach JEM mall entrance",
        distanceMeters: 250,
        timeMinutes: 3
      },
      {
        stepNumber: 3,
        instruction: "Enter JEM mall and take the escalator to Level 3",
        distanceMeters: 150,
        timeMinutes: 2
      },
      {
        stepNumber: 4,
        instruction: "Seoul Garden is located at unit #03-14",
        distanceMeters: 100,
        timeMinutes: 1
      }
    ];

    this.createWalkingDirections({
      restaurantId: 1,
      steps: seoulGardenDirections,
      totalDistanceMeters: 650,
      totalTimeMinutes: 8,
      caloriesBurned: 45
    });

    const kGrillDirections: DirectionStep[] = [
      {
        stepNumber: 1,
        instruction: "Exit Jurong East MRT station from Exit B",
        distanceMeters: 100,
        timeMinutes: 1
      },
      {
        stepNumber: 2,
        instruction: "Walk straight along Jurong East Street 31",
        distanceMeters: 150,
        timeMinutes: 2
      }
    ];

    this.createWalkingDirections({
      restaurantId: 2,
      steps: kGrillDirections,
      totalDistanceMeters: 250,
      totalTimeMinutes: 3,
      caloriesBurned: 18
    });
  }
}

export const storage = new MemStorage();
