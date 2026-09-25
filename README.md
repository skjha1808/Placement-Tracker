# Placement Tracker

An AI-powered **MERN stack placement management platform** designed to help students and administrators manage the campus placement process efficiently.

Students can maintain their profiles, explore eligible companies, apply for opportunities, track application progress, monitor deadlines, and analyze their resumes using AI.

Administrators can manage students, companies, applications, and placement-related data through dedicated admin modules.

## Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Role-based access control
* Protected student and admin routes

### 👨‍🎓 Student Management

* Student profile management
* Academic information and CGPA
* Branch and skills management
* Resume information
* Student verification
* Personalized student dashboard

### 🏢 Company Management

* View available companies
* Add, edit, and delete company information
* Job role and package details
* Location and job type
* Eligible branches
* Minimum CGPA requirements
* Application deadlines
* Open/Closed company status

### 📋 Application Tracking

Students can track their placement applications through different stages:

* Applied
* OA Scheduled
* OA Cleared
* Interview Scheduled
* Selected
* Rejected

Additional application functionality includes:

* Application notes
* Application date tracking
* Duplicate application prevention
* Admin-side application management

### ✅ Eligibility Checking

The platform checks whether a student is eligible to apply for a company based on:

* Student verification status
* Minimum CGPA
* Eligible branch
* Application deadline
* Company status
* Existing application status

### 📊 Dashboards & Analytics

The application provides placement-related statistics and visualizations, including:

* Total applications
* Total companies
* Selected candidates
* Application status distribution
* Branch-wise application data
* Recent activities
* Upcoming application deadlines
* Student placement progress

### 🔔 Notifications

Users can manage application-related notifications through:

* Notification list
* Mark as read
* Mark all as read
* Delete notifications

### 🤖 AI Resume Analyzer

The project integrates the **Google Gemini API** to provide AI-powered resume analysis.

Users can upload a resume in PDF format and receive:

* Overall resume score
* Score breakdown
* Overall evaluation
* Role-fit analysis
* Strengths
* Weaknesses
* ATS keyword analysis
* Missing skills
* Improvement suggestions
* Recommended next steps
* AI-generated summary

The analyzer extracts text from uploaded PDF resumes and sends the processed resume content to Google Gemini for structured analysis.

### 📄 Resume Processing

The backend processes uploaded resumes through the following workflow:

```text
Resume PDF
     ↓
PDF Upload
     ↓
PDF Text Extraction
     ↓
Resume Text Processing
     ↓
Google Gemini API
     ↓
Structured Resume Analysis
     ↓
Resume Score & Recommendations
```

Only PDF resumes are accepted, with a maximum upload size of 5 MB.

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* Recharts
* React Icons
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT
* bcrypt
* Role-based authorization
* Environment variables

### AI Integration

* Google Gemini API
* `@google/genai`
* PDF text extraction using `pdf-parse`

### File Upload

* Multer
* PDF validation
* 5 MB file-size limit

## Application Architecture

```text
                    Placement Tracker
                           │
                ┌──────────┴──────────┐
                │                     │
             Student                Admin
                │                     │
                └──────────┬──────────┘
                           │
                       React.js
                           │
                         Axios
                           │
                      REST APIs
                           │
                   Node.js + Express
                    │       │       │
                    │       │       └── JWT + bcrypt
                    │       │
                    │       └────────── Google Gemini
                    │
                 MongoDB
                  + Mongoose
```

## Project Structure

```text
Placement-Tracker/
│
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── prompts/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── scripts/
│   ├── seed/
│   └── server.js
│
├── .gitignore
└── README.md
```

## Backend API Modules

The backend is organized into modular REST API routes for:

* Authentication
* Students
* Companies
* Applications
* Eligibility
* Dashboard
* Notifications
* AI Resume Analysis

The backend follows a controller-route-model structure, with middleware handling authentication, authorization, and file uploads.

## Getting Started

### Prerequisites

Install the following before running the project:

* Node.js
* npm
* MongoDB or MongoDB Atlas
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/skjha1808/Placement-Tracker.git

cd Placement-Tracker
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit `.env` or expose API keys publicly.

Start the backend:

```bash
npm run dev
```

The backend runs on port `5000` by default.

### 3. Setup Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend can then be accessed through the Vite development server.

## Security Considerations

* Passwords are hashed using bcrypt.
* JWT is used for authentication.
* Role-based middleware protects admin functionality.
* Sensitive configuration is stored using environment variables.
* Gemini API credentials are accessed through environment variables.
* Resume uploads are restricted to PDF files.
* Resume uploads have a 5 MB size limit.
* Sensitive uploaded files should not be committed to the public repository.

## Future Enhancements

* Email notifications for important placement events
* AI-based company recommendations
* Advanced resume-to-job-description matching
* Additional placement analytics and reports
* Expanded interview preparation features

## Author

**Shubham Kumar**

B.Tech – Information Technology
Jaipur Engineering College and Research Centre (JECRC)

GitHub:
https://github.com/skjha1808
