# SirDexal's Skin Explorer

A modern, interactive League of Legends champion skin explorer built with React and TypeScript. Browse champions, explore their skins, view chromas, and stay up-to-date with the latest patches including PBE content.

![Skin Explorer Preview](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=SirDexal%27s+Skin+Explorer)

## ✨ Features

### 🎮 Champion & Skin Browsing
- **Complete Champion Library**: Browse all League of Legends champions with their full skin collections
- **High-Quality Images**: View splash arts, skin thumbnails, and chroma variants
- **Detailed Information**: See skin rarity, legacy status, series information, and skin IDs
- **Interactive Chroma Viewer**: Click on skins with chromas to explore all color variants

### 🔍 Advanced Filtering & Search
- **Smart Search**: Find champions by name with real-time filtering
- **Multi-Filter System**: Filter by rarity (Epic, Legendary, Mythic, Ultimate, Exalted, Transcendent)
- **Legacy Filter**: Show only legacy skins or exclude them
- **Chroma Filter**: Filter skins by chroma availability
- **Skin Count Filter**: Filter champions by number of skins they have
- **Sorting Options**: Sort by champion name or skin count

### 🎨 Customizable Themes
- **Purple Theme**: Mystical purple color scheme (default)
- **Gold Theme**: Luxurious gold color scheme
- **Dynamic Theming**: Instant theme switching with smooth transitions

### 📱 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Grid & List Views**: Switch between card grid and detailed list views
- **Smooth Animations**: Polished hover effects and transitions
- **Custom Scrollbars**: Themed scrollbars that match the selected color scheme
- **Modal Interfaces**: Full-screen chroma viewer and settings modal

### 🚀 Patch Support
- **Live Patches**: Support for all current League of Legends patches
- **Automatic Updates**: Fetches the latest patch data automatically
- **Patch Switching**: Easily switch between different game versions

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Sources**: 
  - DDragon API (Riot Games official)
  - CommunityDragon API (community-maintained)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/skin-explorer.git
   cd skin-explorer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

The built files will be in the `dist` directory.

## 📖 Usage Guide

### Basic Navigation
1. **Select a Champion**: Click on any champion from the left panel
2. **Browse Skins**: View all skins for the selected champion in the main area
3. **View Chromas**: Click on skins with the "✨ CHROMA" indicator to see all variants
4. **Filter Content**: Use the filter button to narrow down results
5. **Change Views**: Toggle between grid and list view modes

### Advanced Features
- **Search**: Type in the search box to find specific champions
- **Filters**: Use the advanced filter panel to find skins by specific criteria
- **Themes**: Access settings to change the color theme
- **PBE Mode**: Switch to PBE in settings to see upcoming content

### Keyboard Shortcuts
- `Escape`: Close any open modal or popup
- `Ctrl/Cmd + F`: Focus search box (browser default)

## 🎯 Data Sources & APIs

### DDragon API (Riot Games Official)
- **Champion Data**: `https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/championFull.json`
- **Champion Icons**: `https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{champion}.png`
- **Splash Arts**: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{champion}_{skin}.jpg`

### CommunityDragon API
- **Detailed Skin Data**: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json`
- **Skin Lines**: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skinlines.json`
- **PBE Data**: `https://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/v1/`
- **Chroma Images**: `https://raw.communitydragon.org/latest/champion-chroma-images/{champion}/{chroma}.png`

## 🎨 Customization

### Themes
The application supports custom themes through CSS variables. You can modify or add new themes by updating the CSS variables in `src/index.css`:

\`\`\`css
:root {
  --primary-color: #8b5cf6;
  --background-gradient-start: #020617;
  /* ... other variables */
}
\`\`\`

### Adding New Filters
To add new filter options, modify the filter arrays in `src/components/SkinGrid.tsx`:

\`\`\`typescript
const newFilterOptions = [
  { value: "new-option", label: "New Filter Option" },
  // ... existing options
]
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style and TypeScript conventions
2. Add appropriate type definitions for new features
3. Test your changes across different screen sizes
4. Update documentation for new features

### Reporting Issues
If you find a bug or have a feature request, please create an issue on GitHub with:
- Clear description of the problem/feature
- Steps to reproduce (for bugs)
- Screenshots if applicable
- Your browser and OS information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Riot Games** for League of Legends and the DDragon API
- **CommunityDragon** for the comprehensive skin and chroma data
- **League of Legends Community** for continued support and feedback

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the [FAQ section](#faq) below
- Join our community discussions

## ❓ FAQ

**Q: Why don't some images load?**
A: The app uses multiple fallback sources. If images don't load, it might be due to API rate limits or temporary server issues.

**Q: Can I use this offline?**
A: No, the application requires an internet connection to fetch data from the APIs.

**Q: How often is the data updated?**
A: The app fetches the latest patch information on each load. Patch data is updated by Riot Games typically every 2 weeks.

**Q: Can I contribute new features?**
A: Yes! Check the Contributing section above for guidelines.

---

**Made with ❤️ by SirDexal**

*League of Legends is a trademark of Riot Games, Inc. This project is not affiliated with Riot Games.*
