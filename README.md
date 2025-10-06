# Smarter Job Portal - Frontend

🌟 A modern, responsive React frontend for the Smarter Job Portal featuring AI-powered recommendations, Tinder-like internship roulette, and advanced analytics dashboard.

## ✨ Features

- **🎲 Internship Roulette**
  - Tinder-like swipe interface for job discovery
  - Custom swipe implementation with touch and mouse support
  - Real-time feedback and animations
  - Smart filtering based on user preferences
  
- **🤖 AI-Powered Dashboard**
  - Personalized internship recommendations
  - Skills-based matching algorithm
  - Progress tracking and analytics
  - Interactive skills heatmap
  
- **🔐 Authentication System**
  - Local login/signup with validation
  - OAuth integration (Google & GitHub)
  - Secure JWT token management
  - Protected routes and user sessions
  
- **📊 Advanced Analytics**
  - Real-time skills demand heatmap
  - Application tracking and statistics
  - User behavior insights
  - Interactive data visualizations
  
- **💼 Profile Management**
  - Comprehensive user profiles
  - Skills and experience tracking
  - Resume upload functionality
  - Application history management

## 🛠 Tech Stack

- **Frontend Framework:** React 19.x
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** React Hooks + Context
- **HTTP Client:** Axios
- **Icons:** React Icons (Font Awesome)
- **Notifications:** React Hot Toast
- **Build Tool:** Create React App
- **Development:** Hot Module Replacement

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shrijatewari/smarter-job-portal-frontend.git
   cd smarter-job-portal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   REACT_APP_API_URL=http://localhost:4000
   REACT_APP_BACKEND_URL=http://localhost:4000
   
   # OAuth Configuration
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
   
   # Feature Flags
   REACT_APP_ENABLE_ANALYTICS=true
   REACT_APP_ENABLE_ML_RECOMMENDATIONS=true
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`

## 🚀 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)
- `npm run lint` - Runs ESLint for code quality checks

## 🏗 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Login.jsx        # Authentication login form
│   ├── Signup.jsx       # User registration form
│   ├── Profile.jsx      # User profile management
│   ├── InternshipRoulette.jsx  # Swipeable internship cards
│   ├── SavedInternships.jsx    # Saved internships display
│   ├── AIInsights.jsx   # AI-powered job insights
│   └── SkillHeatmap.jsx # Interactive skills heatmap
├── pages/               # Page-level components
│   ├── Home.jsx         # Landing page with roulette
│   ├── Dashboard.jsx    # User dashboard with recommendations
│   ├── Internships.jsx  # Browse all internships
│   ├── Analytics.jsx    # Analytics and insights
│   └── Applied.jsx      # Application tracking
├── utils/               # Utility functions
│   ├── api.js          # Axios configuration and interceptors
│   └── auth.js         # Authentication helpers
├── config/             # Configuration files
│   └── index.js        # App configuration
├── hooks/              # Custom React hooks
└── App.js              # Main application component
```

## 🎨 Design System

### Color Palette
- **Primary:** Blue gradient (#3B82F6 to #1E40AF)
- **Secondary:** Purple to pink gradient (#8B5CF6 to #EC4899)
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)
- **Background:** Gradient (#FFF3EB via #FFFDF5 to #E8FFF4)

### Typography
- **Font Family:** Inter (system font stack fallback)
- **Headings:** Bold weights (600-800)
- **Body:** Regular (400) and medium (500)
- **Code:** Monospace font stack

### Components
- Glass-morphism design with backdrop blur
- Rounded corners (0.5rem to 1.5rem)
- Subtle shadows and hover effects
- Smooth transitions (200ms ease)

## 🌟 Key Features Implementation

### Internship Roulette
```jsx
// Custom swipe implementation with touch and mouse support
const SwipeableCard = ({ internship, onSwipe }) => {
  const [isDragging, setIsDragging] = useState(false);
  // ... swipe logic with gesture recognition
};
```

### AI Recommendations
- Real-time personalized job matching
- Skills-based scoring algorithm
- User preference learning
- Interactive recommendation cards

### Skills Heatmap
```jsx
// Dynamic heatmap visualization
const SkillHeatmap = () => {
  // Custom grid implementation with Tailwind
  // Real-time data processing and filtering
  // Interactive hover states and tooltips
};
```

### Authentication Flow
- JWT token management with automatic refresh
- Protected route components
- OAuth integration with popup handling
- Form validation and error handling

## 📱 Responsive Design

- **Mobile-first approach** with responsive breakpoints
- **Touch-friendly interface** for mobile devices
- **Flexible grid layouts** that adapt to screen sizes
- **Optimized performance** for various device capabilities

### Breakpoints
- `sm:` 640px and up
- `md:` 768px and up  
- `lg:` 1024px and up
- `xl:` 1280px and up
- `2xl:` 1536px and up

## 🔧 API Integration

The frontend integrates with the backend API through:

```javascript
// API client configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Automatic token attachment
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Key API Endpoints Used
- Authentication: `/api/auth/*`
- Internships: `/api/internships/*`
- Roulette: `/api/preferences/*`
- Recommendations: `/api/recommendations/*`
- Analytics: `/api/analytics/*`

## 🚦 State Management

Using React's built-in state management:

- **useState** for component-level state
- **useEffect** for side effects and API calls
- **useContext** for global state (user auth)
- **Custom hooks** for reusable stateful logic

## 🎯 Performance Optimizations

- **Code splitting** with React.lazy()
- **Image optimization** with proper sizing
- **API call debouncing** for search functionality
- **Memoization** of expensive calculations
- **Bundle size optimization** with tree shaking

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_BACKEND_URL=https://your-backend-api.com
REACT_APP_GOOGLE_CLIENT_ID=your-production-google-client-id
REACT_APP_GITHUB_CLIENT_ID=your-production-github-client-id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m 'Add awesome feature'`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a pull request

## 📋 TODO

- [ ] Add unit tests for components
- [ ] Implement PWA features
- [ ] Add dark mode toggle
- [ ] Enhance accessibility (ARIA labels)
- [ ] Add internationalization (i18n)
- [ ] Implement offline functionality

## 🐛 Known Issues

- Swipe gestures may not work on some older browsers
- OAuth callbacks require HTTPS in production
- Large datasets may cause performance issues in heatmap

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shrija Tewari**
- GitHub: [@shrijatewari](https://github.com/shrijatewari)
- Email: shrijatewari@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React Icons for the comprehensive icon library
- Create React App for the excellent development setup
- All open-source contributors who made this project possible

---

⭐ **Star this repository if you found it helpful!**

🚀 **[Live Demo](https://your-deployed-frontend.com)** | 🔗 **[Backend Repository](https://github.com/shrijatewari/smarter-job-portal-backend)**