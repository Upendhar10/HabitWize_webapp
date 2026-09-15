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

### 1.2 `feat(backend): establish database connection with express app using mongoose`

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

### 1.3 `feat(backend): introduce centralized application error handling`

**What I did**

- **Introduced an application-level error abstraction** in `@/errors/application.errors.ts` to standardize predictable, operational errors across the backend. This new `ApplicationError` class extends JavaScript's native `Error` and adds structured metadata:
  * `statusCode` — HTTP status associated with the error.
  * `errorCode` — application-specific error identifier.
  * `message` — human-readable error description.
  * `isOperational` — distinguishes expected application errors from unexpected programming/system failures.
- **Implemented a global Express error-handling middleware** using TypeScript's `ErrorRequestHandler` type. This middleware provides a single entry point for backend errors:
  * Known `ApplicationError` instances are converted into a consistent API response.
  * Unexpected errors are logged on the server and returned as a generic `500 Internal Server Error`.
  * Internal error details are not exposed to clients, reducing accidental leakage of implementation details.
- **Added a reusable `NotFoundError` application error** for resource lookup failures This creates a semantic error type for cases such as a missing user, post, order, or other resource while keeping the HTTP status and application error code consistent.

**Why**

Instead of inconsistently handling errors across individual routes, controllers, or services. This configuration establishes a centralized error-handling strategy for the backend. 

The main goals were to:
- **Standardize API error responses** so clients receive a predictable structure.
- **Separate expected application errors from unexpected failures** through `ApplicationError` and `isOperational`.
- **Centralize error handling** instead of duplicating `try/catch` response logic throughout the application.
- **Provide meaningful HTTP status codes and application error codes** for known failures.
- **Prevent sensitive internal error information from reaching clients** when an unexpected exception occurs.
- **Make the error system extensible**, allowing additional domain-specific errors to inherit from `ApplicationError`.
- **Improve maintainability and debugging** by preserving stack traces while keeping client-facing errors clean.

---

### 1.4 `feat(backend): introduce centralized logging system`

**What I did**

- **Installed Pino** as the application's structured logging library via `npm i pino`
- Pino provides a fast, structured logger suitable for production Node.js applications.
- **Installed Pino Pretty as a development dependency** to make logs easier to read during local development using `npm i -D pino-pretty`
- **Created and configured a centralized logger** using Pino at `@/config/logger.config.ts`, This logger behaves differently depending on the environment:

    **Development**

    * Uses `pino-pretty` for human-readable terminal output.
    * Enables colored logs.
    * Formats timestamps as `HH:MM:ss`.
    * Hides `pid` and `hostname` to keep local logs concise.

    **Production**

    * Uses Pino's default structured JSON output.
    * Does not load `pino-pretty`, keeping production logging machine-readable and suitable for log aggregation and monitoring systems.
- **Replaced existing `console`-based logging** in `@/index.ts` with the centralized Pino logger.

**Why**

- Pino establishes a **single logging mechanism across the backend** instead of relying on scattered `console.log` statements.
- This centralized logger makes logging more consistent and gives the application a foundation for structured observability. 
- Each log entry can carry a log level, message, and additional metadata, which becomes especially useful when debugging requests or integrating with production log-management and monitoring platforms.
- Using different transports for development and production also keeps the developer experience convenient without sacrificing machine-readable logs in production.

---

### 1.5 `chore(backend): establish security baseline using helmet & rate-limiting`

**What I did**

- **Installed Helmet** as a backend security dependency using `npm i helmet`
- Helmet helps secure Express applications by setting a collection of HTTP response headers that reduce exposure to common browser-based attacks and unsafe defaults.
- **Installed `express-rate-limit`** to introduce request-rate limiting using `npm i express-rate-limit`
- This provides a configurable middleware for limiting the number of requests a client can make within a defined time window.
- **Configured a centralized rate limiter** according to the project's initial API requirements:
- The current configuration provides:
  * **15-minute request window**
  * **100 requests per IP per window**
  * **Standard `RateLimit` response headers**
  * **Legacy `X-RateLimit-*` headers disabled**
  * **IPv6 subnet handling** configured to `/56`
- **Added the security middleware to the Express application** at `@/app.ts`, allowing the security controls to be applied centrally rather than individually across routes. This establishes the security baseline at the application level.

**Why**

The idea is to establish the first layer of **defense-in-depth** for the backend.
- Express applications are exposed to the public internet, so relying only on application-level validation is not enough. Helmet and rate limiting address two important baseline concerns:
- **Helmet** helps harden the application's HTTP responses by applying security-related headers and reducing exposure to several common web vulnerabilities and browser misconfigurations.
- **Rate limiting** helps control excessive request volume from individual clients. It can reduce the impact of accidental request floods, abusive clients, simple denial-of-service attempts, and brute-force-style traffic.
- Centralizing both mechanisms also makes the security configuration easier to maintain and adjust as the application grows.

---

### 1.6 `chore(backend): establish api route architecture`

**What I did**

* Attached the centralized router to **`@/app.js`** with API versioning under **`/api/v1`**, establishing a consistent structure and allowing future versions such as **`/api/v2`** without disrupting existing clients.
* Created a centralized router at **`@/routes/index.ts`** to serve as the main entry point for API routes.
  - Keeps route definitions separate from application configuration.
  - Allows routes to be organized by feature or module as the API grows.
* Added fallback middleware for undefined routes, forwarding unmatched requests as `NotFoundError` to the centralized error handler for consistent error handling.
* Added a temporary health-check endpoint:
  ```text
  GET /api/v1/healthcheck
  ```
  returning the API **status**, response **timestamp**, and process **uptime**. This can later be extended to include dependency checks.

**Why**

* Establishes the foundation for a scalable and maintainable API architecture before feature-specific routes are introduced.
* Separates server configuration from route definitions, keeping **`@/app.js`** focused on application setup and making individual modules easier to develop, test, and extend.
* Introduces API versioning and a predictable routing structure from the start.

---

### 1.7 `chore(backend): define API response contract`

**What I did**

* Defined the successful API response contract**
  - Added a generic `ApiSuccessResponse<T>` interface under `@/utils/types`.
  - Standardized successful API responses with the following structure:
    ```ts
    export interface ApiSuccessResponse<T> {
      success: true;
      message: string;
      data: T;
    }
    ```
  - Used an `interface` because the response contract represents a named object shape.
  - Made the response generic with `T` so `data` can represent any payload type while preserving type safety.
  - Used `T` instead of `{}` because `{}` is too broad and does not describe the actual structure of the response data, whereas TypeScript automatically infers `T` from the `data` argument, so callers do not need to explicitly specify the generic type.
* Implemented a reusable success response helper
  - Added `sendSuccessResponse<T>()` to centralize the creation and sending of successful HTTP responses.
  - The helper accepts:
      * `data` — the response payload.
      * `message` — an optional custom success message, defaulting to `"Success"`.
      * `statusCode` — the HTTP status code, defaulting to `200`.
  - Typed the constructed response as `ApiSuccessResponse<T>` at `@/utils/types` to ensure that the implementation conforms to the defined API contract.
  - Established a consistent response structure containing `success`, `message`, and `data` across successful endpoints.
  - Used a type-only import for Express's `Response` because it is required only at compile time.

**Why**

- Establishes a **consistent and predictable contract** for all successful API responses.
- Keeps response payloads **type-safe** by preserving the actual type of `data` through the generic `T`.
- Allows the same response contract to support different payloads, such as a single object, an array, or other valid data types.
- Centralizes response formatting in `sendSuccessResponse<T>()`, preventing controllers from manually constructing responses and introducing inconsistencies.
- Separates the **API response contract** from the application's error-handling mechanism, allowing successful responses and application errors to be handled independently.

---

### 1.8 `feat(backend): add request validation with zod`

**What I did**

* Added reusable request-validation middleware
  - Introduced a validation middleware to validate incoming HTTP request bodies against Zod schemas at `@/middleware/validation.middleware.ts`
  - Used Zod's `safeParse()` API to validate input without relying on exceptions for expected validation failures.
  - Allowed each route to provide its own schema while keeping the validation mechanism centralized and reusable.
  - Replaced `req.body` with Zod's parsed result after successful validation so that any supported transformations or coercions are propagated to the controller.

* Integrated Zod with the application's error hierarchy
  - Converted Zod validation failures into the existing `ValidationError`, keeping validation errors consistent with the application's `ApplicationError` architecture.
  - Passed `result.error.issues` to `ValidationError` so that structured field-level validation information is preserved.
  - Extended `ApplicationError` with an optional `details` property to carry additional error information through the application error hierarchy.
  - Updated `ValidationError` to forward validation details to `ApplicationError`.

* Integrated validation errors with the centralized error handler
  - Kept HTTP error-response formatting centralized in `errorHandler` at `@/middleware/error.middleware.ts`
  - Standardized validation failures to the existing API error structure:
    ```ts
    {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: [...]
      }
    }
    ```
  - Preserved the existing fallback handling for unexpected errors using `INTERNAL_SERVER_ERROR`.
  - Ensured Zod-specific errors do not leak beyond the validation layer and are instead represented through the application's own error types.

* Established a clear boundary between request and business validation
  - Established Zod as the mechanism for validating incoming HTTP request data against predefined schemas.
  - Reserved business and domain rules within the controller/service/application layer rather than coupling them to request-schema validation.
  - Reserved specialized `ApplicationError` subclasses for application-level failures such as conflicts, authorization failures, missing resources, and other business-rule violations.

**Why**

* **Centralizes request validation:** A reusable Zod middleware allows routes to define their own validation schemas without duplicating validation logic.
* **Provides runtime validation:** TypeScript types are removed at runtime, whereas Zod actively validates data received from external sources such as HTTP requests.
* **Preserves structured validation details:** Zod provides detailed validation issues, which are carried through `ApplicationError.details` and can be returned to clients in a consistent format.
* **Maintains separation of concerns:** Zod is responsible for request-schema validation, `ValidationError` represents the failure within the application, and `errorHandler` translates application errors into HTTP responses.
* **Keeps the application independent of Zod-specific errors:** Converting `ZodError` into `ValidationError` prevents the rest of the application from depending directly on Zod's error model.
* **Preserves parsed and transformed data:** Assigning `result.data` back to `req.body` ensures controllers work with Zod's validated and transformed output rather than the original unvalidated input.
* **Separates schema validation from business rules:** Conditions such as resource uniqueness, authorization, or database state remain the responsibility of the appropriate application/service layer.
* **Provides a foundation for future request validation:** Although the middleware currently validates `req.body`, the same approach can later be extended to `req.params`, `req.query`, headers, and other request components.

---

--------
--------

## 2. Frontend App Foundations

### 2.1 `chore(frontend): establish frontend application structure`

**What I did**

- Created a clean and predictable `src` structure with a clear responsibility for each directory.
- Established the initial application structure for:
  - Application-level infrastructure
  - Feature modules
  - Shared UI components
  - Layouts
  - API and service communication
  - Redux state management
  - Global styling
  - Shared types
  - Utilities
  - Application configuration

  ```text
  src/
  │
  ├── app/                           # Application-wide infrastructure
  │   ├── router/                    # Application routing
  │   └── store/                     # Redux store configuration
  │
  ├── features/                      # Business/application features
  │   ├── auth/
  │   ├── habits/
  │   │   ├── components/            # Feature-specific UI
  │   │   ├── pages/                 # Feature-specific pages
  │   │   ├── services/              # Feature-specific API/application services
  │   │   ├── hooks/                 # Feature-specific hooks
  │   │   ├── habits.slice.ts        # Feature-specific Redux state
  │   │   └── habits.types.ts        # Feature-specific types
  │   │
  │   └── ...
  │
  ├── components/                    # Shared reusable UI
  │
  ├── layouts/                       # Application/page structural layouts
  │
  ├── services/                      # Shared infrastructure services
  │
  ├── styles/                        # Global styling foundation
  │   └── global.css
  │
  ├── types/                         # Shared types
  │
  ├── utils/                         # Generic utilities
  │
  ├── config/                        # Application configuration
  │
  ├── App.tsx                        # Root React application
  └── main.tsx                       # Application entry point
  ```
- Moved global css configuration to `src/styles/global.css` for better application structure.
- Added path alias configuration to `tsconfig.json` as well.

**Why**

- Establish a predictable structure for upcoming application and infrastructure concerns.
- Define clear boundaries between different responsibilities.
- Keep application-level infrastructure separate from business features.
- Separate reusable UI, layouts, routing, API communication, state management, styling, and shared utilities.
- Provide a scalable foundation for implementing future features without prematurely introducing feature-specific code.

---