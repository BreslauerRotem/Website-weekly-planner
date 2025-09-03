# Weekly Planner Web Application

A modern web application that helps users plan their weekly activities by managing hobbies, free time slots, and locations. Built with React frontend and Node.js backend, featuring user authentication and Google Maps integration.

## 🚀 Features

- **User Authentication**: Secure signup and login system with password hashing
- **Hobby Management**: Add, edit, and organize personal hobbies
- **Free Time Scheduling**: Plan weekly free time slots with day and time selection
- **Location Tracking**: Set and manage current location for activity planning
- **Responsive Design**: Modern, mobile-friendly user interface
- **Google Maps Integration**: Location-based features and mapping capabilities
- **Real-time Updates**: Dynamic data updates without page refresh

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 19 with React Router for navigation
- **Styling**: CSS with responsive design principles
- **State Management**: React hooks for local state
- **Routing**: Client-side routing with protected routes

### Backend (Node.js)
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcrypt for password hashing
- **API**: RESTful API endpoints with CORS support

### Database (MongoDB)
- **Collections**: Users and Planners
- **Relationships**: One-to-many between users and planners
- **Indexing**: Optimized queries with proper indexing
- **Validation**: Schema-based data validation

## 📁 Project Structure

```
Website-weekly-planner/
├── website/
│   ├── client/                 # React frontend
│   │   ├── public/            # Static assets
│   │   ├── src/               # Source code
│   │   │   ├── Pages/         # Page components
│   │   │   │   ├── Entrance/  # Landing page
│   │   │   │   ├── Login/     # Login page
│   │   │   │   ├── Signup/    # Registration page
│   │   │   │   ├── Hobbies/   # Hobby management
│   │   │   │   ├── FreeTime/  # Time scheduling
│   │   │   │   └── Results/   # Planning results
│   │   │   ├── App.js         # Main app component
│   │   │   └── index.js       # Entry point
│   │   └── package.json       # Frontend dependencies
│   └── server/                # Node.js backend
│       ├── controllers/       # Business logic
│       ├── models/            # Database schemas
│       ├── routes/            # API endpoints
│       ├── services/          # External services
│       ├── server.js          # Main server file
│       └── package.json       # Backend dependencies
├── DATABASE_SCHEMA.md         # Database documentation
└── README.md                  # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd website/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   MONGO_URI=mongodb://localhost:27017/weekly-planner
   PORT=5001
   JWT_SECRET=your-secret-key
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd website/client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User authentication

### User Management
- `POST /update-hobbies` - Update user hobbies
- `POST /update-free-time` - Update free time slots
- `GET /get-user-data` - Fetch user information

### Planner
- `GET /api/planner` - Get planner data
- `POST /api/planner` - Create new planner
- `PUT /api/planner/:id` - Update planner
- `DELETE /api/planner/:id` - Delete planner

## 🗄️ Database Schema

The application uses two main collections:

### Users Collection
- **username**: Unique identifier for users
- **email**: User's email address
- **password**: Hashed password using bcrypt
- **hobbies**: Array of user's hobbies
- **freeTime**: Array of time slots with day, start, and end times
- **currentLocation**: User's current location
- **planners**: References to planner documents

### Planners Collection
- **user**: Reference to user document
- **hobbies**: Hobbies for specific planning sessions
- **freeTime**: Time slots for planning
- **currentLocation**: Location for planning

For detailed schema information, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds of 10
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Authentication**: Protected routes and endpoints
- **Data Sanitization**: MongoDB injection protection

## 🚀 Usage

### User Registration
1. Navigate to the signup page
2. Enter username, email, and password
3. Submit to create account

### User Login
1. Navigate to the login page
2. Enter username and password
3. Access personalized dashboard

### Managing Hobbies
1. Navigate to hobbies page
2. Add new hobbies to your profile
3. Edit or remove existing hobbies

### Scheduling Free Time
1. Navigate to free time page
2. Select days and time slots
3. Set your current location
4. Save your schedule

### Viewing Results
1. Navigate to results page
2. View your personalized weekly plan
3. See recommendations based on hobbies and availability

## 🧪 Testing

### Backend Testing
```bash
cd website/server
npm test
```

### Frontend Testing
```bash
cd website/client
npm test
```

## 📦 Dependencies

### Backend Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcrypt**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend Dependencies
- **react**: UI library
- **react-router-dom**: Client-side routing
- **@react-google-maps/api**: Google Maps integration
- **react-scripts**: Create React App scripts

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Configure MongoDB connection string
4. Set up reverse proxy (nginx)

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve static files from build directory
3. Configure routing for SPA
4. Set up CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- **Real-time Collaboration**: Share planners with friends
- **Calendar Integration**: Sync with Google Calendar
- **Mobile App**: Native mobile application
- **AI Recommendations**: Smart activity suggestions
- **Social Features**: Community and sharing capabilities
- **Analytics**: Track planning patterns and productivity

---

**Built with React, Node.js, and MongoDB**
