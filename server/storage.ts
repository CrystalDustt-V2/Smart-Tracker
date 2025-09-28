import {
  users,
  devices,
  locations,
  weatherData,
  activities,
  outfitRecommendations,
  emergencyContacts,
  emergencyAlerts,
  type User,
  type UpsertUser,
  type Device,
  type InsertDevice,
  type Location,
  type InsertLocation,
  type WeatherData,
  type InsertWeatherData,
  type Activity,
  type InsertActivity,
  type OutfitRecommendation,
  type InsertOutfitRecommendation,
  type EmergencyContact,
  type InsertEmergencyContact,
  type EmergencyAlert,
  type InsertEmergencyAlert,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, isNull } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPreferences(userId: string, preferences: any): Promise<User>;
  
  // Device operations
  createDevice(device: InsertDevice): Promise<Device>;
  getDevicesByUser(userId: string): Promise<Device[]>;
  updateDeviceStatus(deviceId: string, isOnline: boolean, batteryLevel?: number): Promise<void>;
  
  // Location operations
  addLocation(location: InsertLocation): Promise<Location>;
  getLatestLocation(deviceId: string): Promise<Location | undefined>;
  getLocationHistory(deviceId: string, limit?: number): Promise<Location[]>;
  
  // Weather operations
  addWeatherData(weather: InsertWeatherData): Promise<WeatherData>;
  getLatestWeather(deviceId: string): Promise<WeatherData | undefined>;
  getWeatherHistory(deviceId: string, limit?: number): Promise<WeatherData[]>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByUser(userId: string): Promise<Activity[]>;
  updateActivity(activityId: string, updates: Partial<InsertActivity>): Promise<Activity>;
  toggleActivityCompletion(activityId: string, isCompleted: boolean): Promise<Activity>;
  
  // Outfit recommendation operations
  createOutfitRecommendation(outfit: InsertOutfitRecommendation): Promise<OutfitRecommendation>;
  getOutfitRecommendations(userId: string, limit?: number): Promise<OutfitRecommendation[]>;
  rateOutfit(outfitId: string, liked: boolean): Promise<OutfitRecommendation>;
  
  // Emergency contact operations
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  getEmergencyContacts(userId: string): Promise<EmergencyContact[]>;
  updateEmergencyContact(contactId: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact>;
  deleteEmergencyContact(contactId: string): Promise<void>;
  
  // Emergency alert operations
  createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
  getActiveEmergencyAlerts(userId: string): Promise<EmergencyAlert[]>;
  resolveEmergencyAlert(alertId: string): Promise<EmergencyAlert>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ preferences, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Device operations
  async createDevice(device: InsertDevice): Promise<Device> {
    const [newDevice] = await db.insert(devices).values(device).returning();
    return newDevice;
  }

  async getDevicesByUser(userId: string): Promise<Device[]> {
    return await db.select().from(devices).where(eq(devices.userId, userId));
  }

  async updateDeviceStatus(deviceId: string, isOnline: boolean, batteryLevel?: number): Promise<void> {
    const updates: any = { isOnline, lastSeen: new Date() };
    if (batteryLevel !== undefined) {
      updates.batteryLevel = batteryLevel;
    }
    await db.update(devices).set(updates).where(eq(devices.id, deviceId));
  }

  // Location operations
  async addLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  async getLatestLocation(deviceId: string): Promise<Location | undefined> {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.deviceId, deviceId))
      .orderBy(desc(locations.timestamp))
      .limit(1);
    return location;
  }

  async getLocationHistory(deviceId: string, limit = 50): Promise<Location[]> {
    return await db
      .select()
      .from(locations)
      .where(eq(locations.deviceId, deviceId))
      .orderBy(desc(locations.timestamp))
      .limit(limit);
  }

  // Weather operations
  async addWeatherData(weather: InsertWeatherData): Promise<WeatherData> {
    const [newWeather] = await db.insert(weatherData).values(weather).returning();
    return newWeather;
  }

  async getLatestWeather(deviceId: string): Promise<WeatherData | undefined> {
    const [weather] = await db
      .select()
      .from(weatherData)
      .where(eq(weatherData.deviceId, deviceId))
      .orderBy(desc(weatherData.timestamp))
      .limit(1);
    return weather;
  }

  async getWeatherHistory(deviceId: string, limit = 50): Promise<WeatherData[]> {
    return await db
      .select()
      .from(weatherData)
      .where(eq(weatherData.deviceId, deviceId))
      .orderBy(desc(weatherData.timestamp))
      .limit(limit);
  }

  // Activity operations
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getActivitiesByUser(userId: string): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(activities.scheduledTime);
  }

  async updateActivity(activityId: string, updates: Partial<InsertActivity>): Promise<Activity> {
    const [activity] = await db
      .update(activities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(activities.id, activityId))
      .returning();
    return activity;
  }

  async toggleActivityCompletion(activityId: string, isCompleted: boolean): Promise<Activity> {
    const [activity] = await db
      .update(activities)
      .set({
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(activities.id, activityId))
      .returning();
    return activity;
  }

  // Outfit recommendation operations
  async createOutfitRecommendation(outfit: InsertOutfitRecommendation): Promise<OutfitRecommendation> {
    const [newOutfit] = await db.insert(outfitRecommendations).values(outfit).returning();
    return newOutfit;
  }

  async getOutfitRecommendations(userId: string, limit = 10): Promise<OutfitRecommendation[]> {
    return await db
      .select()
      .from(outfitRecommendations)
      .where(eq(outfitRecommendations.userId, userId))
      .orderBy(desc(outfitRecommendations.createdAt))
      .limit(limit);
  }

  async rateOutfit(outfitId: string, liked: boolean): Promise<OutfitRecommendation> {
    const [outfit] = await db
      .update(outfitRecommendations)
      .set({ liked })
      .where(eq(outfitRecommendations.id, outfitId))
      .returning();
    return outfit;
  }

  // Emergency contact operations
  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [newContact] = await db.insert(emergencyContacts).values(contact).returning();
    return newContact;
  }

  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    return await db
      .select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.userId, userId))
      .orderBy(emergencyContacts.name);
  }

  async updateEmergencyContact(contactId: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact> {
    const [contact] = await db
      .update(emergencyContacts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emergencyContacts.id, contactId))
      .returning();
    return contact;
  }

  async deleteEmergencyContact(contactId: string): Promise<void> {
    await db.delete(emergencyContacts).where(eq(emergencyContacts.id, contactId));
  }

  // Emergency alert operations
  async createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const [newAlert] = await db.insert(emergencyAlerts).values(alert).returning();
    return newAlert;
  }

  async getActiveEmergencyAlerts(userId: string): Promise<EmergencyAlert[]> {
    return await db
      .select()
      .from(emergencyAlerts)
      .where(and(eq(emergencyAlerts.userId, userId), eq(emergencyAlerts.isActive, true)))
      .orderBy(desc(emergencyAlerts.createdAt));
  }

  async resolveEmergencyAlert(alertId: string): Promise<EmergencyAlert> {
    const [alert] = await db
      .update(emergencyAlerts)
      .set({ isActive: false, resolvedAt: new Date() })
      .where(eq(emergencyAlerts.id, alertId))
      .returning();
    return alert;
  }
}

export const storage = new DatabaseStorage();
