import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  location: text("location"),
  preferences: jsonb("preferences").$type<{
    notifications: boolean;
    locationSharing: boolean;
    emergencyMode: boolean;
    weatherAlerts: boolean;
    activityReminders: boolean;
  }>().default({
    notifications: true,
    locationSharing: true,
    emergencyMode: false,
    weatherAlerts: true,
    activityReminders: true,
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Smart Tracker devices
export const devices = pgTable("devices", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  serialNumber: varchar("serial_number").unique().notNull(),
  batteryLevel: integer("battery_level").default(100),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// GPS Location tracking
export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  accuracy: integer("accuracy"), // in meters
  speed: decimal("speed", { precision: 5, scale: 2 }), // km/h
  address: text("address"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Weather sensor data
export const weatherData = pgTable("weather_data", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
  temperature: decimal("temperature", { precision: 4, scale: 2 }), // Celsius
  humidity: integer("humidity"), // percentage
  pressure: decimal("pressure", { precision: 6, scale: 2 }), // hPa
  windSpeed: decimal("wind_speed", { precision: 4, scale: 2 }), // km/h
  visibility: integer("visibility"), // km
  rainLevel: decimal("rain_level", { precision: 4, scale: 2 }), // mm
  condition: varchar("condition"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Activity reminders and schedules
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description"),
  scheduledTime: varchar("scheduled_time"), // HH:MM format
  icon: varchar("icon").default("Bell"),
  priority: varchar("priority").default("medium"), // high, medium, low
  isEnabled: boolean("is_enabled").default(true),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// WeatherFit outfit recommendations
export const outfitRecommendations = pgTable("outfit_recommendations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  items: jsonb("items").$type<string[]>().notNull(),
  temperature: integer("temperature").notNull(),
  weather: varchar("weather").notNull(),
  confidence: integer("confidence").default(80), // percentage
  liked: boolean("liked"), // null = no rating, true = liked, false = disliked
  createdAt: timestamp("created_at").defaultNow(),
});

// Emergency contacts
export const emergencyContacts = pgTable("emergency_contacts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  relationship: varchar("relationship").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emergency alerts/SOS events
export const emergencyAlerts = pgTable("emergency_alerts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
  locationId: uuid("location_id").references(() => locations.id),
  isActive: boolean("is_active").default(true),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  devices: many(devices),
  activities: many(activities),
  outfitRecommendations: many(outfitRecommendations),
  emergencyContacts: many(emergencyContacts),
  emergencyAlerts: many(emergencyAlerts),
}));

export const devicesRelations = relations(devices, ({ one, many }) => ({
  user: one(users, { fields: [devices.userId], references: [users.id] }),
  locations: many(locations),
  weatherData: many(weatherData),
  emergencyAlerts: many(emergencyAlerts),
}));

export const locationsRelations = relations(locations, ({ one }) => ({
  device: one(devices, { fields: [locations.deviceId], references: [devices.id] }),
}));

export const weatherDataRelations = relations(weatherData, ({ one }) => ({
  device: one(devices, { fields: [weatherData.deviceId], references: [devices.id] }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, { fields: [activities.userId], references: [users.id] }),
}));

export const outfitRecommendationsRelations = relations(outfitRecommendations, ({ one }) => ({
  user: one(users, { fields: [outfitRecommendations.userId], references: [users.id] }),
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  user: one(users, { fields: [emergencyContacts.userId], references: [users.id] }),
}));

export const emergencyAlertsRelations = relations(emergencyAlerts, ({ one }) => ({
  user: one(users, { fields: [emergencyAlerts.userId], references: [users.id] }),
  device: one(devices, { fields: [emergencyAlerts.deviceId], references: [devices.id] }),
  location: one(locations, { fields: [emergencyAlerts.locationId], references: [locations.id] }),
}));

// Zod schemas for validation
export const insertDeviceSchema = createInsertSchema(devices).omit({ id: true, createdAt: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true, timestamp: true });
export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({ id: true, timestamp: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOutfitRecommendationSchema = createInsertSchema(outfitRecommendations).omit({ id: true, createdAt: true });
export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertOutfitRecommendation = z.infer<typeof insertOutfitRecommendationSchema>;
export type OutfitRecommendation = typeof outfitRecommendations.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;
export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;
