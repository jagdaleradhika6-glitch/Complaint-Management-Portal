📌 Project Overview

Complaint Management Portal is a full-stack web application developed to streamline the process of registering, tracking, and resolving complaints. The system provides separate interfaces for users and administrators, enabling efficient complaint handling, status monitoring, and centralized management.
The portal allows users to submit complaints digitally, track their progress, and receive updates, while administrators can review complaints, update statuses, and manage the overall complaint resolution process.

🚀 Features
User Features
User Registration and Login
Secure Authentication using JWT
Submit New Complaints
View Complaint History
Track Complaint Status
Responsive User Dashboard
Admin Features
Admin Login
View All Complaints
Manage Complaint Records
Update Complaint Status
Monitor Resolution Process
User Management

🛠️ Technology Stack
Frontend
React.js
Vite
Tailwind CSS
Axios
React Router DOM
Backend
Node.js
Express.js
JWT Authentication
bcrypt.js
Database
MongoDB
Mongoose ODM

📂 Project Structure
complaint-portal/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md

⚙️ Installation & Setup
1. Clone Repository
git clone <repository-url>
cd complaint-portal
2. Install Frontend Dependencies
cd client
npm install
3. Install Backend Dependencies
cd ../server
npm install

🔧 Environment Variables

Create a .env file inside the server folder and add:
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/complaint_portal
JWT_SECRET=mysecretkey123
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
▶️ Running the Application
Start Backend
cd server
npm run dev

Expected Output:

MongoDB connected
Default admin created
Server running on port 5000
Start Frontend
cd client
npm run dev

Frontend will run on:
http://localhost:5173
(If 5173 is busy, Vite automatically uses another port such as 5174.)

🔐 Authentication
The application uses:

JWT (JSON Web Token)
Password Encryption using bcrypt
Role-Based Access Control
Protected Routes



🎯 Learning Outcomes

Through this project, the following concepts were implemented and practiced:

Full-Stack Web Development
React Component Architecture
RESTful API Development
JWT Authentication
MongoDB Integration
CRUD Operations
Express Middleware
State Management
Client-Server Communication
Database Design
🔮 Future Enhancements
Email Notifications
OTP Verification
AI-Based Complaint Categorization
Analytics Dashboard
Complaint Priority Prediction
Chatbot Assistance
File Attachments for Complaints
Real-Time Status Updates

👩‍💻 Author

Radhika Jagdale
B.Tech – Electronics & Telecommunication Engineering
Modern Education Society's College of Engineering, Pune



