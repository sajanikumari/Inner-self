# 🌟 InnerSelf Buddy - Personal Wellness & Diary App

A beautiful, full-featured personal wellness application that helps you track your thoughts, manage tasks, set reminders, and understand your emotional patterns through advanced mood detection.

![InnerSelf Buddy](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## ✨ Features

### 📖 **Personal Diary**
- **Rich Text Editor** with formatting tools (bold, italic, underline, lists, quotes)
- **Advanced Mood Detection** with AI-powered sentiment analysis
- **Live Preview Mode** to see formatted text
- **Entry Management** - view, edit, and delete diary entries
- **Beautiful Modal Previews** for reading past entries

### 📋 **Task Management**
- **Drag & Drop** task reordering
- **Add, Edit, Delete** tasks with visual feedback
- **Task Completion** tracking
- **Persistent Storage** with backend synchronization

### ⏰ **Smart Reminders**
- **Enhanced Date/Time Picker** with quick presets
- **Calendar Integration** showing all reminders
- **Color-coded Events** for easy organization
- **Recurring Reminders** support
- **Pre-alert Notifications**

### 📅 **Interactive Calendar**
- **Monthly View** with navigation
- **Event Display** from reminders
- **Click-to-Create** reminders from calendar dates
- **Visual Event Indicators**

### ⚙️ **User Settings**
- **Profile Management** - update name, email, bio, avatar
- **Secure Password Changes**
- **Account Preferences**
- **Data Export/Import** capabilities

### 🔐 **Authentication System**
- **Secure Login/Registration**
- **JWT Token-based** authentication
- **Password Encryption** with bcrypt
- **Session Management**

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/innerself-buddy.git
cd innerself-buddy
```

2. **Install dependencies**
```bash
cd server
npm install
```

3. **Set up environment variables**
Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/innerself-buddy
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

4. **Start the application**
```bash
# From the root directory
node start-app.js
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🏗️ Project Structure

```
innerself-buddy/
├── client/                 # Frontend files
│   ├── index.html         # Home page
│   ├── diary.html         # Diary with rich text editor
│   ├── reminders.html     # Reminders & calendar
│   ├── settings.html      # User settings
│   └── js/
│       └── config.js      # API configuration
├── server/                # Backend files
│   ├── index.js          # Main server file
│   ├── serve-client.js   # Static file server
│   ├── models/           # Database models
│   │   ├── User.js
│   │   ├── DiaryEntry.js
│   │   ├── Reminder.js
│   │   └── Task.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── diaryRoutes.js
│   │   ├── reminderRoutes.js
│   │   └── taskRoutes.js
│   └── middleware/       # Custom middleware
│       └── auth.js
├── start-app.js          # Application launcher
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** with semantic markup
- **CSS3** with modern features (Grid, Flexbox, Animations)
- **Vanilla JavaScript** (ES6+)
- **Font Awesome** for icons
- **Responsive Design** for all devices

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### Features
- **Real-time Updates** with live data synchronization
- **Offline Support** with localStorage fallback
- **Progressive Enhancement** for better user experience
- **Mobile-First Design** with responsive layouts

## 📱 Screenshots

### Home Dashboard
Beautiful dashboard with task management and quick actions.

### Diary with Rich Text Editor
Advanced text editor with formatting tools and live preview.

### Smart Calendar
Interactive calendar with reminder integration and event management.

### User Settings
Comprehensive settings panel for profile and account management.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Diary
- `GET /api/diary` - Get user's diary entries
- `POST /api/diary` - Create new diary entry
- `PUT /api/diary/:id` - Update diary entry
- `DELETE /api/diary/:id` - Delete diary entry

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/reorder` - Reorder tasks

### Reminders
- `GET /api/reminders` - Get user's reminders
- `POST /api/reminders` - Create new reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

## 🎨 Design Features

### Color Scheme
- **Primary**: Warm browns (#8B4513, #A0522D)
- **Secondary**: Soft pinks (#FFB6C1, #FF69B4)
- **Accents**: Complementary colors for different moods and states

### Typography
- **Headers**: Modern sans-serif fonts
- **Body**: Georgia serif for readability
- **UI Elements**: Clean, accessible font choices

### Animations
- **Smooth Transitions** for all interactive elements
- **Hover Effects** with subtle transformations
- **Loading States** with visual feedback
- **Modal Animations** with fade and scale effects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👥 Authors

- **Sajani Kumari**

## 🙏 Acknowledgments

- Font Awesome for beautiful icons
- MongoDB for reliable data storage
- Express.js for robust backend framework
- All contributors and testers

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/innerself-buddy/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

---

Made with ❤️ for personal wellness and self-reflection
