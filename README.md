# 🚀 Typing Test App

A modern, full-stack web application for testing and improving typing speed and accuracy. Built with React, Node.js, Express, and MongoDB.

![Typing Test App](https://img.shields.io/badge/Status-Active-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Latest-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## ✨ Features

### Core Features
- **Real-time Typing Test**: Interactive typing test with live WPM and accuracy calculation
- **User Authentication**: Secure login and registration system with JWT tokens
- **Performance Tracking**: Track typing speed (WPM), accuracy, and progress over time
- **User Dashboard**: Personalized dashboard showing statistics and test history
- **Profile Management**: User profile with customizable settings
- **Dark/Light Theme**: Toggle between dark and light themes for better user experience
- **Responsive Design**: Mobile-first design that works on all devices

### Advanced Features
- **Protected Routes**: Secure routing with authentication middleware
- **Real-time Feedback**: Live typing feedback with error highlighting
- **Progress Analytics**: Detailed statistics and performance metrics
- **Custom Test Settings**: Configurable test duration and difficulty levels
- **Toast Notifications**: User-friendly notifications for all actions

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library with hooks and context
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling with validation
- **Yup** - Schema validation
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Parse HTTP cookies

### Development Tools
- **ESLint** - Code linting and formatting
- **Nodemon** - Development server auto-restart
- **dotenv** - Environment variable management

## 📁 Project Structure

```
typing-test-app/
├── frontend/                 # React frontend application
│   ├── public/              # Public assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── layout/     # Layout components (Header, etc.)
│   │   │   └── typing/     # Typing test components
│   │   ├── contexts/       # React contexts (Auth, Theme, Typing)
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main application component
│   ├── package.json
│   └── vite.config.js
├── server/                  # Node.js backend application
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── App.js              # Express app configuration
│   ├── index.js            # Server entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md              # Project documentation
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **MongoDB** (v4.4.0 or higher)
- **Git** (for cloning the repository)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vibhanshuvaibhav137/typing-test-app.git
   cd typing-test-app
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

## 🔐 Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/typing-test-app
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typing-test-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Optional: Additional Configuration
BCRYPT_SALT_ROUNDS=12
COOKIE_EXPIRE=7
```

### Environment Variables Explanation:
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing (use a strong, random string)
- `JWT_EXPIRE`: JWT token expiration time
- `FRONTEND_URL`: Frontend application URL for CORS

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally)
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community

   # Windows
   net start MongoDB

   # Linux (systemd)
   sudo systemctl start mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

3. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

4. **Open your browser** and navigate to `http://localhost:5173`

### Production Mode

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   NODE_ENV=production node index.js
   ```

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Typing Test Routes
- `POST /api/tests` - Save typing test result
- `GET /api/tests` - Get user's test history
- `GET /api/tests/:id` - Get specific test result
- `DELETE /api/tests/:id` - Delete test result

### Dashboard Routes
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-tests` - Get recent tests
- `GET /api/dashboard/progress` - Get progress analytics

## 💻 Usage

### Getting Started

1. **Register a new account** or **login** with existing credentials
2. **Navigate to the typing test** from the dashboard or header
3. **Start typing** the displayed text as accurately and quickly as possible
4. **View your results** including WPM, accuracy, and detailed statistics
5. **Track your progress** over time through the dashboard analytics

### Features Guide

#### Taking a Typing Test
- Click "Start Test" or navigate to `/test`
- Type the displayed text in the input area
- See real-time WPM and accuracy updates
- Complete the test to view detailed results

#### Dashboard Analytics
- View your typing speed progression over time
- Analyze accuracy trends and improvement areas
- See your best performances and recent tests

#### Profile Management
- Update your personal information
- Change your password
- View your overall statistics

#### Theme Switching
- Toggle between light and dark themes
- Preference is saved automatically

## 📱 Screenshots

### Homepage & Features
![Homepage](https://github.com/vibhanshuvaibhav137/typing-test-app/blob/5c985916500924e0df3fffb8b3ad62b98110471e/003.png)
*Landing page showcasing key features and benefits*

### Authentication : Login & Registration
![Login Page](https://github.com/vibhanshuvaibhav137/typing-test-app/blob/58381d07d962bb36dc513456ffc20af846e2ea06/001.png)
![Registration Page](https://github.com/vibhanshuvaibhav137/typing-test-app/blob/58381d07d962bb36dc513456ffc20af846e2ea06/002.png)
*Secure login & Registration interface with clean, modern design*

### Typing Test Interface
![Typing Test](https://github.com/vibhanshuvaibhav137/typing-test-app/blob/58381d07d962bb36dc513456ffc20af846e2ea06/004.png)
*Interactive typing test with real-time feedback and statistics*

### Dashboard & Analytics
![Dashboard](https://github.com/vibhanshuvaibhav137/typing-test-app/blob/58381d07d962bb36dc513456ffc20af846e2ea06/005.png)
*Comprehensive dashboard with performance metrics and test history*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit them
   ```bash
   git commit -m "Add some feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features when applicable
- Update documentation as needed

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vibhanshu Vaibhav**
- GitHub: [@vibhanshuvaibhav137](https://github.com/vibhanshuvaibhav137)
- Email: [vibhanshu.vaibhav.37@gmail.com](mailto:vibhanshu.vaibhav.37@gmail.com)
- LinkedIn: [vibhanshu-vaibhav](https://www.linkedin.com/in/vibhanshu-vaibhav-25b3a3237/)

## 📞 Support

If you have any questions or need help with setup, please:
- Open an issue on GitHub
- Contact the author directly
- Check the documentation for common solutions

---

**Happy Typing! 🎯**

*Made with ❤️ by Vibhanshu Vaibhav*
