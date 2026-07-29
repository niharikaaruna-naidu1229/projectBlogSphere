# 📝 BlogSphere – Blogging & Content Management CMS

BlogSphere is a full-stack Blogging and Content Management System (CMS) built using the MERN stack. It provides a complete platform where users can create, manage, and publish blog posts while allowing administrators to manage users and moderate content.

The application supports secure authentication, role-based access control, draft management, post review workflows, comments, likes, and a responsive user interface.

---

## 🚀 Live Project

🌐 **Frontend:**  
https://project-blog-sphere-btb3.vercel.app/

🔗 **Backend API:**  
https://projectblogsphere.onrender.com

💻 **GitHub Repository:**  
https://github.com/niharikaaruna-naidu1229/projectBlogSphere

---

## 📌 Project Overview

BlogSphere was developed as a full-stack CMS platform to simplify the process of creating and managing blog content.

The system provides different roles and permissions for:

- Authors
- Editors
- Administrators

Authors can create and manage their blog posts, save posts as drafts, and submit them for review.

Editors and administrators can review and manage content, while administrators can manage users and control platform activities.

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration
- Secure user login
- Password hashing using bcrypt
- Role-based access control
- Author, Editor, and Admin roles
- Secure logout functionality

### 📝 Blog Management

- Create new blog posts
- Edit blog posts
- Delete blog posts
- Save posts as drafts
- Submit posts for review
- Publish approved posts
- View published posts
- Search blog posts
- Add tags to posts
- Add cover images
- Reading time information

### 💬 Engagement Features

- View individual blog posts
- Add comments
- View comments
- Like posts
- Unlike posts
- Track post views

### 👨‍💼 Admin Features

- Admin dashboard
- View registered users
- Manage user accounts
- Change user roles
- Monitor blog posts

### 📊 Dashboard

Users can access a personalized dashboard to:

- View total posts
- View published posts
- Manage their own posts
- Track post views
- Submit posts for review

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- HTML5
- CSS3
- JavaScript
- Vite

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt.js
- Multer
- CORS

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Deployment

- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database

### Development Tools

- Visual Studio Code
- Git
- GitHub

---

## 🏗️ Project Architecture

```text
BlogSphere
│
├── client
│   ├── public
│   └── src
│       ├── components
│       ├── context
│       ├── pages
│       │   ├── admin
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── CreatePost.jsx
│       │   └── PostDetails.jsx
│       ├── services
│       │   └── api.js
│       ├── App.jsx
│       └── main.jsx
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── .env
│   └── server.js
│
├── README.md
└── package.json
