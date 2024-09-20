# Blog Application with Django and React

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Backend Setup (Django)](#backend-setup-django)
- [Frontend Setup (React)](#frontend-setup-react)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

## Project Overview

This is a full-stack blog application built using **Django** for the backend and **React** for the frontend. The application allows users to register, log in, create blog posts, update their profiles, and manage their posts. Authentication is handled using **JWT** (JSON Web Token), ensuring secure access to protected routes.

## Tech Stack

- **Backend**: Django, Django REST Framework
- **Frontend**: React, Axios, React Router
- **Database**: SQLite (can be switched to PostgreSQL for production)
- **Authentication**: JWT (JSON Web Token)
- **Deployment**: [Heroku/DigitalOcean/AWS] (planned)

## Features

- **User Authentication**: Registration, login, and logout using JWT tokens.
- **Blog Post Management**: Users can create, read, update, and delete blog posts.
- **Profile Management**: Users can update their profiles, including uploading profile pictures.
- **Protected Routes**: Only authenticated users can create/edit posts and update their profiles.
- **Token Refreshing**: Access tokens can be refreshed using refresh tokens without re-login.

## Installation

### Prerequisites
- Python 3.x
- Node.js & npm
- Django
- React
- SQLite (or PostgreSQL for production)

### Backend Setup (Django)

1. Clone the repository:
   ```bash
   git clone https://github.com/meta-bay/LogB.git
   cd LogB
   ```

2. Set up a virtual environment and activate it:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```bash
   cd backend/django_logb
   python manage.py migrate
   ```

5. Create a superuser to access Django Admin:
   ```bash
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend/react_logb
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

## Running the Application

To run the application, follow these steps:

1. **Backend** (Django):
   ```bash
   python manage.py runserver
   ```

2. **Frontend** (React):
   ```bash
   cd frontend/react_logb
   npm start
   ```

The backend will run on `http://localhost:8000`, and the frontend will run on `http://localhost:3000`.

## API Endpoints

Here are the key API endpoints provided by the Django backend:

- **User Authentication**:
  - `POST /api/token/`: Obtain JWT access and refresh tokens.
  - `POST /api/token/refresh/`: Refresh the access token using the refresh token.

- **User Profile**:
  - `GET /api/users/me/`: Get the authenticated user's profile details.
  - `PATCH /api/users/me/`: Update the user's profile.

- **Blog Posts**:
  - `GET /api/posts/`: Retrieve a list of all blog posts.
  - `POST /api/posts/`: Create a new blog post (requires authentication).
  - `GET /api/posts/:id/`: Retrieve a specific blog post by ID.
  - `PUT /api/posts/:id/`: Update a blog post (requires authentication).
  - `DELETE /api/posts/:id/`: Delete a blog post (requires authentication).
