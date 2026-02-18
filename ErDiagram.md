# ER Diagram — Sentinel

## Overview

This Entity-Relationship diagram defines the database schema for the Sentinel incident management platform.  
It models alerts, routing, escalation, notifications, and event logging.

---

```mermaid
erDiagram

    USERS {
        uuid id PK
        varchar name
        varchar email UK
        enum role "RESPONDER | ADMIN"
        timestamp created_at
    }

    TEAMS {
        uuid id PK
        varchar name
        timestamp created_at
    }

    TEAM_MEMBERS {
        uuid id PK
        uuid team_id FK
        uuid user_id FK
    }

    ALERTS {
        uuid id PK
        varchar title
        text message
        enum severity "LOW | MEDIUM | HIGH | CRITICAL"
        enum status "TRIGGERED | NOTIFIED | ACKNOWLEDGED | RESOLVED"
        uuid team_id FK
        uuid acknowledged_by FK
        timestamp created_at
        timestamp acknowledged_at
        timestamp resolved_at
    }

    ROUTING_RULES {
        uuid id PK
        varchar condition
        uuid team_id FK
        timestamp created_at
    }

    ESCALATION_POLICIES {
        uuid id PK
        uuid team_id FK
        timestamp created_at
    }

    ESCALATION_LEVELS {
        uuid id PK
        uuid policy_id FK
        int level_number
        int delay_minutes
    }

    ESCALATION_TARGETS {
        uuid id PK
        uuid level_id FK
        uuid user_id FK
    }

    NOTIFICATION_ATTEMPTS {
        uuid id PK
        uuid alert_id FK
        uuid user_id FK
        varchar channel
        enum status "PENDING | SENT | FAILED"
        timestamp sent_at
    }

    INCIDENT_EVENTS {
        uuid id PK
        uuid alert_id FK
        varchar type
        text message
        timestamp created_at
    }

%% ================= RELATIONSHIPS =================

    TEAMS ||--o{ TEAM_MEMBERS : contains
    USERS ||--o{ TEAM_MEMBERS : belongs

    TEAMS ||--o{ ROUTING_RULES : defines
    TEAMS ||--o{ ALERTS : handles

    ALERTS ||--o{ INCIDENT_EVENTS : logs
    ALERTS ||--o{ NOTIFICATION_ATTEMPTS : generates

    USERS ||--o{ NOTIFICATION_ATTEMPTS : receives
    USERS ||--o{ INCIDENT_EVENTS : triggers

    TEAMS ||--|| ESCALATION_POLICIES : has
    ESCALATION_POLICIES ||--o{ ESCALATION_LEVELS : contains
    ESCALATION_LEVELS ||--o{ ESCALATION_TARGETS : notifies
    USERS ||--o{ ESCALATION_TARGETS : assigned
```

