import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertDeviceSchema,
  insertLocationSchema,
  insertWeatherDataSchema,
  insertActivitySchema,
  insertOutfitRecommendationSchema,
  insertEmergencyContactSchema,
  insertEmergencyAlertSchema,
} from "@shared/schema";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  user?: {
    claims?: {
      sub: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      profile_image_url?: string;
    };
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.put('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate preferences with Zod schema
      const preferencesSchema = z.object({
        notifications: z.boolean(),
        locationSharing: z.boolean(),
        emergencyMode: z.boolean(),
        weatherAlerts: z.boolean(),
        activityReminders: z.boolean(),
      });
      
      const preferences = preferencesSchema.parse(req.body);
      const user = await storage.updateUserPreferences(userId, preferences);
      res.json(user);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(400).json({ message: "Failed to update preferences" });
    }
  });

  // Device management routes
  app.post('/api/devices', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/devices', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const devices = await storage.getDevicesByUser(userId);
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  app.put('/api/devices/:deviceId/status', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId } = req.params;
      
      // Verify device ownership
      const devices = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices.find(d => d.id === deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      
      // Validate request body
      const deviceStatusSchema = z.object({
        isOnline: z.boolean(),
        batteryLevel: z.number().min(0).max(100).optional(),
      });
      
      const { isOnline, batteryLevel } = deviceStatusSchema.parse(req.body);
      await storage.updateDeviceStatus(deviceId, isOnline, batteryLevel);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating device status:", error);
      res.status(400).json({ message: "Failed to update device status" });
    }
  });

  // Location tracking routes
  app.post('/api/locations', isAuthenticated, async (req: any, res) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      
      // Verify device ownership
      const devices = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices.find(d => d.id === locationData.deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      
      const location = await storage.addLocation(locationData);
      
      // Broadcast location update via WebSocket
      broadcastToDevice(req.body.deviceId, {
        type: 'location_update',
        data: location
      });
      
      res.json(location);
    } catch (error) {
      console.error("Error adding location:", error);
      res.status(400).json({ message: "Failed to add location" });
    }
  });

  app.get('/api/devices/:deviceId/location', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId } = req.params;
      
      // Verify device ownership
      const devices = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices.find(d => d.id === deviceId);
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

  app.get('/api/devices/:deviceId/location-history', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId } = req.params;
      
      // Verify device ownership
      const devices = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices.find(d => d.id === deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      
      const limit = parseInt(req.query.limit as string) || 50;
      const locations = await storage.getLocationHistory(deviceId, limit);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching location history:", error);
      res.status(500).json({ message: "Failed to fetch location history" });
    }
  });

  // Weather data routes
  app.post('/api/weather', isAuthenticated, async (req: any, res) => {
    try {
      const weatherData = insertWeatherDataSchema.parse(req.body);
      
      // Verify device ownership
      const devices = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices.find(d => d.id === weatherData.deviceId);
      if (!device) {
        return res.status(403).json({ message: "Device not found or access denied" });
      }
      
      const weather = await storage.addWeatherData(weatherData);
      
      // Broadcast weather update via WebSocket
      broadcastToDevice(req.body.deviceId, {
        type: 'weather_update',
        data: weather
      });
      
      res.json(weather);
    } catch (error) {
      console.error("Error adding weather data:", error);
      res.status(400).json({ message: "Failed to add weather data" });
    }
  });

  app.get('/api/devices/:deviceId/weather', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId } = req.params;
      
      // Verify device ownership
      const devices = await storage.getDevicesByUser(req.user.claims.sub);
      const device = devices.find(d => d.id === deviceId);
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

  // Activity management routes
  app.post('/api/activities', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activities = await storage.getActivitiesByUser(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.put('/api/activities/:activityId', isAuthenticated, async (req: any, res) => {
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

  app.put('/api/activities/:activityId/toggle', isAuthenticated, async (req: any, res) => {
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

  // Outfit recommendation routes
  app.post('/api/outfits', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/outfits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const outfits = await storage.getOutfitRecommendations(userId, limit);
      res.json(outfits);
    } catch (error) {
      console.error("Error fetching outfits:", error);
      res.status(500).json({ message: "Failed to fetch outfits" });
    }
  });

  app.put('/api/outfits/:outfitId/rate', isAuthenticated, async (req: any, res) => {
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

  // Emergency contact routes
  app.post('/api/emergency-contacts', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/emergency-contacts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contacts = await storage.getEmergencyContacts(userId);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching emergency contacts:", error);
      res.status(500).json({ message: "Failed to fetch emergency contacts" });
    }
  });

  app.put('/api/emergency-contacts/:contactId', isAuthenticated, async (req: any, res) => {
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

  app.delete('/api/emergency-contacts/:contactId', isAuthenticated, async (req: any, res) => {
    try {
      const { contactId } = req.params;
      await storage.deleteEmergencyContact(contactId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
      res.status(500).json({ message: "Failed to delete emergency contact" });
    }
  });

  // Emergency alert routes
  app.post('/api/emergency-alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alertData = insertEmergencyAlertSchema.parse({ ...req.body, userId });
      const alert = await storage.createEmergencyAlert(alertData);
      
      // Broadcast SOS alert via WebSocket to all connected clients for this user
      broadcastToUser(userId, {
        type: 'emergency_alert',
        data: alert
      });
      
      res.json(alert);
    } catch (error) {
      console.error("Error creating emergency alert:", error);
      res.status(400).json({ message: "Failed to create emergency alert" });
    }
  });

  app.get('/api/emergency-alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alerts = await storage.getActiveEmergencyAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching emergency alerts:", error);
      res.status(500).json({ message: "Failed to fetch emergency alerts" });
    }
  });

  app.put('/api/emergency-alerts/:alertId/resolve', isAuthenticated, async (req: any, res) => {
    try {
      const { alertId } = req.params;
      const alert = await storage.resolveEmergencyAlert(alertId);
      res.json(alert);
    } catch (error) {
      console.error("Error resolving emergency alert:", error);
      res.status(500).json({ message: "Failed to resolve emergency alert" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store WebSocket connections by user ID and device ID
  const userConnections = new Map<string, WebSocket[]>();
  const deviceConnections = new Map<string, WebSocket[]>();

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket connection established');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'register_user' && data.userId) {
          // Register user connection
          if (!userConnections.has(data.userId)) {
            userConnections.set(data.userId, []);
          }
          userConnections.get(data.userId)!.push(ws);
          console.log(`User ${data.userId} registered for WebSocket updates`);
        } else if (data.type === 'register_device' && data.deviceId) {
          // Register device connection
          if (!deviceConnections.has(data.deviceId)) {
            deviceConnections.set(data.deviceId, []);
          }
          deviceConnections.get(data.deviceId)!.push(ws);
          console.log(`Device ${data.deviceId} registered for WebSocket updates`);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      // Clean up connections
      userConnections.forEach((connections, userId) => {
        const index = connections.indexOf(ws);
        if (index !== -1) {
          connections.splice(index, 1);
          if (connections.length === 0) {
            userConnections.delete(userId);
          }
        }
      });

      deviceConnections.forEach((connections, deviceId) => {
        const index = connections.indexOf(ws);
        if (index !== -1) {
          connections.splice(index, 1);
          if (connections.length === 0) {
            deviceConnections.delete(deviceId);
          }
        }
      });
    });
  });

  // Helper functions for broadcasting WebSocket messages
  function broadcastToUser(userId: string, message: any) {
    const connections = userConnections.get(userId);
    if (connections) {
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      });
    }
  }

  function broadcastToDevice(deviceId: string, message: any) {
    const connections = deviceConnections.get(deviceId);
    if (connections) {
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      });
    }
  }

  return httpServer;
}
