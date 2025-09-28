var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activities: () => activities,
  activitiesRelations: () => activitiesRelations,
  devices: () => devices,
  devicesRelations: () => devicesRelations,
  emergencyAlerts: () => emergencyAlerts,
  emergencyAlertsRelations: () => emergencyAlertsRelations,
  emergencyContacts: () => emergencyContacts,
  emergencyContactsRelations: () => emergencyContactsRelations,
  insertActivitySchema: () => insertActivitySchema,
  insertDeviceSchema: () => insertDeviceSchema,
  insertEmergencyAlertSchema: () => insertEmergencyAlertSchema,
  insertEmergencyContactSchema: () => insertEmergencyContactSchema,
  insertLocationSchema: () => insertLocationSchema,
  insertOutfitRecommendationSchema: () => insertOutfitRecommendationSchema,
  insertWeatherDataSchema: () => insertWeatherDataSchema,
  locations: () => locations,
  locationsRelations: () => locationsRelations,
  outfitRecommendations: () => outfitRecommendations,
  outfitRecommendationsRelations: () => outfitRecommendationsRelations,
  sessions: () => sessions,
  users: () => users,
  usersRelations: () => usersRelations,
  weatherData: () => weatherData,
  weatherDataRelations: () => weatherDataRelations
});
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
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
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  location: text("location"),
  preferences: jsonb("preferences").$type().default({
    notifications: true,
    locationSharing: true,
    emergencyMode: false,
    weatherAlerts: true,
    activityReminders: true
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var devices = pgTable("devices", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  serialNumber: varchar("serial_number").unique().notNull(),
  batteryLevel: integer("battery_level").default(100),
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var locations = pgTable("locations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  accuracy: integer("accuracy"),
  // in meters
  speed: decimal("speed", { precision: 5, scale: 2 }),
  // km/h
  address: text("address"),
  timestamp: timestamp("timestamp").defaultNow()
});
var weatherData = pgTable("weather_data", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
  temperature: decimal("temperature", { precision: 4, scale: 2 }),
  // Celsius
  humidity: integer("humidity"),
  // percentage
  pressure: decimal("pressure", { precision: 6, scale: 2 }),
  // hPa
  windSpeed: decimal("wind_speed", { precision: 4, scale: 2 }),
  // km/h
  visibility: integer("visibility"),
  // km
  rainLevel: decimal("rain_level", { precision: 4, scale: 2 }),
  // mm
  condition: varchar("condition"),
  timestamp: timestamp("timestamp").defaultNow()
});
var activities = pgTable("activities", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description"),
  scheduledTime: varchar("scheduled_time"),
  // HH:MM format
  icon: varchar("icon").default("Bell"),
  priority: varchar("priority").default("medium"),
  // high, medium, low
  isEnabled: boolean("is_enabled").default(true),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var outfitRecommendations = pgTable("outfit_recommendations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  items: jsonb("items").$type().notNull(),
  temperature: integer("temperature").notNull(),
  weather: varchar("weather").notNull(),
  confidence: integer("confidence").default(80),
  // percentage
  liked: boolean("liked"),
  // null = no rating, true = liked, false = disliked
  createdAt: timestamp("created_at").defaultNow()
});
var emergencyContacts = pgTable("emergency_contacts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  relationship: varchar("relationship").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var emergencyAlerts = pgTable("emergency_alerts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deviceId: uuid("device_id").notNull().references(() => devices.id, { onDelete: "cascade" }),
  locationId: uuid("location_id").references(() => locations.id),
  isActive: boolean("is_active").default(true),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  devices: many(devices),
  activities: many(activities),
  outfitRecommendations: many(outfitRecommendations),
  emergencyContacts: many(emergencyContacts),
  emergencyAlerts: many(emergencyAlerts)
}));
var devicesRelations = relations(devices, ({ one, many }) => ({
  user: one(users, { fields: [devices.userId], references: [users.id] }),
  locations: many(locations),
  weatherData: many(weatherData),
  emergencyAlerts: many(emergencyAlerts)
}));
var locationsRelations = relations(locations, ({ one }) => ({
  device: one(devices, { fields: [locations.deviceId], references: [devices.id] })
}));
var weatherDataRelations = relations(weatherData, ({ one }) => ({
  device: one(devices, { fields: [weatherData.deviceId], references: [devices.id] })
}));
var activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, { fields: [activities.userId], references: [users.id] })
}));
var outfitRecommendationsRelations = relations(outfitRecommendations, ({ one }) => ({
  user: one(users, { fields: [outfitRecommendations.userId], references: [users.id] })
}));
var emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  user: one(users, { fields: [emergencyContacts.userId], references: [users.id] })
}));
var emergencyAlertsRelations = relations(emergencyAlerts, ({ one }) => ({
  user: one(users, { fields: [emergencyAlerts.userId], references: [users.id] }),
  device: one(devices, { fields: [emergencyAlerts.deviceId], references: [devices.id] }),
  location: one(locations, { fields: [emergencyAlerts.locationId], references: [locations.id] })
}));
var insertDeviceSchema = createInsertSchema(devices).omit({ id: true, createdAt: true });
var insertLocationSchema = createInsertSchema(locations).omit({ id: true, timestamp: true });
var insertWeatherDataSchema = createInsertSchema(weatherData).omit({ id: true, timestamp: true });
var insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true, updatedAt: true });
var insertOutfitRecommendationSchema = createInsertSchema(outfitRecommendations).omit({ id: true, createdAt: true });
var insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({ id: true, createdAt: true, updatedAt: true });
var insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).omit({ id: true, createdAt: true });

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations (mandatory for Replit Auth)
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async updateUserPreferences(userId, preferences) {
    const [user] = await db.update(users).set({ preferences, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId)).returning();
    return user;
  }
  // Device operations
  async createDevice(device) {
    const [newDevice] = await db.insert(devices).values(device).returning();
    return newDevice;
  }
  async getDevicesByUser(userId) {
    return await db.select().from(devices).where(eq(devices.userId, userId));
  }
  async updateDeviceStatus(deviceId, isOnline, batteryLevel) {
    const updates = { isOnline, lastSeen: /* @__PURE__ */ new Date() };
    if (batteryLevel !== void 0) {
      updates.batteryLevel = batteryLevel;
    }
    await db.update(devices).set(updates).where(eq(devices.id, deviceId));
  }
  // Location operations
  async addLocation(location) {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }
  async getLatestLocation(deviceId) {
    const [location] = await db.select().from(locations).where(eq(locations.deviceId, deviceId)).orderBy(desc(locations.timestamp)).limit(1);
    return location;
  }
  async getLocationHistory(deviceId, limit = 50) {
    return await db.select().from(locations).where(eq(locations.deviceId, deviceId)).orderBy(desc(locations.timestamp)).limit(limit);
  }
  // Weather operations
  async addWeatherData(weather) {
    const [newWeather] = await db.insert(weatherData).values(weather).returning();
    return newWeather;
  }
  async getLatestWeather(deviceId) {
    const [weather] = await db.select().from(weatherData).where(eq(weatherData.deviceId, deviceId)).orderBy(desc(weatherData.timestamp)).limit(1);
    return weather;
  }
  async getWeatherHistory(deviceId, limit = 50) {
    return await db.select().from(weatherData).where(eq(weatherData.deviceId, deviceId)).orderBy(desc(weatherData.timestamp)).limit(limit);
  }
  // Activity operations
  async createActivity(activity) {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }
  async getActivitiesByUser(userId) {
    return await db.select().from(activities).where(eq(activities.userId, userId)).orderBy(activities.scheduledTime);
  }
  async updateActivity(activityId, updates) {
    const [activity] = await db.update(activities).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(activities.id, activityId)).returning();
    return activity;
  }
  async toggleActivityCompletion(activityId, isCompleted) {
    const [activity] = await db.update(activities).set({
      isCompleted,
      completedAt: isCompleted ? /* @__PURE__ */ new Date() : null,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(activities.id, activityId)).returning();
    return activity;
  }
  // Outfit recommendation operations
  async createOutfitRecommendation(outfit) {
    const [newOutfit] = await db.insert(outfitRecommendations).values(outfit).returning();
    return newOutfit;
  }
  async getOutfitRecommendations(userId, limit = 10) {
    return await db.select().from(outfitRecommendations).where(eq(outfitRecommendations.userId, userId)).orderBy(desc(outfitRecommendations.createdAt)).limit(limit);
  }
  async rateOutfit(outfitId, liked) {
    const [outfit] = await db.update(outfitRecommendations).set({ liked }).where(eq(outfitRecommendations.id, outfitId)).returning();
    return outfit;
  }
  // Emergency contact operations
  async createEmergencyContact(contact) {
    const [newContact] = await db.insert(emergencyContacts).values(contact).returning();
    return newContact;
  }
  async getEmergencyContacts(userId) {
    return await db.select().from(emergencyContacts).where(eq(emergencyContacts.userId, userId)).orderBy(emergencyContacts.name);
  }
  async updateEmergencyContact(contactId, updates) {
    const [contact] = await db.update(emergencyContacts).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(emergencyContacts.id, contactId)).returning();
    return contact;
  }
  async deleteEmergencyContact(contactId) {
    await db.delete(emergencyContacts).where(eq(emergencyContacts.id, contactId));
  }
  // Emergency alert operations
  async createEmergencyAlert(alert) {
    const [newAlert] = await db.insert(emergencyAlerts).values(alert).returning();
    return newAlert;
  }
  async getActiveEmergencyAlerts(userId) {
    return await db.select().from(emergencyAlerts).where(and(eq(emergencyAlerts.userId, userId), eq(emergencyAlerts.isActive, true))).orderBy(desc(emergencyAlerts.createdAt));
  }
  async resolveEmergencyAlert(alertId) {
    const [alert] = await db.update(emergencyAlerts).set({ isActive: false, resolvedAt: /* @__PURE__ */ new Date() }).where(eq(emergencyAlerts.id, alertId)).returning();
    return alert;
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.put("/api/user/preferences", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferencesSchema = z.object({
        notifications: z.boolean(),
        locationSharing: z.boolean(),
        emergencyMode: z.boolean(),
        weatherAlerts: z.boolean(),
        activityReminders: z.boolean()
      });
      const preferences = preferencesSchema.parse(req.body);
      const user = await storage.updateUserPreferences(userId, preferences);
      res.json(user);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(400).json({ message: "Failed to update preferences" });
    }
  });
  app2.post("/api/devices", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const deviceData = insertDeviceSchema.parse({ ...req.body, userId });
      const device = await storage.createDevice(deviceData);
      res.json(device);
    } catch (error) {
      console.error("Error creating device:", error);
      res.status(400).json({ message: "Failed to create device" });
    }
  });
  app2.get("/api/devices", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const devices2 = await storage.getDevicesByUser(userId);
      res.json(devices2);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });
  app2.put("/api/devices/:deviceId/status", isAuthenticated, async (req, res) => {
    try {
      const { deviceId } = req.params;
      const devices2 = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices2.find((d) => d.id === deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      const deviceStatusSchema = z.object({
        isOnline: z.boolean(),
        batteryLevel: z.number().min(0).max(100).optional()
      });
      const { isOnline, batteryLevel } = deviceStatusSchema.parse(req.body);
      await storage.updateDeviceStatus(deviceId, isOnline, batteryLevel);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating device status:", error);
      res.status(400).json({ message: "Failed to update device status" });
    }
  });
  app2.post("/api/locations", isAuthenticated, async (req, res) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      const devices2 = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices2.find((d) => d.id === locationData.deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      const location = await storage.addLocation(locationData);
      broadcastToDevice(req.body.deviceId, {
        type: "location_update",
        data: location
      });
      res.json(location);
    } catch (error) {
      console.error("Error adding location:", error);
      res.status(400).json({ message: "Failed to add location" });
    }
  });
  app2.get("/api/devices/:deviceId/location", isAuthenticated, async (req, res) => {
    try {
      const { deviceId } = req.params;
      const devices2 = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices2.find((d) => d.id === deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      const location = await storage.getLatestLocation(deviceId);
      if (!location) {
        return res.status(404).json({ message: "No location found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).json({ message: "Failed to fetch location" });
    }
  });
  app2.get("/api/devices/:deviceId/location-history", isAuthenticated, async (req, res) => {
    try {
      const { deviceId } = req.params;
      const devices2 = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices2.find((d) => d.id === deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      const limit = parseInt(req.query.limit) || 50;
      const locations2 = await storage.getLocationHistory(deviceId, limit);
      res.json(locations2);
    } catch (error) {
      console.error("Error fetching location history:", error);
      res.status(500).json({ message: "Failed to fetch location history" });
    }
  });
  app2.post("/api/weather", isAuthenticated, async (req, res) => {
    try {
      const weatherData2 = insertWeatherDataSchema.parse(req.body);
      const devices2 = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices2.find((d) => d.id === weatherData2.deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      const weather = await storage.addWeatherData(weatherData2);
      broadcastToDevice(req.body.deviceId, {
        type: "weather_update",
        data: weather
      });
      res.json(weather);
    } catch (error) {
      console.error("Error adding weather data:", error);
      res.status(400).json({ message: "Failed to add weather data" });
    }
  });
  app2.get("/api/devices/:deviceId/weather", isAuthenticated, async (req, res) => {
    try {
      const { deviceId } = req.params;
      const devices2 = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices2.find((d) => d.id === deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      const weather = await storage.getLatestWeather(deviceId);
      if (!weather) {
        return res.status(404).json({ message: "No weather data found" });
      }
      res.json(weather);
    } catch (error) {
      console.error("Error fetching weather:", error);
      res.status(500).json({ message: "Failed to fetch weather" });
    }
  });
  app2.post("/api/activities", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const activityData = insertActivitySchema.parse({ ...req.body, userId });
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(400).json({ message: "Failed to create activity" });
    }
  });
  app2.get("/api/activities", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const activities2 = await storage.getActivitiesByUser(userId);
      res.json(activities2);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  app2.put("/api/activities/:activityId", isAuthenticated, async (req, res) => {
    try {
      const { activityId } = req.params;
      const updates = req.body;
      const activity = await storage.updateActivity(activityId, updates);
      res.json(activity);
    } catch (error) {
      console.error("Error updating activity:", error);
      res.status(500).json({ message: "Failed to update activity" });
    }
  });
  app2.put("/api/activities/:activityId/toggle", isAuthenticated, async (req, res) => {
    try {
      const { activityId } = req.params;
      const { isCompleted } = req.body;
      const activity = await storage.toggleActivityCompletion(activityId, isCompleted);
      res.json(activity);
    } catch (error) {
      console.error("Error toggling activity:", error);
      res.status(500).json({ message: "Failed to toggle activity" });
    }
  });
  app2.post("/api/outfits", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const outfitData = insertOutfitRecommendationSchema.parse({ ...req.body, userId });
      const outfit = await storage.createOutfitRecommendation(outfitData);
      res.json(outfit);
    } catch (error) {
      console.error("Error creating outfit recommendation:", error);
      res.status(400).json({ message: "Failed to create outfit recommendation" });
    }
  });
  app2.get("/api/outfits", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit) || 10;
      const outfits = await storage.getOutfitRecommendations(userId, limit);
      res.json(outfits);
    } catch (error) {
      console.error("Error fetching outfits:", error);
      res.status(500).json({ message: "Failed to fetch outfits" });
    }
  });
  app2.put("/api/outfits/:outfitId/rate", isAuthenticated, async (req, res) => {
    try {
      const { outfitId } = req.params;
      const { liked } = req.body;
      const outfit = await storage.rateOutfit(outfitId, liked);
      res.json(outfit);
    } catch (error) {
      console.error("Error rating outfit:", error);
      res.status(500).json({ message: "Failed to rate outfit" });
    }
  });
  app2.post("/api/emergency-contacts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const contactData = insertEmergencyContactSchema.parse({ ...req.body, userId });
      const contact = await storage.createEmergencyContact(contactData);
      res.json(contact);
    } catch (error) {
      console.error("Error creating emergency contact:", error);
      res.status(400).json({ message: "Failed to create emergency contact" });
    }
  });
  app2.get("/api/emergency-contacts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const contacts = await storage.getEmergencyContacts(userId);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      res.status(500).json({ message: "Failed to fetch emergency contacts" });
    }
  });
  app2.put("/api/emergency-contacts/:contactId", isAuthenticated, async (req, res) => {
    try {
      const { contactId } = req.params;
      const updates = req.body;
      const contact = await storage.updateEmergencyContact(contactId, updates);
      res.json(contact);
    } catch (error) {
      console.error("Error updating emergency contact:", error);
      res.status(500).json({ message: "Failed to update emergency contact" });
    }
  });
  app2.delete("/api/emergency-contacts/:contactId", isAuthenticated, async (req, res) => {
    try {
      const { contactId } = req.params;
      await storage.deleteEmergencyContact(contactId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
      res.status(500).json({ message: "Failed to delete emergency contact" });
    }
  });
  app2.post("/api/emergency-alerts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const alertData = insertEmergencyAlertSchema.parse({ ...req.body, userId });
      const alert = await storage.createEmergencyAlert(alertData);
      broadcastToUser(userId, {
        type: "emergency_alert",
        data: alert
      });
      res.json(alert);
    } catch (error) {
      console.error("Error creating emergency alert:", error);
      res.status(400).json({ message: "Failed to create emergency alert" });
    }
  });
  app2.get("/api/emergency-alerts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const alerts = await storage.getActiveEmergencyAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching emergency alerts:", error);
      res.status(500).json({ message: "Failed to fetch emergency alerts" });
    }
  });
  app2.put("/api/emergency-alerts/:alertId/resolve", isAuthenticated, async (req, res) => {
    try {
      const { alertId } = req.params;
      const alert = await storage.resolveEmergencyAlert(alertId);
      res.json(alert);
    } catch (error) {
      console.error("Error resolving emergency alert:", error);
      res.status(500).json({ message: "Failed to resolve emergency alert" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const userConnections = /* @__PURE__ */ new Map();
  const deviceConnections = /* @__PURE__ */ new Map();
  wss.on("connection", (ws2, req) => {
    console.log("WebSocket connection established");
    ws2.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === "register_user" && data.userId) {
          if (!userConnections.has(data.userId)) {
            userConnections.set(data.userId, []);
          }
          userConnections.get(data.userId).push(ws2);
          console.log(`User ${data.userId} registered for WebSocket updates`);
        } else if (data.type === "register_device" && data.deviceId) {
          if (!deviceConnections.has(data.deviceId)) {
            deviceConnections.set(data.deviceId, []);
          }
          deviceConnections.get(data.deviceId).push(ws2);
          console.log(`Device ${data.deviceId} registered for WebSocket updates`);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });
    ws2.on("close", () => {
      userConnections.forEach((connections, userId) => {
        const index2 = connections.indexOf(ws2);
        if (index2 !== -1) {
          connections.splice(index2, 1);
          if (connections.length === 0) {
            userConnections.delete(userId);
          }
        }
      });
      deviceConnections.forEach((connections, deviceId) => {
        const index2 = connections.indexOf(ws2);
        if (index2 !== -1) {
          connections.splice(index2, 1);
          if (connections.length === 0) {
            deviceConnections.delete(deviceId);
          }
        }
      });
    });
  });
  function broadcastToUser(userId, message) {
    const connections = userConnections.get(userId);
    if (connections) {
      connections.forEach((ws2) => {
        if (ws2.readyState === WebSocket.OPEN) {
          ws2.send(JSON.stringify(message));
        }
      });
    }
  }
  function broadcastToDevice(deviceId, message) {
    const connections = deviceConnections.get(deviceId);
    if (connections) {
      connections.forEach((ws2) => {
        if (ws2.readyState === WebSocket.OPEN) {
          ws2.send(JSON.stringify(message));
        }
      });
    }
  }
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  base: "/Smart-Tracker/",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
