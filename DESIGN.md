# DESIGN DOCUMENT – Conversation Service

This document explains the design decisions implemented in the current version of the Conversation Service.

The goal of this service is to manage conversation sessions and their related events using NestJS and MongoDB.

---

# How did you ensure idempotency?

## Session Creation

- `sessionId` is treated as a unique identifier.
- A unique index is applied on `sessionId` in the MongoDB schema.
- If a session with the same `sessionId` already exists, MongoDB prevents duplication.

This ensures that repeated session creation requests do not create multiple records.

---

## Event Addition

- Each event contains a unique `eventId`.
- Before adding a new event, the system checks if an event with the same `eventId` already exists inside the session.
- Duplicate events are rejected.

This makes event submission safe in retry scenarios.

---

# How does your design behave under concurrent requests?

MongoDB guarantees atomic operations at the document level.

Since:
- Each session is stored as a single document
- Events are embedded within the session document

Operations such as:
- `findOneAndUpdate`
- `$push`

are atomic for a single document.

This means:
- Multiple users modifying different sessions do not affect each other.
- Concurrent writes to the same session are handled safely at the document level.

Optional MongoDB transaction support is available for stronger consistency.

---

# What MongoDB indexes did you choose and why?

## Unique Index on sessionId

Index:
{ sessionId: 1 } (unique)

Why:
- Fast lookup by sessionId
- Prevent duplicate sessions
- Support idempotent session creation

---

## Index on events.eventId (within session)

Used to:
- Quickly check for duplicate events
- Improve event lookup performance

---

# How would you scale this system for millions of sessions per day?

Current design supports horizontal scaling because:

- The application is stateless.
- No in-memory session storage is used.
- All data is persisted in MongoDB.

To scale further:

- Deploy multiple NestJS instances behind a load balancer.
- Use MongoDB replica set for high availability.
- Use MongoDB sharding with `sessionId` as shard key.
- Move events to a separate collection if event size grows significantly.

---

# What did you intentionally keep out of scope, and why?

The following were intentionally excluded to keep the implementation focused:

- Authentication and Authorization (JWT, RBAC)
- Rate limiting
- Advanced logging and monitoring
- Caching layer (Redis)
- Separate event microservice

These are infrastructure or enhancement concerns and were not required for core session management functionality.

---

# Future Enhancements (Planned Improvements)

1. Move events to a separate collection for very large event histories.
2. Add JWT authentication and role-based access control.
3. Introduce Redis caching for active sessions.
4. Add pagination support for session events.
5. Add structured logging and monitoring.

---

# Summary

The system is:

- Idempotent for session creation and event addition
- Safe under concurrent document-level updates
- Indexed for performance
- Horizontally scalable
- Designed with clean NestJS modular architecture

The implementation focuses on correctness, clarity, and production-readiness without unnecessary complexity.
