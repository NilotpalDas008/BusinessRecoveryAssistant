# PROJECT.md

# Review AI Engine

## Overview

Review AI Engine is an AI-powered backend microservice responsible for analyzing customer reviews and generating structured business insights. The service acts as the intelligence layer of the Business Recovery Platform.

The frontend or another backend service is responsible for collecting reviews from Google Business Profile or CSV uploads. Once reviews are collected, they are sent to this service for AI-powered analysis.

This service uses Google's Gemini API to understand customer feedback and transform raw reviews into actionable business intelligence.

---

## Problem Statement

Businesses receive hundreds or even thousands of customer reviews across multiple platforms. Reading each review manually is impossible, making it difficult to identify:

- Why ratings are decreasing
- Which complaints occur most frequently
- Which issues require immediate attention
- Overall customer sentiment
- Business performance trends over time

This service solves that problem by automatically analyzing every review.

---

## Objectives

The service should:

- Analyze every review using AI
- Detect customer sentiment
- Categorize complaints
- Detect emotions
- Identify urgency
- Generate business analytics
- Detect recurring issues
- Generate trend analysis
- Return structured JSON

---

## Responsibilities

This service IS responsible for:

- Review Analysis
- Sentiment Analysis
- Complaint Categorization
- Emotion Detection
- Urgency Detection
- Analytics Generation
- Trend Analysis
- JSON API Response

---

## Out of Scope

This service is NOT responsible for:

- Frontend UI
- Authentication
- User Management
- Google OAuth
- CSV Upload Interface
- Database Management
- Dashboard Rendering
- WhatsApp Sending
- Instagram Posting

---

## Input

The service receives reviews from another backend service.

Example:

{
  "reviews": [
    {
      "rating": 2,
      "text": "Food was cold.",
      "date": "2026-07-31"
    }
  ]
}

---

## Output

The service returns AI-generated insights in JSON format.

Example:

{
  "summary": {},
  "sentimentScore": {},
  "complaintCategories": [],
  "trendsOverTime": [],
  "topRecurringIssues": [],
  "reviews": []
}

---

## Technology Stack

Language
- TypeScript

Framework
- Express.js

AI
- Gemini 2.5 Flash

Runtime
- Node.js

Package Manager
- npm

---

## Design Principles

- Keep controllers thin.
- Business logic belongs inside services.
- Every service should have a single responsibility.
- Every AI prompt must be stored separately.
- Return structured JSON only.
- Never return free-form AI text.