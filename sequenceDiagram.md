# Sequence Diagram — Sentinel

## Main Flow: End-to-End Incident Lifecycle (Alert → Escalation → Resolution)

This sequence diagram illustrates the complete lifecycle of an incident — from an external monitoring system triggering an alert, routing it to the correct team, escalating if ignored, and finally resolution by an engineer.

---

```mermaid
sequenceDiagram
    actor Ext as External Service
    actor Eng as Engineer (Responder)

    participant API as Alert API
    participant Rule as Routing Engine
    participant Policy as Escalation Policy Engine
    participant Notify as Notification Service
    participant Log as Event Log Service
    participant DB as Database
    participant Timer as Escalation Scheduler

    Note over Ext,DB: Phase 1 — Alert Ingestion & Deduplication

    Ext ->> API: POST /alerts (source, severity, message)
    API ->> DB: Check for existing open alert (deduplication)
    
    alt Alert is Duplicate
        DB -->> API: Found existing alert
        API ->> DB: Update alert (increment count / update timestamp)
        API ->> Log: Record "Duplicate alert received"
        Note right of API: Stop processing (No new notification)
    else Alert is New
        DB -->> API: No duplicate found
        API ->> DB: Create new Alert
        API ->> Log: Record "Alert Created"

        Note over Ext,DB: Phase 2 — Routing Decision

        API ->> Rule: evaluateRoutingRules(alert)
        Rule ->> DB: Fetch routing rules
        DB -->> Rule: Matching team/users
        Rule -->> API: Responsible responders
        API ->> Policy: loadEscalationPolicy(team)

        Note over Ext,DB: Phase 3 — First Notification

        API ->> Notify: sendNotification(level1 responders)
        Notify ->> DB: Save notification attempt
        Notify ->> Eng: Deliver alert message
        Notify ->> Log: Record "Notification Sent"

        API ->> Timer: Start escalation timer

        Note over Ext,DB: Phase 4 — Escalation (If Ignored)

        alt Not acknowledged within timeout
            Timer ->> Policy: nextEscalationLevel()
            Policy ->> Notify: escalate to next level
            Notify ->> Eng: Notify higher authority
            Notify ->> Log: Record "Escalated"
        end

        Note over Ext,DB: Phase 5 — Acknowledgement

        Eng ->> API: Acknowledge Alert
        API ->> DB: Update status = ACKNOWLEDGED
        API ->> Timer: Cancel escalation
        API ->> Log: Record "Acknowledged"

        Note over Ext,DB: Phase 6 — Resolution

        Eng ->> API: Resolve Alert
        API ->> DB: Update status = RESOLVED
        API ->> Log: Record "Resolved"
    end
```
