# Class Diagram — Sentinel

## Overview

This class diagram shows the major classes, attributes, methods, and relationships across the Sentinel platform.  
The design follows **Clean Architecture (Controller → Service → Repository)** and applies OOP principles and design patterns such as Strategy, State, and Chain of Responsibility.

---

```mermaid
classDiagram
    direction TB

%% ===================== DOMAIN MODELS =====================

class Alert {
    -id: string
    -title: string
    -message: string
    -severity: Severity
    -status: AlertStatus
    -createdAt: Date
    -acknowledgedAt: Date
    +acknowledge(userId: string): void
    +resolve(): void
}

class AlertStatus {
    <<enumeration>>
    TRIGGERED
    NOTIFIED
    ACKNOWLEDGED
    RESOLVED
}

class Severity {
    <<enumeration>>
    LOW
    MEDIUM
    HIGH
    CRITICAL
}

class User {
    -id: string
    -name: string
    -email: string
    -role: UserRole
}

class UserRole {
    <<enumeration>>
    RESPONDER
    ADMIN
}

class Team {
    -id: string
    -name: string
}

class IncidentEvent {
    -id: string
    -type: string
    -timestamp: Date
    -alertId: string
    -message: string
}

class NotificationAttempt {
    -id: string
    -alertId: string
    -userId: string
    -channel: string
    -status: string
    -sentAt: Date
}

%% Relationships
Team "1" --> "*" User : contains
Alert "1" --> "*" IncidentEvent : generates
Alert "*" --> "1" Team : assigned to
Alert "1" --> "*" NotificationAttempt : produces

%% ===================== ROUTING =====================

class RoutingRule {
    -id: string
    -condition: string
    -targetTeamId: string
    +matches(alert: Alert): boolean
}

class RoutingEngine {
    -rules: RoutingRule[]
    +evaluate(alert: Alert): Team
}

Team "1" --> "*" RoutingRule : defines
RoutingEngine --> RoutingRule
RoutingEngine --> Alert

%% ===================== ESCALATION =====================

class EscalationPolicy {
    -id: string
    -teamId: string
    -levels: EscalationLevel[]
}

class EscalationLevel {
    -level: number
    -delayMinutes: number
}

class EscalationScheduler {
    +start(alert: Alert): void
    +cancel(alertId: string): void
    +triggerNextLevel(alertId: string): void
}

Team "1" -- "1" EscalationPolicy : has
EscalationPolicy "1" *-- "*" EscalationLevel : contains
EscalationLevel --> User : notifies
EscalationScheduler --> EscalationPolicy
EscalationScheduler --> Alert

%% ===================== NOTIFICATION STRATEGY =====================

class NotificationChannel {
    <<interface>>
    +send(user: User, message: string): boolean
}

class EmailChannel
class WebhookChannel

NotificationChannel <|.. EmailChannel
NotificationChannel <|.. WebhookChannel

class NotificationService {
    -channels: NotificationChannel[]
    +notify(users: User[], alert: Alert): void
}

NotificationService --> NotificationChannel
NotificationService --> NotificationAttempt

%% ===================== SERVICES =====================

class AlertService {
    +createAlert(dto): Alert
    +acknowledgeAlert(alertId, userId): void
    +resolveAlert(alertId): void
}

class EventLogService {
    +record(event: IncidentEvent): void
}

AlertService --> RoutingEngine
AlertService --> NotificationService
AlertService --> EscalationScheduler
AlertService --> EventLogService

%% ===================== REPOSITORIES =====================

class IAlertRepository {
    <<interface>>
    +findOpenDuplicate(alert): Alert
    +save(alert: Alert): Alert
    +update(alert: Alert): void
}

class IUserRepository {
    <<interface>>
    +findByTeam(teamId): User[]
}

class IRoutingRuleRepository {
    <<interface>>
    +findAll(): RoutingRule[]
}

class IEventRepository {
    <<interface>>
    +save(event: IncidentEvent): void
}

AlertService --> IAlertRepository
RoutingEngine --> IRoutingRuleRepository
NotificationService --> IUserRepository
EventLogService --> IEventRepository
```

