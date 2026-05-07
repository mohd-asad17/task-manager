# TeamTask Pro - Production Team Task Manager

This is a full-stack (MERN) Task Management application built with React, Vite, Express, and MongoDB.

## Features
- **Secure Authentication**: JWT-based login/signup with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins and Members.
- **Project Management**: Create, edit, and delete projects (Admin only).
- **Task Tracking**: Assign tasks, set priorities, and track status.
- **Real-time Analytics**: Dashboard with status distribution and recent activity charts.
- **Clean UI**: Modern design using Tailwind CSS and Motion.

## Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas)

## Setup
1. Clone the project.
2. Install dependencies: `npm install`
3. Configure Environment:
   - Create a `.env` file based on `.env.example`.
   - Add your `MONGODB_URI` and `JWT_SECRET`.
4. Run in Development: `npm run dev`
5. Build for Production: `npm run build`
6. Start Production Server: `npm start`

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects (accessible to user)
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Tasks
- `GET /api/tasks` - Get all tasks (assigned to user or all for Admin)
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/:id` - Update task (Admin can update all, Member only status)
- `DELETE /api/tasks/:id` - Delete task (Admin)

### Dashboard
- `GET /api/dashboard/stats` - Get summary statistics and data for charts.

## Deployment
- **Frontend**: Can be built and served via the Express server (included) or deployed as static files to Vercel/Netlify.
- **Backend**: Deploy the Express server to Render, Railway, or Heroku.
- **Database**: Use MongoDB Atlas for a managed cloud database.
