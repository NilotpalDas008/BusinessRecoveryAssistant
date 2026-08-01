import { ReviewAnalysisAgent } from "../agents/review-analysis.agent";
import { GeminiService, GeminiError } from "../services/gemini.service";
import { Review } from "../types/review.types";

jest.mock("../services/gemini.service", () => {
  const actual = jest.requireActual("../services/gemini.service");
  return {
    ...actual,
    GeminiService: jest.fn().mockImplementation(() => ({
      generateJSON: jest.fn(),
    })),
  };
});

describe("ReviewAnalysisAgent", () => {
  let agent: ReviewAnalysisAgent;
  let mockGeminiService: jest.Mocked<GeminiService>;

  beforeEach(() => {
    mockGeminiService = new GeminiService() as jest.Mocked<GeminiService>;
    agent = new ReviewAnalysisAgent(mockGeminiService);
  });

  it("should successfully analyze a single review and return AIReview", async () => {
    const review: Review = {
      rating: 1,
      text: "Food was cold and service was terrible.",
      date: "2026-08-01",
    };

    mockGeminiService.generateJSON.mockResolvedValueOnce({
      sentiment: "Negative",
      category: "Food Quality",
      emotion: "Frustrated",
      urgency: "High",
      summary: "Customer complained about cold food and bad service.",
      recommendedAction: "Investigate kitchen and issue apology.",
    });

    const result = await agent.analyze(review);

    expect(result.rating).toBe(1);
    expect(result.text).toBe("Food was cold and service was terrible.");
    expect(result.sentiment).toBe("Negative");
    expect(result.category).toBe("Food Quality");
    expect(result.emotion).toBe("Frustrated");
    expect(result.urgency).toBe("High");
  });

  it("should throw GeminiError if Gemini response is missing required fields", async () => {
    const review: Review = { rating: 5, text: "Great place!", date: "2026-08-01" };

    mockGeminiService.generateJSON.mockResolvedValue({
      sentiment: "Positive",
      // missing category, emotion, urgency, summary, recommendedAction
    });

    await expect(agent.analyze(review)).rejects.toThrow(GeminiError);
  });

  it("should return cached result when enableCache is true without re-invoking Gemini", async () => {
    const cachedAgent = new ReviewAnalysisAgent(mockGeminiService, true);
    const review: Review = { rating: 5, text: "Delicious burger", date: "2026-08-01" };

    mockGeminiService.generateJSON.mockResolvedValue({
      sentiment: "Positive",
      category: "Food Quality",
      emotion: "Delighted",
      urgency: "Low",
      summary: "Customer loved the burger.",
      recommendedAction: "Keep serving great burgers.",
    });

    const res1 = await cachedAgent.analyze(review);
    const res2 = await cachedAgent.analyze(review);

    expect(res1).toEqual(res2);
    expect(mockGeminiService.generateJSON).toHaveBeenCalledTimes(1);
  });
});
