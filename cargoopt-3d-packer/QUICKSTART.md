# CargoOpt 3D Packer - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Play Online (Recommended)
Simply visit: **[https://cargoopt-3-d-packer.lindy.site](https://cargoopt-3-d-packer.lindy.site)**

No installation required! The game is fully playable in your browser.

---

### Option 2: Run Locally

#### Prerequisites
- Node.js 18+ installed
- npm or bun package manager

#### Installation Steps

```bash
# 1. Clone or download the project
cd cargoopt-3d-packer

# 2. Install dependencies
npm install
# or
bun install

# 3. Start development server
npm run dev
# or
bun dev

# 4. Open in browser
# Navigate to http://localhost:3000
```

#### Build for Production

```bash
npm run build
npm start
```

---

## 🎮 How to Play

### Step 1: Select a Flight
1. Open the application
2. You'll see the **Flight Selector** screen
3. Flight **AB201** (KUL → BKK) is pre-selected
4. Review the cargo hold dimensions:
   - **Total Space**: 132.00 m³
   - **Red Zone** (Passenger): 1.05 m³
   - **Green Zone** (Commercial): 131.10 m³
5. Click **"Start Loading →"** button

### Step 2: Load Luggage
1. You'll see the **3D Game Scene** with:
   - **Left**: 3D cargo container visualization
   - **Right**: Luggage Queue sidebar
2. The sidebar shows 10 passenger bags ready to load
3. **Click on any bag** to automatically place it in the cargo hold
4. Watch the progress bar fill up as you load bags

### Step 3: Complete the Mission
1. Continue clicking bags until all 10 are loaded
2. When complete, you'll see: **"🎉 All Bags Loaded!"**
3. Click **"Back"** to return to flight selector

---

## 🎮 Game Controls

| Action | Control |
|--------|---------|
| **Place Bag** | Click on bag in the queue |
| **Remove Bag** | Click ✕ button on placed bag |
| **Zoom In/Out** | Scroll mouse wheel |
| **Rotate View** | Right-click + drag |
| **Return to Menu** | Click "Back" button |

---

## 📊 Game Data

### Flight AB201
- **Route**: Kuala Lumpur (KUL) → Bangkok (BKK)
- **Aircraft**: Airbus A330-300
- **Passengers**: 525
- **Date**: 2024-12-01

### Passenger Luggage (10 bags)
| Passenger | Volume | Booking ID |
|-----------|--------|-----------|
| Patricia Smith | 0.061 m³ | BK2400001 |
| Patricia Williams | 0.120 m³ | BK2400002 |
| Elizabeth Martin | 0.128 m³ | BK2400003 |
| David Hernandez | 0.123 m³ | BK2400004 |
| Susan Martinez | 0.093 m³ | BK2400005 |
| Susan Wilson | 0.061 m³ | BK2400006 |
| Thomas Williams | 0.115 m³ | BK2400007 |
| Robert Martin | 0.072 m³ | BK2400008 |
| Linda Anderson | 0.061 m³ | BK2400009 |
| Robert Jones | 0.061 m³ | BK2400010 |

**Total Luggage Volume**: ~0.895 m³ (fits in 1.05 m³ Red Zone)

---

## 🎨 Understanding the 3D Scene

### Color Zones
- **🔴 Red Zone** - Passenger luggage area (1.05 m³)
  - This is where you must place all bags
  - Shown as semi-transparent red box
  
- **🟢 Green Zone** - Commercial cargo area (131.10 m³)
  - Reserved for airline cargo
  - Cannot be used for passenger luggage
  - Shown as semi-transparent green box

- **⚪ Wireframe** - Container boundary
  - Shows the total cargo hold dimensions
  - Helps visualize the space

### Block Colors
- **🔵 Blue Blocks** - Successfully placed bags
- **🟣 Purple Blocks** - Bags in staging queue
- **🔴 Red Blocks** - Invalid placement (collision/out of bounds)

---

## ❓ FAQ

### Q: What if I place a bag incorrectly?
**A**: Click the ✕ button next to the bag in the "Placed" section to remove it and try again.

### Q: Can I rotate the 3D view?
**A**: Yes! Right-click and drag to rotate. Scroll to zoom in/out.

### Q: What happens if bags collide?
**A**: The game prevents collisions automatically. Bags will be placed in valid positions without overlapping.

### Q: Is there a time limit?
**A**: No, take your time! There's no time pressure in this version.

### Q: Can I play with different flights?
**A**: Currently, only Flight AB201 is available. Click "Back" to return to the selector.

### Q: Do I need internet to play?
**A**: Yes, to play online. For offline play, run it locally with `npm run dev`.

### Q: What browser should I use?
**A**: Chrome, Firefox, Safari, or Edge (any modern browser with WebGL support).

---

## 🐛 Troubleshooting

### 3D Scene Not Showing
- **Solution**: Refresh the page (F5)
- Check browser console for errors (F12)
- Ensure WebGL is enabled in your browser

### Bags Not Appearing in Queue
- **Solution**: Wait a few seconds for CSV data to load
- Check that FLIGHT_AI.csv and USER_AI.csv are in the public folder
- Verify CSV files have correct column names

### Game Runs Slowly
- **Solution**: Close other browser tabs
- Reduce graphics quality if needed
- Try a different browser

### Can't Click on Bags
- **Solution**: Make sure you're clicking on the bag cards in the sidebar
- Try scrolling the sidebar if bags are cut off

---

## 📱 System Requirements

- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: 2GB minimum
- **GPU**: Any GPU with WebGL support
- **Internet**: Required for online play
- **Screen**: 1024x768 minimum (1920x1080 recommended)

---

## 🎓 Learning Resources

### Understanding the Game
- **3D Graphics**: Uses Three.js for 3D rendering
- **Framework**: Built with Next.js and React
- **Styling**: Tailwind CSS for responsive design
- **Data**: CSV files for flight and luggage information

### Code Structure
- `app/page.tsx` - Main game flow
- `components/FlightSelector.tsx` - Flight selection
- `components/GameScene.tsx` - 3D game scene
- `lib/csvParser.ts` - Data parsing utilities

---

## 🎯 Tips for Success

1. **Start with smaller bags** - They're easier to place first
2. **Use the 3D view** - Rotate to see available space
3. **Watch the progress bar** - Visual feedback helps
4. **Remove and retry** - If placement seems wrong, use the ✕ button
5. **Take your time** - No rush, enjoy the puzzle!

---

## 📞 Need Help?

1. Check the **README.md** for detailed documentation
2. Review **PROJECT_SUMMARY.md** for technical details
3. Check browser console (F12) for error messages
4. Verify CSV files are in the correct location

---

## 🎉 Ready to Play?

**[Start Playing Now →](https://cargoopt-3-d-packer.lindy.site)**

Enjoy loading cargo! 🚀✈️

---

**Version**: 1.0.0  
**Last Updated**: December 6, 2025  
**Status**: ✅ Production Ready
