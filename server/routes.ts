import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { calorieFilterSchema } from "@shared/schema";
import { setupAuth } from "./auth.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  // Get all restaurants with filters
  app.get("/api/restaurants", async (req, res) => {
    try {
      const cuisineType = req.query.cuisineType as string | undefined;
      const isHpbHealthy = req.query.isHpbHealthy !== undefined 
        ? req.query.isHpbHealthy === 'true' 
        : undefined;
      
      const restaurants = await storage.getRestaurants(cuisineType, isHpbHealthy);
      
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  // Get a specific restaurant by ID
  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const restaurant = await storage.getRestaurantById(id);
      
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurant" });
    }
  });

  // Get menu items for a restaurant
  app.get("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const calorieLimit = req.query.calorieLimit 
        ? parseInt(req.query.calorieLimit as string) 
        : undefined;
      
      const menuItems = await storage.getMenuItems(restaurantId, calorieLimit);
      
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Get walking directions to a restaurant
  app.get("/api/restaurants/:id/directions", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const directions = await storage.getWalkingDirections(restaurantId);
      
      if (!directions) {
        return res.status(404).json({ error: "Walking directions not found" });
      }
      
      res.json(directions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch walking directions" });
    }
  });

  // Filter restaurants by calorie limit and cuisine type
  app.post("/api/restaurants/filter", async (req, res) => {
    try {
      const validationResult = calorieFilterSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid filter parameters",
          details: validationResult.error.format()
        });
      }
      
      const { limit, cuisineType, isHpbHealthy } = validationResult.data;
      
      // First, get the restaurants based on cuisine type
      const restaurants = await storage.getRestaurants(cuisineType, isHpbHealthy);
      
      // For each restaurant, get menu items within calorie limit
      const results = await Promise.all(
        restaurants.map(async (restaurant) => {
          const menuItems = await storage.getMenuItems(restaurant.id, limit);
          
          // Only include restaurants that have menu items within the calorie limit
          if (menuItems.length > 0) {
            return {
              ...restaurant,
              recommendedMenuItems: menuItems
            };
          }
          return null;
        })
      );
      
      // Filter out null values
      const filteredResults = results.filter(result => result !== null);
      
      res.json(filteredResults);
    } catch (error) {
      res.status(500).json({ error: "Failed to filter restaurants" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
