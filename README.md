# Saylani Bootcamp LMS 2

A full-stack Learning Management System (LMS) prototype for Saylani Bootcamp.

This repository contains a Node.js/Express backend with MongoDB and a React + Vite frontend using Tailwind CSS.

## Current Progress

- Backend core API is implemented:
  - Express server with `/api` routing
  - Authentication routes (`/api/auth/login`, `/api/auth/register`, `/api/auth/change-password`)
  - Student registration route (`/api/students`)
  - MongoDB connection and default admin seeding
  - Token generation utilities for JWT access and refresh tokens
  - Email transport configuration scaffolded for SMTP support
- Frontend UI is partially implemented:
  - React + Vite app with authentication pages
  - Login and signup forms
  - Dashboard layout with sidebar, navbar, and responsive page routing
  - Placeholder pages for Student Management, Attendance Management, Reports, and Resources
  - Dashboard cards and UI sections for bootcamp metrics

## Features

- Student authentication and signup flow
- Admin/Student role support in backend
- Dashboard navigation with:
  - Dashboard
  - Student Management
  - Attendance Management
  - Reports
  - Resources
- Backend models for:
  - Student, Attendance, AttendanceSession
  - Project, Milestone, Deliverable
  - Team, TeamMember, TeamProject
  - Resource, ResourceCategory
  - Report, Evaluation, StudentPerformance
  - Announcement and AnnouncementRecipient

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv
- Frontend: React, Vite, Tailwind CSS, React Router DOM, React Icons

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SMIT-Bootcamp/Saylani-Bootcamp-LMS2.git
cd Saylani-Bootcamp-LMS2
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` with values similar to:

```env
PORT=7000
MONGO_URI=mongodb://127.0.0.1:27017/saylani-lms
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email_user
SMTP_PASSWORD=your_email_password
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../Frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal (typically `http://localhost:5173`).

## Project Structure

- `Backend/`
  - `app.js` - Express app configuration
  - `server.js` - MongoDB connect and server start
  - `routes/` - API route definitions
  - `modules/` - auth and student modules
  - `model/` - Mongoose schema definitions
  - `config/` - email and database configuration
  - `utils/` - helpers for error handling, tokens, async handling
- `Frontend/`
  - `src/` - React app source
  - `components/` - layout and dashboard components
  - `pages/` - page-level route components
  - `context/` - sidebar state management

## Notes

- Backend API is mounted at `/api`
- Frontend currently routes all auth pages and dashboard pages using React Router
- Some dashboard views are placeholders and can be expanded with API integration

## Next Steps

- Connect frontend authentication to backend API
- Implement student management and attendance workflows in UI
- Add full CRUD operations for projects, reports, resources, and teams
- Enhance email/password reset functionality
