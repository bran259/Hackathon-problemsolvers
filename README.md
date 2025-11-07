# 🚧 Construction Site Management System  
*A comprehensive React SPA with json-server backend for managing construction site operations.*
---

## 👥 Project Contributors

**Team Members**
- **Daniel Kamweru**
- **Erasmus Kipkosgei**
- **Joshua Muriki**
- **Brian Kimno**

---

## ✨ Features

- 🔐 **Role-based Access Control**: Admin, Site Agent, Engineer, Foreman, Driver Operator, Mason, Casual, Client  
- 🏗️ **Work Management**: Create and track construction works with financial reconciliation  
-  **Site Visits**: QC checklists with photo uploads and inspection reports  
- 🚜 **Equipment Management**: Inventory tracking and assignment  
- 👷 **Labour Logging**: Daily worker logs with cost tracking  
- 💰 **Financial Management**: Expense tracking & reconciliation  
- 🔔 **Real-time Notifications**: Client alerts for key events  
- 📅 **Timeline Tracking**: Work event history  
- 🛠️ **Admin Panel**: User management (CRUD)

---

## 🛠️ Setup Instructions

###  Prerequisites  
- Node.js (v14+)  
- npm  

### Installation

1. **Install dependencies**
   ```bash
   npm install
Start the json-server backend

npm run server


Server runs at: http://localhost:3001

Start the React development server

npm start


Frontend runs at: http://localhost:3000

Run both simultaneously

npm run dev

👤 Demo Accounts
Role	Username	Password
Admin	admin	admin123
Site Agent	agent1	agent123
Client	client1	client123
🔌 API Endpoints
🔐 Authentication

GET /users

POST /users

🏗️ Works Management

GET /works

GET /works/:id

POST /works

PATCH /works/:id

##Site Visits

GET /siteVisits

POST /siteVisits

🚜 Equipment

GET /equipment

PATCH /equipment/:id

👷 Labour Logs

GET /labourLogs

POST /labourLogs

💰 Finances

GET /finances

POST /finances

📅 Timeline

GET /timeline?workId=:id

POST /timeline

🔔 Notifications

GET /notifications?userId=:id

POST /notifications

PATCH /notifications/:id

📡 Example REST API Calls
➕ Create a Work
POST http://localhost:3001/works
Content-Type: application/json
{
  "title": "Foundation Work",
  "description": "Concrete foundation for Building A",
  "clientId": 3,
  "estimatedValue": 50000,
  "startDate": "2024-01-15",
  "endDate": "2024-02-15",
  "status": "in_progress",
  "createdBy": 1,
  "createdAt": "2024-01-10T10:00:00Z"
}

📝 Record Site Visit
POST http://localhost:3001/siteVisits
Content-Type: application/json
{
  "workId": 1,
  "visitDate": "2024-01-16",
  "inspector": "Site Agent",
  "qcChecklist": {
    "materialQuality": true,
    "safetyCompliance": true,
    "workmanship": false,
    "timelineAdherence": true
  },
  "notes": "Minor workmanship issues noted",
  "photos": ["photo1.jpg"],
  "createdAt": "2024-01-16T14:30:00Z"
}

🧱 Log Daily Labour
POST http://localhost:3001/labourLogs
Content-Type: application/json
{
  "workId": 1,
  "date": "2024-01-16",
  "workers": [
    {
      "name": "John Mason",
      "role": "mason",
      "hoursWorked": 8,
      "hourlyRate": 25
    }
  ],
  "totalCost": 200,
  "createdAt": "2024-01-16T18:00:00Z"
}

## Acceptance Criteria
## Core Features

 Role-based auth

 Work management

 QC site visits

 Equipment assignment

 Labour logging

 Financial tracking

 Timeline events

 Notifications

 Admin panel

✅ Technical Requirements

 React SPA

 json-server backend

 Fetch API only

 Protected routes

 Mock authentication

## Business Logic

 Client notifications on events

 Auto financial reconciliation

 Equipment tracking

 Labour → automatic cost entries

 Timeline tracking

🏛️ Architecture
Frontend Structure
src/
├── components/
├── pages/
├── hooks/
├── utils/
└── App.js

Backend Schema

users

works

siteVisits

equipment

labourLogs

finances

timeline

notifications

💰 Financial Reconciliation

Estimates vs actuals

Category cost breakdown

Variance analysis

Progress completion calculation

🔔 Notification System

Clients receive alerts for:

Work creation

Site visit completion

Equipment assignments

Financial updates

Timeline events

Labour activity

🔒 Security Notes

This is a demo system with:

Simple passwords

No encryption

Client-side only security

For production:

Use JWT

Add hashing

Server-side protection

Validation + sanitization

HTTPS

📸 Screenshots
![Dashboard Screenshot](./assets/dashboard.png)
![Equipment Page](./assets/equipment.png)
![Timeline View](./assets/timeline.png)

© Copyright

© 2025 — Construction Site Management System
Developed by Daniel Kamweru, Erasmus Kipkosgei, Joshua Muriki, and Brian Kimno.
All rights reserved.
