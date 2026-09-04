# Application Foundations

This phase establishes the foundational structure of the each application (frontend & backend) before implementing any app-specific functionality.

The goal is to set up the development environment and core configurations required to build and maintain a modern full-stack application.

This phase includes:

- Setting up the frontend and backend folders.
- Configuring database connection and routes management at the backend
- Configuring client-server communication, routing and state management at the frontend

---
 
## 1. Backend App Foundations

### 1.1 `chore(backend): configure and verify express server workflow`

**What I did**

- Installed **Express** and **CORS** as production dependencies using: `npm i express cors`
- Installed the corresponding **TypeScript type definitions** as development dependencies using: `npm i -D @types/cors @types/express`
- Created the initial **Express application** in `app.ts`.
- Configured and exported the Express application so it can be consumed by `index.ts`.
- Added typecheck and validation for `PORT` at `@/config/env.config.ts`.
- Set up the server entry point in `index.ts` to start the Express application on the configured `PORT`.
- Verified the setup by running the server and confirming that the application starts successfully.

**Why**

- Establishes the foundational backend structure for the application using **Express**, a lightweight Node.js web framework for building HTTP APIs and server-side applications.
- Adds **CORS (Cross-Origin Resource Sharing)** support, allowing the backend to handle requests from a frontend or other origins when required.
- Adds **TypeScript type definitions** for Express and CORS to provide type safety, better IDE support, and compile-time validation when working with JavaScript libraries that do not include their own TypeScript types.
* Separating the Express application (`app.ts`) from the server entry point (`index.ts`) keeps application configuration independent from server startup logic, making the codebase easier to test, maintain, and extend.

---

## 1.2 `feat(backend): establish database connection with express app using mongoose`

**What I did**

- Installed **Mongoose** as a production dependency using: `npm i mongoose`
- Updated `@/config/env.config.ts` to include the `MONGO_URI` environment variable along with the necessary validation.
- Implemented the initial database connection logic to connect the backend application to a **MongoDB Atlas** database.
- Added a `startServer` function responsible for initializing the application startup sequence.
- Configured the server to start listening for incoming requests **only after a successful database connection**.
- This ensures the backend does not accept requests when the required database connection has not been established.

**Why**

- Establishes the database layer required for persisting and retrieving application data.
- **Mongoose** is an ODM (**Object Data Modeling**) library for MongoDB and Node.js. It provides a structured API for connecting to MongoDB and interacting with collections and documents through models, schemas, queries, and built-in validation mechanisms.
- Keeping `MONGO_URI` in the environment configuration prevents database credentials and connection details from being hardcoded into the application source code.
- Starting the Express server only after successfully connecting to MongoDB ensures the application is ready to perform database-dependent operations before it begins handling requests.

---