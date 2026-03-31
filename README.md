🚀 FitPlatform
AI-Based Fitness Tracking & Muscle Activation Analysis System
📌 Overview
FitPlatform is a full-stack MERN application designed to go beyond traditional workout logging by introducing muscle activation analysis and intelligent fitness insights.
Unlike conventional fitness apps, FitPlatform focuses on data-driven workout optimization, allowing users to visualize muscle workload distribution and track training efficiency.
🎯 Key Features
🏋️ Workout Tracking
Log exercises with sets, reps, and weights
Structured workout session management
Real-time data storage
🧠 Muscle Activation Engine (Core Feature)
Primary muscle → +2 load per set
Secondary muscle → +1 load per set
Aggregates total muscle workload
🎨 Muscle Heatmap Visualization
Dynamic SVG-based body heatmap
Color-coded muscle intensity:
Load
Color
0
Grey
1
Yellow
2
Green
3+
Red
📊 Analytics System
Muscle workload tracking over time
Weekly performance insights
Data-driven training feedback
🔐 Authentication System
JWT-based authentication
Secure login & registration
Protected routes
🌐 Dual Client Support (Web + Mobile Ready)
Backend designed as single source of truth
REST APIs support:
Web frontend (React)
Future mobile app (React Native)
🏗️ Tech Stack
🔹 Frontend
React (Vite)
Tailwind CSS
React Router
🔹 Backend
Node.js
Express.js
MongoDB (Mongoose)
🔹 Other Tools
JWT Authentication
RESTful API Architecture
Postman (API testing)
Git & GitHub
🧠 System Architecture
Plain text
Frontend (React Web)
        ↓
   REST API (Express)
        ↓
   Business Logic Layer
   (Muscle Engine)
        ↓
     MongoDB
        ↑
Frontend (Mobile - Planned)
⚙️ Backend Structure

backend/
├── config/
├── controllers/
├── routes/
├── models/
├── utils/
│   └── muscleEngine.js
├── data/
│   └── exercises.js
├── middleware/
├── constants/
└── index.js
🔬 Muscle Activation Engine
Logic:
JavaScript
Primary muscle → +2 per set
Secondary muscle → +1 per set
Example:
Bench Press (3 sets):
JavaScript
chest += 6
triceps += 3
shoulders += 3
📡 API Endpoints
🔐 Auth

POST /auth/register
POST /auth/login
GET  /auth/me
🏋️ Workouts

POST /workouts
GET  /workouts
💪 Muscle Data

GET /muscle?range=today
GET /muscle?range=7d
GET /muscle?range=30d
📊 API Response Example
JSON
{
  "success": true,
  "data": {
    "raw": {
      "chest_left": 12,
      "chest_right": 12
    },
    "intensity": {
      "chest_left": 3,
      "chest_right": 3
    }
  }
}
🚀 Getting Started
🔹 Prerequisites
Node.js
MongoDB (running locally)
🔹 Backend Setup
Bash
cd backend
npm install
node index.js
Server runs on:

http://localhost:5000
🔹 Frontend Setup
Bash
cd frontend
npm install
npm run dev
Frontend runs on:

http://localhost:5173
🧪 Testing
Use Postman for API testing
Test endpoints:
Auth
Workouts
Muscle Data
📱 Future Scope
📲 React Native mobile application
🤖 AI-based workout recommendations
📈 Performance prediction models
💬 Gym Buddy matching system
☁️ Cloud deployment
🏆 Achievements
✔ Full-stack MERN application built
✔ 86 exercise dataset structured
✔ Functional muscle activation engine
✔ Real-time heatmap visualization
✔ Mobile-ready backend architecture
📚 References
React Documentation
MongoDB Documentation
Express.js Documentation
MDN Web Docs
Hevy App (UX Study)
👨‍💻 Author
Prajwal Pamnani
Manipal University Jaipur
23FE10CSE00383
⚡ Final Note
FitPlatform is not just a fitness tracker —
it is a data-driven fitness intelligence system designed to improve training efficiency through real-time muscle analysis.
