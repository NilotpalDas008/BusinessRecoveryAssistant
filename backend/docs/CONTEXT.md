# Current Project Context

## Project

Business Recovery Assistant

---

# Backend Module

Review AI Engine

---

# Purpose

The Review AI Engine is an independent backend module responsible for transforming raw customer reviews into actionable business insights using AI.

This module receives reviews from the frontend (Google Business API integration or CSV upload) and returns structured analytics.

---

# Current Sprint

Sprint 1

## Goal

Build the Review Intelligence Engine.

Current focus:

- AI Review Analysis
- Business Analytics
- JSON API

---

# My Responsibilities

I am responsible for implementing ONLY the Review AI Engine.

This includes:

- Review Analysis
- Sentiment Analysis
- Complaint Categorization
- Emotion Detection
- Urgency Detection
- Analytics Generation
- Trend Analysis
- Recurring Issue Detection
- Executive Summary Generation
- REST API for review analysis

---

# Out of Scope

I am NOT responsible for:

- Frontend
- Dashboard UI
- Authentication
- User Login
- Google OAuth
- CSV Upload UI
- Google Business API Integration
- WhatsApp Integration
- Instagram Integration
- Database Authentication
- Business Owner Management

Those modules are implemented by other team members.

---

# Existing Backend

The backend already contains:

- Express Server
- MongoDB Connection
- Business Owner Module
- Routing Infrastructure
- Environment Configuration

The Review AI Engine must integrate with the existing backend without modifying unrelated modules.

---

# Current Input

The frontend or another backend module will send reviews in the following format:

```json
{
  "businessId": "business_id",
  "reviews": [
    {
      "rating": 4,
      "text": "Food was amazing but service was slow.",
      "date": "2026-08-01"
    }
  ]
}
```

---

# Expected Output

The Review AI Engine returns structured JSON.

Example:

```json
{
  "summary": {},
  "sentimentScore": {},
  "complaintCategories": [],
  "trendsOverTime": [],
  "topRecurringIssues": [],
  "reviews": []
}
```

---

# AI Model

Google Gemini 2.5 Flash

---

# Architecture Decision

Only ONE AI Agent will be used.

ReviewAnalysisAgent

Responsibilities:

- Understand customer reviews
- Detect sentiment
- Detect complaint category
- Detect emotion
- Detect urgency
- Generate short summary
- Suggest business action

All analytics, calculations and aggregations will be implemented using TypeScript.

Gemini must NOT be used for:

- Counting
- Percentages
- Trends
- Charts
- Statistics
- Analytics

---

# Technology Stack

Language

- TypeScript

Framework

- Express.js

Database

- MongoDB

ODM

- Mongoose

AI

- Google Gemini 2.5 Flash

Runtime

- Node.js

---

# Development Principles

- Follow SOLID principles.
- Keep controllers thin.
- Business logic belongs inside services.
- AI reasoning belongs inside the ReviewAnalysisAgent.
- Store prompts separately.
- Never hardcode prompts.
- Always return structured JSON.
- Use strict TypeScript.
- Never use `any`.

---

# Integration Rules

The Review AI Engine must behave as an independent module.

It communicates with the frontend only through REST APIs.

It must not directly depend on frontend components.

It must not modify existing backend modules unless explicitly required.

---

# Current Status

Completed

- Documentation
- Backend Setup
- MongoDB Connection
- Business Owner Module

In Progress

- Review AI Engine

Pending

- Review Analysis Agent
- Gemini Integration
- Analytics Engine
- Trend Analysis
- API Endpoints
- Testing

---

# Important Notes

Every new feature should be implemented inside the Review AI Engine module.

Do not modify existing backend files unless integration requires it.

Respect the existing project architecture.

When uncertain, ask for clarification instead of making assumptions.