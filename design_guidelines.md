# Smart Tracker IoT Dashboard Design Guidelines

## Design Approach
**System-Based Approach**: Using a modern dark-first design system optimized for utility-focused IoT dashboard functionality, with strategic neon accent implementation.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary (Default)**:
- Background: 0 0% 3% (deep black)
- Surface: 0 0% 8% (charcoal)
- Border: 0 0% 15% (dark gray)
- Text Primary: 0 0% 95% (near white)
- Text Secondary: 0 0% 70% (medium gray)

**Light Mode Alternative**:
- Background: 0 0% 98% (off white)
- Surface: 0 0% 100% (pure white)
- Border: 0 0% 85% (light gray)
- Text Primary: 0 0% 10% (near black)

**Accent Colors**:
- Primary Neon Green: 125 85% 55% (vibrant green for CTAs, active states)
- Success Green: 125 65% 45% (for positive status indicators)
- Warning: 45 95% 60% (for alerts and notifications)
- Error: 0 85% 60% (for critical alerts and SOS features)

### B. Typography
- **Primary Font**: Inter (via Google Fonts CDN)
- **Secondary Font**: JetBrains Mono (for data displays, coordinates)
- **Hierarchy**: 
  - Hero: 3xl-4xl bold
  - Section Headers: xl-2xl semibold
  - Body: base regular
  - Captions/Data: sm medium

### C. Layout System
**Tailwind Spacing Units**: Consistent use of 2, 4, 6, 8, 12, 16 for margins, padding, and gaps.
- Container max-width: 7xl with responsive padding
- Grid systems: 12-column responsive grid
- Card spacing: p-6 with gap-4 between elements

### D. Component Library

**Navigation**:
- Dark sidebar with neon green active indicators
- Clean top navigation bar with user avatar
- Mobile: Bottom tab navigation with icon + label

**Dashboard Components**:
- **Map Widget**: Full-width card with rounded corners, real-time GPS marker in neon green
- **Weather Cards**: Grid layout (2x2 desktop, stacked mobile) with large numeric displays
- **Activity Notifications**: Toast-style cards with timestamp and action buttons
- **Status Indicators**: Dot notation with color coding (green=online, red=offline, yellow=warning)

**Forms**:
- Input fields with subtle borders, focus states in neon green
- Toggle switches for activity reminders
- Emergency contact cards with edit/delete actions

**Buttons**:
- Primary: Neon green background with black text
- Secondary: Transparent with neon green border
- Ghost: Transparent with hover effects
- On hero images: Outline buttons with backdrop blur

### E. Landing Page Specific Design

**Hero Section**:
- Single viewport height with centered content
- Large hero image: Abstract IoT device network visualization with dark gradient overlay
- Typography: Bold white text with neon green accent on key words
- CTA button: Primary neon green with subtle glow effect

**Content Sections** (Maximum 4 total):
1. **Hero**: Device showcase with primary value proposition
2. **Features**: 3-column grid highlighting GPS, Weather, Activity tracking
3. **Benefits**: Split layout with device mockup and feature list
4. **CTA**: Simple signup prompt with social proof

**Visual Treatments**:
- Subtle geometric patterns in background
- Gradient overlays: Dark to transparent (270 0% 5% to 270 0% 20%)
- Strategic use of neon green glows on interactive elements
- High contrast typography for excellent readability

## Images
- **Hero Image**: Modern IoT device in environment (outdoor/nature setting) with subtle tech overlay graphics
- **Feature Icons**: Minimalist line icons for GPS, weather, activity tracking
- **Device Mockups**: Clean product shots on dark backgrounds with neon accent lighting
- **Dashboard Screenshots**: Showing actual interface in use (can be placeholder wireframes initially)

## Key Design Principles
1. **Data Clarity**: Information hierarchy prioritizes real-time sensor data
2. **Status Visibility**: Always-visible connection and device status indicators
3. **Quick Actions**: One-click access to SOS and critical functions
4. **Progressive Disclosure**: Detailed settings hidden behind clean primary interface
5. **Dark-First**: Optimized for prolonged dashboard monitoring with reduced eye strain