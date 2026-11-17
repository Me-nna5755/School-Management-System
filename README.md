# School Management System

A full-stack School Management System designed to simplify and automate daily academic and administrative operations. The platform provides role-based access for administrators, teachers, and students, with AI-powered tools for timetable and exam generation.

## Overview

The system helps schools manage their academic activities through a centralized platform. It supports user management, academic years, classes, subjects, timetables, exams, dashboards, and activity tracking.

It also integrates AI-powered features to reduce manual work and improve the efficiency of academic planning.

## Key Features

### User & Role Management
- User registration and login.
- Secure authentication using JWT stored in HTTP-only cookies.
- Role-based authorization for Admin, Teacher, and Student.
- User profile management.
- User activation and management.

### Academic Management
- Manage academic years.
- Create and manage classes.
- Manage subjects.
- Assign teachers and subjects.
- Organize academic information.

### AI-Powered Timetable Generation
- Generate class timetables using Google Gemini.
- Use existing academic data to support timetable generation.
- Run timetable generation through background workflows using Inngest.

### Exam Management
- Create and manage exams.
- Generate exam questions using Google Gemini.
- Manage exam activation and status.
- Support student exam submissions and results.

### Dashboard & Activity Tracking
- Role-based dashboard data.
- Track important system activities.
- Maintain activity logs for administrative operations.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Axios
- Modern component-based architecture

### Backend
- Bun
- Node.js-compatible TypeScript runtime
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Cookie Parser
- CORS
- Helmet
- Zod

### AI & Background Processing
- Google Gemini API
- Vercel AI SDK (`ai`)
- Google AI SDK (`@ai-sdk/google`)
- Inngest for background functions and event-driven workflows

### API Testing
- Thunder Client (Visual Studio Code extension)

Thunder Client was used to test the API endpoints and verify request handling, responses, authentication, and protected routes during development.

## API Modules

The backend provides RESTful API endpoints organized into the following modules:

| Module | Base Route | Purpose |
|---|---|---|
| User | `/api/user` | Registration, login, profiles, and user management |
| Activities | `/api/activities` | Activity logs |
| Academic Years | `/api/academic-years` | Academic year management |
| Classes | `/api/class` | Class management |
| Subjects | `/api/subject` | Subject management |
| Timetable | `/api/timeTable` | Timetable management and generation |
| Exams | `/api/exams` | Exam creation, generation, and results |
| Dashboard | `/api/dashboard` | Dashboard information |

## Background Jobs with Inngest

Inngest is integrated to handle event-driven background workflows, including:

- AI timetable generation.
- AI exam question generation.
- Processing time-consuming tasks outside the regular request-response flow.

This integration helps organize long-running AI operations and makes the backend workflow more manageable.

## Project Structure

```text
School-Management-System/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── serveries/
│       ├── utils/
│       └── inngest/
│
├── frontend/
│   └── my-app/
│       └── src/
│           ├── components/
│           ├── pages/
│           ├── context/
│           └── lib/
│
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Me-nna5755/School-Management-System.git

cd School-Management-System
```

### 2. Backend Setup

```bash
cd backend
bun install
```

Create a `.env` file in the backend directory and configure the required environment variables:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
```

Configure any additional environment variables required by your local services and integrations.

Start the backend using the development command configured in `backend/package.json`.

### 3. Frontend Setup

```bash
cd frontend/my-app
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## Testing

API testing was performed using **Thunder Client**.

The testing process covered:
- API requests and responses.
- Authentication and authorization.
- Protected routes.
- User and academic management operations.
- Timetable and exam-related endpoints.

## Security

The application includes:
- JWT-based authentication.
- HTTP-only authentication cookies.
- Role-based access control.
- Password hashing with bcrypt.
- CORS configuration.
- Helmet security middleware.
- Protected backend routes.

**Important:** Never commit `.env` files, database credentials, JWT secrets, or API keys to GitHub.

## Future Improvements

- Deploy the application to production.
- Add automated backend testing.
- Improve AI-generated timetable validation.
- Enhance reporting and analytics.
- Add further notification and communication features.

## Author

**School Management System — Full-Stack Development Project**

Built with React, TypeScript, Express, MongoDB, Google Gemini, and Inngest.

---

**Note:** This project is under active development. Some features and deployment configurations may evolve over time.
