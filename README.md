<div align="center">

# 🎓 Saylani Bootcamp LMS

### **Enterprise-Grade Learning & Project Management System**

An end-to-end bootcamp learning management platform built for **Saylani Mass IT Training (SMIT)**. Empowers Super Admins, Mentors/Instructors, and Students to manage batches, teams, project deliverables, sprint milestones, learning resources with Cloudinary PDF/image streaming, attendance tracking, and evaluations.

---

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-SDK_v2-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

</div>

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🏗️ System Architecture & RBAC](#️-system-architecture--rbac)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start & Installation](#-quick-start--installation)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Seed Super Admin Account](#4-seed-super-admin-account)
- [🔐 Environment Variables Configuration](#-environment-variables-configuration)
- [📡 API Endpoints Overview](#-api-endpoints-overview)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Key Features

### 👑 Super Admin Dashboard

- **Role & Access Governance**: Provision, manage, and monitor Admins, Mentors, and Students.
- **Batch Management**: Create, schedule, and configure bootcamp cohorts and training programs.
- **System-Wide Oversight**: View platform-wide statistics, active batches, student enrollments, and real-time logs.

### 🧑‍🏫 Admin & Mentor Portal

- **Team & Project Allocation**: Form project teams, designate team leads, and assign capstone projects.
- **Sprint & Milestone Review**: Track milestone deadlines, review student deliverables, and evaluate submissions.
- **Attendance Management**: Record and track daily/weekly student attendance per batch.
- **Educational Resource Management**: Upload PDF slides, lecture notes, and starter guides with automatic Cloudinary storage.

### 🎓 Student Portal

- **Personalized Dashboard**: View assigned team, current sprint milestones, today's tasks, and progress indicators.
- **Task Management**: Real-time task board with status workflows (Pending, In Progress, Completed).
- **Resource Library**: Instant access to course materials with one-click preview and download powered by Cloudinary.
- **Profile & Photo Management**: Live profile editing with Cloudinary avatar uploads, password changing, and academic overview.

### ☁️ Cloudinary Cloud Storage Integration

- **Direct PDF & Document Uploads**: Seamless multipart file uploads streamed directly to Cloudinary with memory storage.
- **Profile Photos**: Fast, responsive avatar handling for students and administrators.
- **Asset Auto-Cleanup**: Automatic asset deletion from Cloudinary when resources or profiles are updated/deleted.

### 📧 Automated Email Notifications (Nodemailer)

- **Welcome Credentials**: Automated onboarding emails dispatched with generated credentials when enrolling students.
- **Password Recovery**: Secure tokenized password reset links with expiration handling.

---

## 🏗️ System Architecture & RBAC

```
+-------------------------------------------------------------------------------+
|                                SAYLANI LMS CLIENT                             |
|              (React 19, Vite, TailwindCSS, React Router 7, Axios)             |
+---------------------------------------+---------------------------------------+
                                        |  REST API Calls (JWT Bearer Auth)
                                        v
+-------------------------------------------------------------------------------+
|                                 EXPRESS BACKEND                               |
|        AuthMiddleware | PermissionMiddleware | Multer (Memory Streaming)       |
+-------------------+-------------------+-------------------+-------------------+
                    |                   |                   |
                    v                   v                   v
           +----------------+  +-----------------+  +-----------------+
           | MongoDB Atlas  |  | Cloudinary API  |  | SMTP Mailer     |
           | Database       |  | (PDFs & Avatars)|  | (Nodemailer)    |
           +----------------+  +-----------------+  +-----------------+
```

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS, Vanilla CSS animations
- **Icons**: Lucide React & React Icons (`react-icons`)
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios with automatic request/response token interceptors
- **State Management**: React Context API (`AuthContext`, `AcademicContext`, `SystemContext`)

### Backend

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access Tokens + Refresh Tokens) & BcryptJS password hashing
- **File Uploads**: Cloudinary SDK (v2) & Multer (Stream-based memory storage)
- **Email Delivery**: Nodemailer (SMTP / Gmail App Passwords)
- **Validation**: Express-Validator

---

## 📁 Project Structure

```
Saylani-Bootcamp-LMS2/
├── Backend/
│   ├── config/               # Database, Cloudinary & Email configurations
│   ├── constants/            # Role definitions, permissions & enums
│   ├── middleware/           # Auth, RBAC, Multer & Validation middlewares
│   ├── model/                # Mongoose models (User, Student, Batch, Team, Resource, etc.)
│   ├── modules/              # Domain modules (auth, admins, students, batches, resources...)
│   ├── routes/               # Central Express router
│   ├── seed/                 # Super Admin automated seeding scripts
│   ├── utils/                # Token generators, mailers, helper utilities
│   ├── .env.example          # Backend environment variables template
│   ├── package.json          # Backend dependencies and scripts
│   └── server.js             # Application entry point
│
├── Frontend/
│   ├── public/               # Public assets and favicon
│   ├── src/
│   │   ├── api/              # Axios instance and interceptor setup
│   │   ├── components/       # Reusable components (Header, Sidebar, Modals, Cards)
│   │   ├── context/          # Auth, Academic, and System context providers
│   │   ├── pages/            # Student, Admin, SuperAdmin, Profile & Resource pages
│   │   ├── routes/           # App routes and role-based route guards
│   │   └── App.jsx           # Root application component
│   ├── .env.example          # Frontend environment variables template
│   ├── package.json          # Frontend dependencies and scripts
│   └── vite.config.js        # Vite build configuration
│
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start & Installation

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance
- [Cloudinary](https://cloudinary.com) account (free tier)

---

### 1. Clone Repository

```bash
git clone https://github.com/shaheerali838/BootCamp-LMS.git
cd BootCamp-LMS
```

---

### 2. Backend Setup

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Open `.env` in your editor and configure your **MongoDB URI**, **JWT Secrets**, **Cloudinary Keys**, and **SMTP Credentials**.

---

### 3. Frontend Setup

```bash
# Navigate to Frontend folder (in a new terminal)
cd ../Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

---

### 4. Seed Super Admin Account

Initialize the default Super Admin account into MongoDB:

```bash
# Inside Backend directory
npm run seed:super-admin
```

Default credentials generated by seed:

- **Email**: `admin@saylani.com` _(or value in your .env `ADMIN_EMAIL`)_
- **Password**: `Admin@123` _(or value in your .env `ADMIN_PASSWORD`)_

---

### 5. Run the Application

Start both servers concurrently:

**Start Backend:**

```bash
cd Backend
npm run dev
# Server running at: http://localhost:7000
```

**Start Frontend:**

```bash
cd Frontend
npm run dev
# Client running at: http://localhost:5173
```

---

## 🔐 Environment Variables Configuration

### Backend (`Backend/.env`)

| Variable                | Description                   | Example / Default       |
| :---------------------- | :---------------------------- | :---------------------- |
| `PORT`                  | Backend server port           | `7000`                  |
| `MONGO_URI`             | MongoDB connection URI        | `mongodb+srv://...`     |
| `JWT_SECRET`            | Secret key for access tokens  | `your_secret_key`       |
| `JWT_REFRESH_SECRET`    | Secret key for refresh tokens | `your_refresh_secret`   |
| `ADMIN_EMAIL`           | Initial Super Admin email     | `admin@saylani.com`     |
| `ADMIN_PASSWORD`        | Initial Super Admin password  | `Admin@123`             |
| `SMTP_HOST`             | Mail server host              | `smtp.gmail.com`        |
| `SMTP_PORT`             | Mail server port              | `587`                   |
| `SMTP_USER`             | Email username                | `your_email@gmail.com`  |
| `SMTP_PASSWORD`         | Email App Password            | `xxxx xxxx xxxx xxxx`   |
| `CLIENT_URL`            | Frontend application URL      | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your_cloud_name`       |
| `CLOUDINARY_API_KEY`    | Cloudinary 15-digit API key   | `896165619933826`       |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret key     | `your_api_secret`       |

### Frontend (`Frontend/.env`)

| Variable       | Description               | Example / Default           |
| :------------- | :------------------------ | :-------------------------- |
| `VITE_API_URL` | Backend REST API root URL | `http://localhost:7000/api` |

---

## 📡 API Endpoints Overview

| Module        | Method   | Endpoint                             | Description                         | Access              |
| :------------ | :------- | :----------------------------------- | :---------------------------------- | :------------------ |
| **Auth**      | `POST`   | `/api/auth/login`                    | Multi-role user authentication      | Public              |
| **Auth**      | `GET`    | `/api/auth/profile`                  | Fetch authenticated profile details | Authenticated       |
| **Auth**      | `PUT`    | `/api/auth/profile`                  | Update profile & Cloudinary avatar  | Authenticated       |
| **Auth**      | `POST`   | `/api/auth/forgot-password`          | Request password reset email        | Public              |
| **Auth**      | `POST`   | `/api/auth/change-password`          | Update account password             | Authenticated       |
| **Students**  | `GET`    | `/api/students/get-all-students`     | Get paginated student list          | Admin / Super Admin |
| **Students**  | `POST`   | `/api/students/create-student`       | Enroll student & upload photo       | Admin / Super Admin |
| **Students**  | `PUT`    | `/api/students/update-student/:id`   | Update student profile & photo      | Admin / Super Admin |
| **Batches**   | `GET`    | `/api/batches/get-all-batches`       | List all bootcamp cohorts           | Authenticated       |
| **Batches**   | `POST`   | `/api/batches/create-batch`          | Create new cohort                   | Super Admin         |
| **Teams**     | `GET`    | `/api/teams/get-all-teams`           | Fetch project teams                 | Authenticated       |
| **Resources** | `GET`    | `/api/resources/get-all-resources`   | List learning resources             | Authenticated       |
| **Resources** | `POST`   | `/api/resources/create-resource`     | Upload PDF resource to Cloudinary   | Admin / Super Admin |
| **Resources** | `DELETE` | `/api/resources/delete-resource/:id` | Remove resource & Cloudinary asset  | Admin / Super Admin |

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or pull request on the repository.

Distributed under the **ISC License**. Developed for Saylani Mass IT Training (SMIT).
