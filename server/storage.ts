import { 
  Restaurant, InsertRestaurant, 
  MenuItem, InsertMenuItem,
  WalkingDirection, InsertWalkingDirection,
  DirectionStep,
  User, InsertUser,
  users, restaurants, menuItems, walkingDirections
} from "@shared/schema";
import { db } from "./db";
import { eq, and, lte } from "drizzle-orm";

// Storage interface
import session from "express-session";
import connectPg from "connect-pg-simple";

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
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      tableName: 'session',
      createTableIfMissing: true,
      pool: db.client
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Restaurant operations
  async getRestaurants(
    cuisineType?: string, 
    isHpbHealthy?: boolean
  ): Promise<Restaurant[]> {
    let query = db.select().from(restaurants);
    
    // Apply filters if provided
    const filters = [];
    if (cuisineType) {
      filters.push(eq(restaurants.cuisineType, cuisineType));
    }
    
    if (isHpbHealthy !== undefined) {
      filters.push(eq(restaurants.isHpbHealthy, isHpbHealthy));
    }
    
    if (filters.length > 0) {
      query = query.where(and(...filters));
    }
    
    return await query;
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant;
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const [restaurant] = await db.insert(restaurants).values(insertRestaurant).returning();
    return restaurant;
  }

  // Menu item operations
  async getMenuItems(restaurantId: number, calorieLimit?: number): Promise<MenuItem[]> {
    if (calorieLimit) {
      return await db.select().from(menuItems).where(
        and(
          eq(menuItems.restaurantId, restaurantId),
          lte(menuItems.calories, calorieLimit)
        )
      );
    } else {
      return await db.select().from(menuItems).where(
        eq(menuItems.restaurantId, restaurantId)
      );
    }
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem;
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db.insert(menuItems).values(insertMenuItem).returning();
    return menuItem;
  }

  // Walking directions operations
  async getWalkingDirections(restaurantId: number): Promise<WalkingDirection | undefined> {
    const [direction] = await db.select().from(walkingDirections).where(eq(walkingDirections.restaurantId, restaurantId));
    return direction;
  }

  async createWalkingDirections(insertWalkingDirection: InsertWalkingDirection): Promise<WalkingDirection> {
    const [walkingDirection] = await db.insert(walkingDirections).values(insertWalkingDirection).returning();
    return walkingDirection;
  }

  // Initialize sample data
  async initializeData() {
    // Check if we already have restaurants
    const existingRestaurants = await db.select().from(restaurants);
    if (existingRestaurants.length > 0) {
      console.log("Database already contains data, skipping initialization");
      return;
    }

    console.log("Initializing database with sample data");

    // Initialize restaurants
    const [seoulGarden] = await db.insert(restaurants).values({
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
    }).returning();

    const [kGrill] = await db.insert(restaurants).values({
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
    }).returning();

    // Initialize menu items for Seoul Garden
    await db.insert(menuItems).values([
      {
        restaurantId: seoulGarden.id,
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
      },
      {
        restaurantId: seoulGarden.id,
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
      },
      {
        restaurantId: seoulGarden.id,
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
      }
    ]);

    // Initialize menu items for K-Grill
    await db.insert(menuItems).values([
      {
        restaurantId: kGrill.id,
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
      },
      {
        restaurantId: kGrill.id,
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
      }
    ]);

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

    await db.insert(walkingDirections).values({
      restaurantId: seoulGarden.id,
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

    await db.insert(walkingDirections).values({
      restaurantId: kGrill.id,
      steps: kGrillDirections,
      totalDistanceMeters: 250,
      totalTimeMinutes: 3,
      caloriesBurned: 18
    });

    console.log("Database initialization complete");
  }
}

// Create and export the storage instance
export const storage = new DatabaseStorage();
