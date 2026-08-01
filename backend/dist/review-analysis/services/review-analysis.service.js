"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewAnalysisService = void 0;
const review_analysis_agent_1 = require("../agents/review-analysis.agent");
const analytics_service_1 = require("./analytics.service");
const trend_service_1 = require("./trend.service");
const recurring_issue_service_1 = require("./recurring-issue.service");
/**
 * Service responsible for orchestrating AI analysis over batches of customer reviews in a single Gemini call.
 */
class ReviewAnalysisService {
    agent;
    analyticsService;
    trendService;
    recurringIssueService;
    constructor(agent, analyticsService, trendService, recurringIssueService) {
        this.agent = agent ?? new review_analysis_agent_1.ReviewAnalysisAgent();
        this.analyticsService = analyticsService ?? new analytics_service_1.AnalyticsService();
        this.trendService = trendService ?? new trend_service_1.TrendService();
        this.recurringIssueService = recurringIssueService ?? new recurring_issue_service_1.RecurringIssueService();
    }
    /**
     * Analyzes customer reviews with real-time stage progress callbacks.
     */
    async analyzeReviewsWithProgress(reviews, onProgress) {
        if (!reviews || reviews.length === 0) {
            return {
                summary: { totalReviews: 0, averageRating: 0, overallSentiment: "Neutral", executiveSummary: "" },
                sentimentScore: { positive: 0, neutral: 0, negative: 0, overallScore: 0, healthLabel: "Critical", statusMessage: "Immediate Attention Required" },
                complaintCategories: [],
                trendsOverTime: [],
                topRecurringIssues: [],
                reviews: [],
                recommendations: [],
            };
        }
        if (onProgress)
            onProgress({ stage: "Sending Reviews to Gemini", step: 3 });
        // Single Gemini API invocation for the entire batch
        const rawBatch = await this.agent.analyzeBatch(reviews);
        if (onProgress)
            onProgress({ stage: "Analyzing Sentiment", step: 4 });
        // Merge original review fields with Gemini's AI analysis output
        const aiReviews = reviews.map((r, idx) => {
            const reviewId = r.reviewId || `REV-${1000 + idx}`;
            const rawR = (rawBatch.reviews || []).find((item) => item.reviewId === reviewId) ||
                (rawBatch.reviews || [])[idx] ||
                {};
            const sentiment = rawR.sentiment ||
                (r.rating >= 4 ? "Positive" : r.rating <= 2 ? "Negative" : "Neutral");
            const category = (rawR.complaintCategory || rawR.category) || "General";
            const urgency = (rawR.priority || rawR.urgency) ||
                (r.rating <= 2 ? "High" : "Low");
            const emotion = rawR.emotion ||
                (sentiment === "Positive"
                    ? "Satisfied"
                    : sentiment === "Negative"
                        ? "Frustrated"
                        : "Neutral");
            return {
                reviewId,
                rating: r.rating,
                text: r.reviewText || r.text || "",
                date: r.date,
                customerName: r.customerName || r.reviewerName || "Anonymous",
                itemOrdered: r.itemOrdered || "N/A",
                sentiment,
                category,
                emotion,
                urgency,
                summary: rawR.summary || r.reviewText || r.text || "No summary available",
                recommendedAction: rawR.recommendedAction ||
                    (rawBatch.recommendations && rawBatch.recommendations[0]) ||
                    "Maintain service quality",
            };
        });
        if (onProgress)
            onProgress({ stage: "Detecting Complaint Categories", step: 5 });
        // 1. Summary & Executive Business Report
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 5), 0);
        const averageRating = Number((totalRating / (totalReviews || 1)).toFixed(1));
        let overallSentiment = "Neutral";
        if (typeof rawBatch.summary === "object" && rawBatch.summary?.overallSentiment) {
            overallSentiment = rawBatch.summary.overallSentiment;
        }
        else {
            const posCount = aiReviews.filter((r) => r.sentiment === "Positive").length;
            const negCount = aiReviews.filter((r) => r.sentiment === "Negative").length;
            overallSentiment =
                posCount > negCount ? "Positive" : negCount > posCount ? "Negative" : "Neutral";
        }
        let execSummary = "";
        if (typeof rawBatch.summary === "object" && rawBatch.summary?.executiveSummary) {
            execSummary = rawBatch.summary.executiveSummary;
        }
        else if (typeof rawBatch.executiveSummary === "string") {
            execSummary = rawBatch.executiveSummary;
        }
        const summary = {
            totalReviews,
            averageRating,
            overallSentiment,
            executiveSummary: execSummary,
        };
        // 3. Complaint Categories
        const complaintCategories = rawBatch.complaintCategories && rawBatch.complaintCategories.length > 0
            ? rawBatch.complaintCategories.map((c) => ({
                category: c.category,
                count: c.count,
                percentage: c.percentage,
            }))
            : this.analyticsService.calculateComplaintCategories(aiReviews);
        if (onProgress)
            onProgress({ stage: "Finding Trends", step: 6 });
        // 4. Trends Over Time
        const trendsOverTime = rawBatch.trendsOverTime && rawBatch.trendsOverTime.length > 0
            ? rawBatch.trendsOverTime
            : this.trendService.calculateTrends(aiReviews);
        // 5. Top Recurring Issues
        const topRecurringIssues = rawBatch.topRecurringIssues && rawBatch.topRecurringIssues.length > 0
            ? rawBatch.topRecurringIssues.map((i) => ({
                issue: i.issue,
                count: i.count,
                percentage: i.percentage,
                severity: i.severity || (i.percentage > 30 ? "Critical" : i.percentage > 15 ? "High" : "Medium"),
            }))
            : this.recurringIssueService.calculateRecurringIssues(aiReviews);
        if (onProgress)
            onProgress({ stage: "Generating Executive Summary", step: 7 });
        // 2. Sentiment Score & Dynamic 4-Factor Weighted Business Health Score Algorithm
        const pos = rawBatch.sentimentScore?.positive ?? Number(((aiReviews.filter((r) => r.sentiment === "Positive").length / totalReviews) * 100).toFixed(1));
        const neu = rawBatch.sentimentScore?.neutral ?? Number(((aiReviews.filter((r) => r.sentiment === "Neutral").length / totalReviews) * 100).toFixed(1));
        const neg = rawBatch.sentimentScore?.negative ?? Number(((aiReviews.filter((r) => r.sentiment === "Negative").length / totalReviews) * 100).toFixed(1));
        // 1) Sentiment Score (40% Weight): ((PositivePercentage - NegativePercentage) + 100) / 2
        const rawSentimentScore = ((pos - neg) + 100) / 2;
        const sentimentScoreVal = Math.min(100, Math.max(0, rawSentimentScore));
        // 2) Rating Score (30% Weight): (AverageRating / 5) * 100
        const ratingScore = Math.min(100, Math.max(0, (averageRating / 5) * 100));
        // 3) Complaint Score (20% Weight): ComplaintRate = ComplaintReviews / TotalReviews; ComplaintScore = 100 - (ComplaintRate * 100)
        const complaintReviewsCount = complaintCategories.reduce((sum, c) => sum + (c.count || 0), 0) ||
            aiReviews.filter((r) => r.sentiment === "Negative").length;
        const complaintRate = Math.min(1, Math.max(0, complaintReviewsCount / (totalReviews || 1)));
        const complaintScore = Math.min(100, Math.max(0, 100 - complaintRate * 100));
        // 4) Recurring Issue Score (10% Weight): Low=10, Medium=25, High=40, Critical=60. Average penalty.
        let issuePenaltiesSum = 0;
        const issueCount = topRecurringIssues.length;
        if (issueCount > 0) {
            topRecurringIssues.forEach((issue) => {
                const sev = issue.severity ||
                    (issue.percentage > 30 ? "Critical" : issue.percentage > 15 ? "High" : "Medium");
                if (sev === "Critical")
                    issuePenaltiesSum += 60;
                else if (sev === "High")
                    issuePenaltiesSum += 40;
                else if (sev === "Medium")
                    issuePenaltiesSum += 25;
                else
                    issuePenaltiesSum += 10;
            });
        }
        const averagePenalty = issueCount > 0 ? issuePenaltiesSum / issueCount : 0;
        const recurringIssueScore = Math.min(100, Math.max(0, 100 - averagePenalty));
        // Final Business Health Score
        const rawBusinessHealth = sentimentScoreVal * 0.40 +
            ratingScore * 0.30 +
            complaintScore * 0.20 +
            recurringIssueScore * 0.10;
        const overallScore = Math.min(100, Math.max(0, Math.round(rawBusinessHealth)));
        let healthLabel;
        let statusMessage;
        if (overallScore >= 90) {
            healthLabel = "Excellent";
            statusMessage = "Excellent Customer Satisfaction";
        }
        else if (overallScore >= 80) {
            healthLabel = "Very Good";
            statusMessage = "Strong Business Performance";
        }
        else if (overallScore >= 70) {
            healthLabel = "Good";
            statusMessage = "Healthy Business with Minor Improvements";
        }
        else if (overallScore >= 60) {
            healthLabel = "Fair";
            statusMessage = "Moderate Action Needed";
        }
        else if (overallScore >= 45) {
            healthLabel = "Needs Improvement";
            statusMessage = "Improvement Required";
        }
        else {
            healthLabel = "Critical";
            statusMessage = "Immediate Attention Required";
        }
        const sentimentScore = {
            positive: pos,
            neutral: neu,
            negative: neg,
            overallScore,
            healthLabel,
            statusMessage,
        };
        return {
            summary,
            sentimentScore,
            complaintCategories,
            trendsOverTime,
            topRecurringIssues,
            reviews: aiReviews,
            recommendations: rawBatch.recommendations || [],
        };
    }
    async analyzeReviews(reviews) {
        return this.analyzeReviewsWithProgress(reviews);
    }
}
exports.ReviewAnalysisService = ReviewAnalysisService;
