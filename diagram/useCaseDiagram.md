# Use Case Diagram — Sentinel

## Overview

This diagram shows all major use cases for the Sentinel platform, organized by the three primary actors: **External System**, **Responder (Engineer)**, and **Admin**.

---

```mermaid
graph TB
    subgraph Sentinel Platform
        UC1["Send Alert (Webhook API)"]
        UC2["View Active Incidents"]
        UC3["Acknowledge Alert"]
        UC4["Resolve Alert"]
        UC5["View Incident Timeline"]
        UC6["Configure Routing Rules"]
        UC7["Configure Escalation Policy"]
        UC8["Manage Teams & Users"]

        %% System behavior
        UC13["Deduplicate & Route"]
        UC9["Notify User"]
        UC10["Retry Notification"]
        UC11["Escalate Alert"]
        UC12["Record Event Log"]
    end

    External((External System))
    Responder((Responder / Engineer))
    Admin((Admin))

    %% External system actions
    External --> UC1

    %% Responder actions
    Responder --> UC2
    Responder --> UC3
    Responder --> UC4
    Responder --> UC5

    %% Admin actions
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC5

    %% System automatic behavior
    UC1 --> UC13
    UC13 --> UC9
    UC9 --> UC12
    UC9 -->|if failed| UC10
    UC9 -->|if timeout| UC11
    UC3 --> UC12
    UC3 -.->|stops escalation| UC11
