# Sentinel — Intelligent Alert Routing & Escalation Platform

## Overview
**Sentinel** is an intelligent incident management platform. It acts as the central nervous system for engineering teams, ingesting failure alerts from external services (server crashes, payment failures, API timeouts) and ensuring the right person is notified immediately.

Instead of blasting emails to everyone, Sentinel uses **rule-based routing, on-call schedules, and automated escalation policies** to guarantee accountability and faster resolution.

---

##  Users & Actors

- **External System** — Monitoring services that send alerts through API.
- **Responder (Engineer)** — Receives alerts and acknowledges incidents.
- **Admin** — Configures routing rules and escalation policies.

##  System Boundary

Sentinel does not detect failures itself; it acts as an **alert aggregation and response orchestration layer** between monitoring tools and engineers.

---

##  Key Features

### 1. Alert Ingestion & Intelligence
- **Universal API**: Accepts alerts from any monitoring tool via webhook.
- **Deduplication**: Automatically groups repeated identical alerts to prevent noise.
- **Smart Routing**: Directs alerts to specific teams (e.g., "Payment failures" → FinTech Team) based on severity and source.

### 2. Reliable Notification System
- **Multi-Channel Delivery**: Sends notifications via Email, Webhooks (Slack/Discord simulation), and SMS (future).
- **Resilience**: Built-in retry mechanism for failed deliveries.
- **Failover**: If a primary channel fails, automatically tries backup channels.

### 3. Escalation & Workflow
- **Escalation Policies**: Define a chain of command. If the primary on-call engineer doesn't acknowledge within $X$ minutes, escalate to the manager.
- **Lifecycle Tracking**: Tracks alert state: `Triggered` → `Acknowledged` → `Resolved`.
- **Audit Trail**: Every action (alert received, notified, escalated, acknowledged) is immutably logged for post-mortem analysis.

---

## Tech Stack & Architecture

**Core Backend:**
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js 
- **Database**: MongoDB
- **Architecture**: Modular Controller-Service-Repository pattern.

**Frontend:**
- **UI**: Next.js (Minimalist operations dashboard)

**Concepts Applied:**
- **Strategy Pattern**: For pluggable notification channels (Email vs Slack).
- **State Machine**: For managing incident lifecycles.
- **Background Jobs**: For processing delayed escalations (using `setTimeout` mechanisms).

---

## Project Scope

### In Scope (MVP)
- REST API for Alert Ingestion
- Configurable Routing Rules & Escalation Policies
- Simulated Notification Channels (Email/Webhook logs)
- React Admin Dashboard for manual acknowledgement
- Full detailed Incident Timeline

### Out of Scope
- Real SMS/Phone call integration (requires paid APIs)
- Complex On-call rotation scheduling (calendars)
- Native Mobile App
