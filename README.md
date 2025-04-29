# 🩺 Doctor Appointment Booking System

A full-featured doctor appointment booking system built with **Next.js**, **PostgreSQL**, **Prisma**, and **NextAuth.js**. Users can sign in, view doctors, check available time slots, and book appointments with real-time validation. Admins can manage doctor schedules, and the platform sends email confirmations upon successful bookings.

---

## 🚀 Features

### ✅ User Features
- Sign up/in via credentials or Google (NextAuth.js)
- View doctor profiles and available time slots
- Book appointments (with validation and email confirmation)
- View and edit personal profile details
- Mobile-responsive design with clean UI

### 🛠️ Admin Features
- View all appointments
- Prevent double bookings and invalid times

### 🛠 Doctor Features
- View all appointments
- Prevent double bookings and invalid times

---

## 🧰 Tech Stack

| Layer         | Technology                |
|---------------|---------------------------|
| **Frontend**  | Next.js (Page Router), Tailwind CSS |
| **Backend**   | API Routes in Next.js     |
| **Database**  | PostgreSQL + Prisma ORM   |
| **Auth**      | NextAuth.js (Google + Credentials) |
| **Email**     | Email confirmation via NodeMailer |
| **State**     | React Hooks & Context     |

