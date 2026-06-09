#  FinSight – Personal Finance Management System

FinSight is a full-stack personal finance management application designed to help users track their income, expenses, budgets, savings goals, and financial activities in one place. The application provides interactive dashboards, smart financial insights, notifications, and secure authentication to improve personal financial planning.

---

##  Features

###  User Features

* User Registration and Login
* JWT Authentication
* Forgot Password using Email OTP
* Profile Management with Photo Upload
* Change Password

###  Financial Management

* Income Tracking
* Expense Tracking
* Budget Management
* Savings Goal Tracker
* Recurring Transactions
* Category-wise Expense Analysis

### 📊 Dashboard & Reports

* Interactive Dashboard
* Pie Chart and Bar Chart Analytics
* Smart Financial Insights
* Budget Usage Alerts
* PDF Financial Report Download

###  Notifications

* Budget Warning Notifications
* Budget Exceeded Alerts

###  Admin Features

* Admin Dashboard
* View All Users
* Monitor Financial Statistics

###  User Experience

* Responsive Design
* Sidebar Navigation
* Dark / Light Theme Support

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Recharts
* CSS

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT Authentication
* JavaMailSender
* iText PDF

### Database

* MySQL

---

## 📸 Screenshots

Screenshots of the application are available in the `screenshots` folder.

---

## ⚙️ How to Run the Project

### Backend Setup

1. Create MySQL database:

```sql
CREATE DATABASE finsightdb;
```

2. Configure `application.properties`.

3. Run Spring Boot application.

Backend runs on:

```txt
http://localhost:8080
```

---

### Frontend Setup

Install dependencies:

```bash
npm install
```

Run application:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

##  Project Highlights

* Secure JWT-based authentication system.
* OTP-based password recovery using email verification.
* Real-time financial insights and budget monitoring.
* Interactive charts for income and expense analysis.
* Professional profile management with photo upload.
* Admin dashboard for system monitoring.
* PDF financial report generation.

---
