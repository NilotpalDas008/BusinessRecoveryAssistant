# AI Agents

## Overview

The Review AI Engine follows a multi-agent architecture.

Each agent has a single responsibility and communicates through services.

No agent should perform multiple unrelated tasks.

---

# Agent 1 : Review Analysis Agent

## Purpose

Analyze individual customer reviews.

## Input

Single Review

Example

{
  "rating": 2,
  "text": "Food was cold."
}

## Responsibilities

- Sentiment Analysis
- Complaint Categorization
- Emotion Detection
- Urgency Detection
- Short Summary
- Recommended Business Action

## Output

{
  "sentiment": "Negative",
  "category": "Food Quality",
  "emotion": "Frustrated",
  "urgency": "High",
  "summary": "Customer complained about cold food.",
  "recommendedAction": "Offer apology and investigate kitchen."
}

---

# Agent 2 : Analytics Agent

## Purpose

Generate analytics from analyzed reviews.

## Responsibilities

- Calculate sentiment score
- Count complaint categories
- Detect recurring issues
- Generate trend data
- Calculate average rating

Input

AI Reviews

Output

Analytics JSON

---

# Agent 3 : Trend Analysis Agent

## Purpose

Analyze reviews over time.

Responsibilities

- Daily trends
- Weekly trends
- Monthly trends

Output

Trend JSON

---

# Agent 4 : Summary Agent

Purpose

Generate executive business summary.

Input

Analytics

Output

Business Summary

Example

Overall customer satisfaction decreased due to recurring complaints about food quality.

---

# Agent Communication

Review Analysis Agent

↓

Analytics Agent

↓

Trend Analysis Agent

↓

Summary Agent

↓

Response Builder