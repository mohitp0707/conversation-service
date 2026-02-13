# Conversation Service

A production-ready NestJS backend service for managing conversation sessions and events.

This service demonstrates clean architecture, DTO validation, MongoDB integration, Swagger documentation, and transaction support.

---

# Project Overview

The Conversation Service allows:

- Creating conversation sessions
- Tracking session lifecycle
- Adding events to sessions
- Managing event metadata
- Validating all incoming data
- Viewing interactive API documentation via Swagger

---

# Architecture

Controller → Service → Mongoose Model → MongoDB

Additional Layers:
- DTO validation using class-validator
- Automatic request transformation
- Enum-based strict typing
- Swagger documentation generation

---

# Tech Stack

- Node.js
- NestJS
- MongoDB
- Mongoose
- class-validator
- class-transformer
- Swagger (OpenAPI)

---

# Project Structure

src/
├── main.ts
├── app.module.ts
├── sessions/
│ ├── session.controller.ts
│ ├── session.service.ts
│ ├── session.module.ts
│ ├── dto/
│ │ ├── create-session.dto.ts
│ │ └── add-event.dto.ts
│ └── schemas/
│ ├── session.schema.ts
│ └── event.schema.ts

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/mohitp0707/conversation-service.git
cd conversation-service
npm install
npm start