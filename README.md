# Shivam's Essential Toolkit Pro - Personal Desktop OS

A comprehensive single-page HTML application wrapped as a desktop executable that functions as a mini operating system with 7 fully functional productivity apps.

## 🚀 Features

### Core System
- **Dark Mode Apple-inspired Design**: Premium UI with rounded cards, soft borders, and smooth animations
- **Sidebar Navigation**: Icon-based navigation with active states
- **Home Screen**: Grid-based app launcher with hover effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Persistence**: All data is saved to local storage, ensuring your notes and settings remain after you close the app.

### 📝 Notes App
- **3-Column Layout**: Folders, notes list, and rich text editor
- **Rich Text Editing**: Bold, italic, underline formatting with toolbar
- **Auto-save**: Real-time saving as you type
- **Note Management**: Create, delete, and organize notes in folders

### 📸 Photos App
- **File Import**: Click to import multiple images from your device
- **Grid Gallery**: Responsive photo grid with hover effects
- **Lightbox**: Fullscreen photo viewing with metadata display
- **Photo Management**: Favorite toggle, delete photos, view file details

### 🔐 Password Manager
- **Secure Storage**: Save credentials with automatic service favicon fetching
- **Masked Passwords**: Toggle visibility for security
- **Service Integration**: Automatic favicon display for saved services
- **CRUD Operations**: Add, view, and delete password entries

### 👥 Contacts App
- **Contact Management**: Add, edit, and delete contacts
- **Search Functionality**: Real-time contact search across all fields
- **Detail View**: Complete contact information display
- **VCF Export**: Export all contacts as VCF file for other applications

### 🔗 URL Dashboard
- **Bookmark Management**: Save and categorize your favorite links
- **Favicon Support**: Automatically fetches site icons
- **Folders**: Organize links into custom folders

### ⚙️ Settings & Profile
- **Customization**: Change theme (Dark/Light/Auto) and background wallpaper
- **Profile**: Manage your user bio and avatar

## 🛠️ Technical Features

- **Electron**: Wrapped as a standalone desktop application
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful icon library
- **Keyboard Shortcuts**: Cmd/Ctrl + 1-8 for quick app switching
- **Data Persistence**: Uses `localStorage` to save user data permanently on the machine

## 🚀 Building the App

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm start
   ```

3. **Build Executable**:
   ```bash
   npm run dist
   ```
   This will generate an installer in the `dist` folder.

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🎯 Usage

### Navigation
- **Home Button**: Click the grid icon in header or sidebar to return home
- **Sidebar**: Click any app icon to switch between applications
- **Keyboard Shortcuts**: Use Cmd/Ctrl + 1-8 to quickly switch apps

### Data Storage
- All data is stored in your computer's local application storage. It persists even after you restart the application.

## 🔧 Customization

### Colors
Edit the Tailwind config in `index.html` to customize colors:
```javascript
colors: {
    'dark-bg': '#0a0a0a',      // Background color
    'dark-card': '#1a1a1a',    // Card background
    'accent': '#007AFF',       // Primary accent color
    'accent-hover': '#0056CC'  // Accent hover state
}
```

## 📄 File Structure

```
shivams-essential-toolkit-pro/
├── index.html          # Main application code
├── main.js             # Electron main process
├── package.json        # Project configuration
├── README.md           # This documentation
└── assets/             # Icons folder (create this and add icon.png/icon.ico)
```

## 📝 License

MIT License - Feel free to use, modify, and distribute.