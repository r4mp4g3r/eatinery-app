import { pgTable, text, serial, integer, boolean, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Restaurant schema
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cuisineType: text("cuisine_type").notNull(),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  rating: real("rating"),
  isHpbHealthy: boolean("is_hpb_healthy").default(false),
  imageUrl: text("image_url"),
  openingHours: text("opening_hours"),
  address: text("address"),
  distanceInMeters: integer("distance_in_meters"),
  walkTimeMinutes: integer("walk_time_minutes"),
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
});

export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurants.$inferSelect;

// Menu Item schema
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  calories: integer("calories").notNull(),
  price: real("price"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fat: integer("fat"),
  imageUrl: text("image_url"),
  isHealthy: boolean("is_healthy").default(false),
  tags: text("tags").array(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

// Walking Direction schema
export const walkingDirections = pgTable("walking_directions", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  steps: jsonb("steps").notNull(),
  totalDistanceMeters: integer("total_distance_meters").notNull(),
  totalTimeMinutes: integer("total_time_minutes").notNull(),
  caloriesBurned: integer("calories_burned").notNull(),
});

export const insertWalkingDirectionSchema = createInsertSchema(walkingDirections).omit({
  id: true,
});

export type InsertWalkingDirection = z.infer<typeof insertWalkingDirectionSchema>;
export type WalkingDirection = typeof walkingDirections.$inferSelect;

// Schemas for filtering
export const calorieFilterSchema = z.object({
  limit: z.number().min(500).max(3000),
  cuisineType: z.string().optional(),
  mealType: z.string().optional(),
  isHpbHealthy: z.boolean().optional(),
});

export type CalorieFilter = z.infer<typeof calorieFilterSchema>;

// Direction step type
export const directionStepSchema = z.object({
  stepNumber: z.number(),
  instruction: z.string(),
  distanceMeters: z.number(),
  timeMinutes: z.number(),
});

export type DirectionStep = z.infer<typeof directionStepSchema>;
