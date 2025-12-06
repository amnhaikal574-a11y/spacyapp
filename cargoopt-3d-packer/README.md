# CargoOpt 3D Packer - Airline Cargo Loading Game

A 3D puzzle/management game where you act as a **Load Master** to efficiently fit passenger luggage into an aircraft cargo hold. Built with React, Three.js, and Supabase.

## 🎮 Game Overview

**CargoOpt 3D Packer** is an interactive 3D game that simulates the real-world challenge of airline cargo loading. Players must strategically place passenger luggage into a limited cargo space while respecting physical constraints and space boundaries.

### Game Mechanics

1. **Flight Selection Screen** - Choose from available flights with detailed cargo hold information
2. **3D Cargo Loading** - Place luggage blocks into the cargo container using an intuitive click-to-place interface
3. **Real-time Feedback** - Visual indicators show placement status and progress
4. **Winning Condition** - Successfully load all passenger bags into the Red Zone (passenger luggage area)

## 🎯 Features

### ✅ Core Features
- **Flight Selector** - Browse and select flights from CSV data
- **3D Visualization** - Interactive Three.js scene with isometric camera view
- **Luggage Queue** - Sidebar showing available and placed bags
- **Collision Detection** - Prevents overlapping luggage blocks
- **Boundary Checking** - Ensures bags stay within the Red Zone
- **Progress Tracking** - Real-time progress bar and bag counter
- **Completion Detection** - Automatic win condition when all bags are loaded

### 🎨 Visual Design
- **Low Poly Aesthetic** - Clean, minimalist 3D design
- **Color-Coded Zones**:
  - 🔴 **Red Zone** - Passenger luggage area (1.05 m³)
  - 🟢 **Green Zone** - Commercial cargo area (locked, 131.10 m³)
  - ⚪ **Wireframe** - Container boundary visualization
- **Dark Theme** - Professional dark UI with slate colors
- **Responsive Layout** - 3D canvas + sidebar luggage queue

## 📊 Data Structure

### CSV Files

#### FLIGHT_AI.csv
Contains flight information with exact column names:
- `Flight Number` - Unique flight identifier (e.g., AB201)
- `Total_space(m³)` - Total cargo hold volume
- `Occupied_space(m³)` - Red Zone volume (passenger luggage area)
- `Free_space(m³)` - Green Zone volume (commercial cargo area)
- Additional fields: Tail Number, Date, Origin, Destination, Aircraft Type, Gross Weight, Passengers

#### USER_AI.csv
Contains passenger luggage information:
- `flight_number` - Associated flight
- `Luggage_volume (m³)` - Individual bag volume
- Additional fields: booking_id, passenger_name

### Example Data
```
Flight AB201 (KUL → BKK, Airbus A330-300)
- Total Space: 132.00 m³
- Red Zone: 1.05 m³ (10 passenger bags)
- Green Zone: 131.10 m³ (commercial cargo)
```

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 15 with App Router
- **3D Graphics**: Three.js + React Three Fiber
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Data Parsing**: PapaParse (CSV)
- **Language**: TypeScript
- **Deployment**: Vercel

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or bun package manager

### Installation Steps

```bash
# Clone the repository
git clone <repository-url>
cd cargoopt-3d-packer

# Install dependencies
npm install
# or
bun install

# Place CSV files in public folder
# - public/FLIGHT_AI.csv
# - public/USER_AI.csv

# Run development server
npm run dev
# or
bun dev

# Open browser
# Navigate to http://localhost:3000
```

## 🎮 How to Play

### Step 1: Select a Flight
1. Open the application
2. View available flights in the dropdown
3. Review cargo hold dimensions and space allocation
4. Click **"Start Loading"** to begin

### Step 2: Load Luggage
1. View the **Luggage Queue** on the right sidebar
2. Click on any passenger bag to place it in the cargo hold
3. The game automatically finds a valid position without collisions
4. Placed bags move to the **"Placed"** section

### Step 3: Complete the Mission
1. Continue placing bags until all are loaded
2. Watch the progress bar fill up
3. When all bags are placed, you'll see the **"🎉 All Bags Loaded!"** message
4. Click **"Back"** to return to flight selection

### Controls
- **Left Click** - Select and place luggage
- **Scroll** - Zoom in/out on the 3D scene
- **Right Click + Drag** - Rotate the 3D view
- **Remove Button (✕)** - Remove a placed bag to reposition it

## 📁 Project Structure

```
cargoopt-3d-packer/
├── app/
│   ├── page.tsx              # Main page component
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── FlightSelector.tsx    # Flight selection screen
│   ├── GameScene.tsx         # 3D game scene
│   ├── LuggageBlock.tsx      # Individual luggage block
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── csvParser.ts          # CSV parsing utilities
├── public/
│   ├── FLIGHT_AI.csv         # Flight data
│   └── USER_AI.csv           # Luggage data
└── package.json
```

## 🔧 Key Components

### FlightSelector.tsx
- Loads flight data from CSV
- Displays flight details and cargo dimensions
- Handles flight selection
- Transitions to game scene

### GameScene.tsx
- Manages 3D scene rendering
- Handles luggage placement logic
- Tracks progress and completion
- Renders sidebar with luggage queue

### LuggageBlock.tsx
- Represents individual luggage items
- Calculates block dimensions from volume
- Implements collision detection
- Provides visual feedback

### csvParser.ts
- Parses FLIGHT_AI.csv and USER_AI.csv
- Handles encoding issues with special characters
- Provides utility functions for data access
- Type-safe data structures

## 🧮 Calculations

### Block Dimensions
Luggage blocks are rendered as perfect cubes calculated from volume:
```
side_length = ∛(volume)
```

Example: 0.061 m³ → 0.393 m cube

### Collision Detection
Uses AABB (Axis-Aligned Bounding Box) collision detection:
```
collision = |pos1.x - pos2.x| < (size1 + size2)/2 &&
            |pos1.y - pos2.y| < (size1 + size2)/2 &&
            |pos1.z - pos2.z| < (size1 + size2)/2
```

### Boundary Checking
Ensures blocks stay within Red Zone:
```
within_bounds = (pos.x ± size/2) within [-width/2, width/2] &&
                (pos.y ± size/2) within [0, height] &&
                (pos.z ± size/2) within [-depth/2, depth/2]
```

## 🎨 Color Scheme

| Element | Color | Purpose |
|---------|-------|---------|
| Red Zone | #ef4444 | Passenger luggage area |
| Green Zone | #22c55e | Commercial cargo (locked) |
| Placed Blocks | #3b82f6 | Successfully placed bags |
| Staging Blocks | #8b5cf6 | Bags in queue |
| Invalid Blocks | #ef4444 | Collision/out of bounds |
| Wireframe | #64748b | Container boundary |

## 📈 Game Statistics

### Flight AB201 (Demo)
- **Total Luggage**: 10 bags
- **Total Volume**: ~0.895 m³
- **Red Zone Capacity**: 1.05 m³
- **Utilization**: ~85%
- **Passengers**: 525

### Luggage Details
| Passenger | Volume (m³) | Booking ID |
|-----------|------------|-----------|
| Patricia Smith | 0.061 | BK2400001 |
| Patricia Williams | 0.120 | BK2400002 |
| Elizabeth Martin | 0.128 | BK2400003 |
| David Hernandez | 0.123 | BK2400004 |
| Susan Martinez | 0.093 | BK2400005 |
| Susan Wilson | 0.061 | BK2400006 |
| Thomas Williams | 0.115 | BK2400007 |
| Robert Martin | 0.072 | BK2400008 |
| Linda Anderson | 0.061 | BK2400009 |
| Robert Jones | 0.061 | BK2400010 |

## 🚀 Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# https://vercel.com/new

# Vercel will automatically deploy on push
```

### Environment Variables
No environment variables required for basic functionality. CSV files are served from the public folder.

## 🐛 Troubleshooting

### CSV Files Not Loading
- Ensure FLIGHT_AI.csv and USER_AI.csv are in the `public/` folder
- Check file encoding (UTF-8 recommended)
- Verify column names match exactly

### 3D Scene Not Rendering
- Check browser console for WebGL errors
- Ensure Three.js dependencies are installed
- Try a different browser (Chrome, Firefox, Safari)

### Blocks Not Visible
- Scroll to zoom in on the scene
- Use right-click drag to rotate the view
- Check that luggage data is loading correctly

## 📝 License

This project is provided as-is for educational and demonstration purposes.

## 👨‍💻 Developer

Built with ❤️ using Next.js, Three.js, and React Three Fiber

---

**Play Now**: [CargoOpt 3D Packer](https://cargoopt-3-d-packer.lindy.site)
