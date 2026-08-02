
# 🚀 ReviveAI — AI Business Recovery Assistant

<p align="center">

### **Turn Bad Reviews Into Loyal Customers with AI**

ReviveAI is an AI-powered Business Recovery Assistant that helps local businesses understand customer feedback, uncover hidden business problems, and recover unhappy customers through intelligent insights and AI-driven recommendations.

Built for modern businesses that want to make smarter, data-driven decisions.

</p>

---

# 📌 Problem Statement

Local businesses receive hundreds of customer reviews every month across various platforms like Google Reviews. While these platforms provide ratings and feedback, they fail to answer the most important business questions:

- Why are customers unhappy?
- Which complaints occur repeatedly?
- Why are ratings dropping?
- Which issues require immediate attention?
- How can dissatisfied customers be recovered?
- What actions should the business take next?

Business owners spend hours manually reading reviews without gaining actionable insights.

**ReviveAI solves this problem by transforming customer reviews into intelligent business insights using Artificial Intelligence.**

---

# 💡 Solution

ReviveAI is an AI-powered Business Recovery Assistant designed to convert customer feedback into actionable business intelligence.

The platform enables business owners to:

- 📥 Upload customer reviews
- 🤖 Analyze customer sentiment using AI
- 📊 Detect recurring complaint patterns
- 📈 Monitor business performance
- 💬 Generate personalized customer recovery messages
- 🎯 Recommend recovery strategies
- 📢 Generate AI-powered marketing content
- 📋 Receive intelligent business insights

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Clerk Authentication

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose

---

## AI

- Google Gemini API

---

## Database

- MongoDB Atlas

---

## Authentication

- Clerk

---

# ⚙️ Setup & Installation

## 1. Clone the Repository

```bash
git clone <repository-url>

cd BusinessRecoveryAssistant
```

---

## 2. Install Dependencies

### Frontend

```bash
npm install
```

### Backend

```bash
cd backend

npm install
```

---

## 3. Configure Environment Variables

The frontend environment variables are already provided in the repository.

Create a `.env` file inside the **backend** directory and add the following variables.

```env
MONGODB_URI=YOUR_MONGODB_URI

GEMINI_API_KEY=YOUR_GCP_GEMINI_API_KEY

PORT=5000
```

> **Note**
>
> The MongoDB Atlas URI and Google Gemini (GCP) API Key are provided below in this README. Copy them into the backend `.env` file before running the project.

---

# ▶️ How to Run

### Start the Frontend

```bash
npm run dev
```

---

### Start the Backend

Open another terminal.

```bash
cd backend

npm run dev
```

---

The application will be available at

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:5000
```

---

# 🔐 Backend Environment Variables

Create a `.env` file inside the **backend** directory.

```env
MONGODB_URI=PASTE_YOUR_MONGODB_URI_HERE

GEMINI_API_KEY=PASTE_YOUR_GEMINI_API_KEY_HERE

PORT=5000
```

---

## MongoDB URI

```env
PASTE_YOUR_MONGODB_URI_HERE
```

---

## Google Gemini API Key

```env
PASTE_YOUR_GEMINI_API_KEY_HERE
```

---

# 🏗 Architecture Overview

```text
                     Business Owner
                            │
                            ▼
                 Clerk Authentication
                            │
                            ▼
                    Business Dashboard
                            │
                            ▼
                 Upload Reviews (CSV)
                            │
                            ▼
                   Express Backend API
                            │
                            ▼
                  CSV Parsing Service
                            │
                            ▼
                     MongoDB Atlas
                            │
                            ▼
                 Gemini AI Review Analysis
                            │
                            ▼
                 Business Analytics Engine
                            │
                            ▼
                AI Recovery Recommendations
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   WhatsApp Recovery   Marketing Posts   Business Reports
```

---

# ✨ Key Features

## ✅ Authentication

- Secure Business Owner Authentication
- Clerk Integration
- Protected Routes

---

## 📥 Review Ingestion

- Upload Google Reviews CSV
- Automatic CSV Parsing
- Data Validation
- Store Reviews in MongoDB Atlas

---

## 🤖 AI Review Analysis

- Sentiment Detection
- Complaint Classification
- Emotion Analysis
- Urgency Detection
- Suggested Recovery Actions

---

## 📊 Analytics Dashboard

- Average Rating
- Review Trends
- Complaint Breakdown
- Business Health Score
- Customer Satisfaction Metrics

---

## 💬 Recovery Assistant

- AI-generated Recovery Messages
- Discount Suggestions
- Customer Follow-up Recommendations

---

## 📢 AI Marketing

- Instagram Caption Generator
- Facebook Post Generator
- Marketing Suggestions

---

# 🚀 Future Scope

The future roadmap of ReviveAI includes:

- Google Business Profile Integration
- WhatsApp Cloud API
- Instagram Graph API
- Facebook Graph API
- AI-powered Fake Review Detection
- Customer Churn Prediction
- AI Business Advisor
- Automated Recovery Campaigns
- Customer Segmentation
- Multi-Business Management
- Mobile Application

---

# 👥 Team

## **Team Name**

**LocalHost**

### **Team Members**

- Nilotpal Das
- Debankan Dutta

---

# 📄 License

This project has been developed for educational purposes and hackathon participation.

Feel free to explore, learn, and contribute.

---

# 🙏 Acknowledgements

Special thanks to the amazing open-source technologies and platforms that made this project possible.

- Next.js
- React
- Express.js
- MongoDB Atlas
- Clerk Authentication
- Google Gemini AI
- Tailwind CSS
- shadcn/ui

---

# 🌟 Vision

> **"Businesses don't need more data—they need better decisions."**

ReviveAI empowers local businesses with AI-driven insights, helping them understand customer feedback, improve operations, recover dissatisfied customers, and build long-term customer loyalty through intelligent automation.

---

<p align="center">

### ⭐ If you found this project interesting, consider giving it a Star on GitHub!

**Built with ❤️ by Team LocalHost**

[ 

GEMINI_API_KEY="AQ.Ab8RN6LP938dse2WeQDOMMz5yBKZKmfUibdRxG6YOaear8sN0A"

MONGODB_URI=mongodb+srv://nd8851715_db_user:KOvsBtpdcnDYP09A@cluster0.njifzuw.mongodb.net/hackathon?retryWrites=true&w=majority

]
</p>
