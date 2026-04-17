# Sentinel
### Intelligent Alert Routing and Escalation Platform

---

## What Is This

Sentinel is a full-stack incident management platform. It sits between your monitoring tools and your engineering team — receiving alerts, deciding who should be notified, sending emails, and escalating automatically if nobody responds.

The goal was to understand how systems like PagerDuty actually work under the hood: how they ensure alerts are delivered reliably, handle duplicate noise, and enforce accountability through escalation chains.

The frontend provides a dashboard to view alerts, track status, and manage teams and escalation policies.

---

## Deployment

| Service | URL |
|---|---|
| Frontend | https://sentinel-sesd-project.vercel.app |
| Backend | https://sesd-project-gsni.onrender.com |

>Backend runs on Render's free tier — first request after inactivity takes ~30 seconds.

---

## How It Works

An external system sends a POST request to `/api/alerts`. From there:

```
Incoming alert
      |
      |-- Is this a duplicate? → increment counter, stop
      |
      |-- Route to correct team
      |
      |-- Notify engineers via email
      |
      |-- Start escalation timer
            |
            |-- Engineer acknowledges? → cancel timer
            |
            |-- No response? → notify next level
                  |
                  |-- Repeat until resolved
```

Every action — alert received, email sent, escalated, acknowledged, resolved — is logged with a timestamp.

---

## Tech Stack

**Backend**

| | |
|---|---|
| Language | TypeScript |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Job Scheduling | Agenda.js |
| Email | Resend |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Logging | Winston |

**Frontend**

| | |
|---|---|
| Framework | Next.js (App Router) |
| Components | ShadCN UI |

**Infrastructure**

| | |
|---|---|
| Backend | Render |
| Frontend | Vercel |
| Database | MongoDB Atlas |

---

## Architecture

The backend follows a strict three-layer pattern per module:

```
Controller    handles HTTP — reads request, sends response
Service       owns business logic — routing, deduplication, state transitions
Repository    owns database — all Mongoose queries live here
```

No layer reaches across. Services never touch Mongoose. Controllers never write queries.

**Patterns used:**

**Strategy Pattern** — notifications are built around a `NotificationChannel` interface. `EmailChannel` implements it. `WebhookChannel` implements it. Adding SMS or Slack means writing one new class — nothing else changes.

**State Machine** — alert status is enforced at the service layer. An acknowledged alert cannot be acknowledged again. A resolved alert cannot be re-resolved. Invalid transitions throw errors before they reach the database.

**Repository Pattern** — every module has a dedicated repository class. Swapping MongoDB for another database means rewriting repositories only.

---

## API

**Users**

| Method | Endpoint | Auth | |
|---|---|---|---|
| POST | /api/users/register | Public | Create account |
| POST | /api/users/login | Public | Get JWT token |
| GET | /api/users | Admin | List all users |
| GET | /api/users/:id | Authenticated | Get user by ID |

**Alerts**

| Method | Endpoint | Auth | |
|---|---|---|---|
| POST | /api/alerts | Public | Ingest alert from external system |
| GET | /api/alerts | Authenticated | List all alerts |
| GET | /api/alerts/:id | Authenticated | Get alert details |
| PATCH | /api/alerts/:id/acknowledge | Authenticated | Acknowledge alert |
| PATCH | /api/alerts/:id/resolve | Authenticated | Resolve alert |

**Teams**

| Method | Endpoint | Auth | |
|---|---|---|---|
| POST | /api/teams | Admin | Create team |
| GET | /api/teams | Authenticated | List teams |
| GET | /api/teams/:id | Authenticated | Get team |
| DELETE | /api/teams/:id | Admin | Delete team |

**Escalation Policies**

| Method | Endpoint | Auth | |
|---|---|---|---|
| POST | /api/escalation-policies | Admin | Create policy |
| GET | /api/escalation-policies/:teamId | Authenticated | Get policy |
| PUT | /api/escalation-policies/:teamId | Admin | Update policy |

---

## Version 1

What shipped:

- Alert ingestion with automatic deduplication
- Email notifications on alert creation
- Configurable escalation policies per team
- Level-based escalation with custom delays (Agenda.js — crash safe)
- Full alert lifecycle: Triggered → Acknowledged → Resolved
- JWT authentication with Admin and Responder roles
- Dashboard with severity breakdown and recent activity
- Team and user management
- Deployed end to end

Known gaps:

- Users are not formally linked to teams in the schema. Escalation targets are assigned manually through policy configuration.
- Dashboard refreshes by polling. No WebSocket support yet.
- Discord and Slack channels are built but not active in the current deployment.

---

## Version 2

**Notifications**
- Discord and Slack webhooks
- SMS (Twilio)

**Escalation**
- Named hierarchy: Engineer, Team Lead, Manager
- Per-level acknowledgement tracking

**Teams**
- Formal user-to-team assignment in the schema
- On-call schedule support

**Dashboard**
- Live updates via WebSockets or Server-Sent Events
- MTTA and MTTR metrics
- Alert volume trends

**Infrastructure**
- End-to-end test coverage
- Per-key rate limiting for alert ingestion

---

## Documentation

| File | Description |
|---|---|
| [idea.md](/diagram/idea.md) | Problem statement and project scope |
| [useCaseDiagram.md](/diagram/useCaseDiagram.md) | Actors and system capabilities |
| [sequenceDiagram.md](/diagram/sequenceDiagram.md) | End-to-end alert lifecycle |
| [classDiagram.md](/diagram/classDiagram.md) | OOP system design |
| [ErDiagram.md](/diagram/ErDiagram.md) | Database schema |

---

## License

MIT