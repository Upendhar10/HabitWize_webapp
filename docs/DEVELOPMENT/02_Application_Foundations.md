# Application Foundations

This phase establishes the foundational structure of the each application (frontend & backend) before implementing any app-specific functionality.

The goal is to set up the development environment and core configurations required to build and maintain a modern full-stack application.

This phase includes:

- Setting up the frontend and backend folders.
- Configuring database connection and routes management at the backend
- Configuring client-server communication, routing and state management at the frontend

---
 
## 1. Backend App Foundations

### 1.1 `chore(backend): configure express application foundation`

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