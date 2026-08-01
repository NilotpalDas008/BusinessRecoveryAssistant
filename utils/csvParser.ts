export interface ParsedReview {
  reviewId?: string;
  date: string;
  customerName?: string;
  itemOrdered?: string;
  visitType?: string;
  rating: number;
  reviewText: string;
  text: string; // Alias for reviewText to ensure backend compatibility
  reviewerName?: string;
}

export interface ParseCSVResult {
  success: boolean;
  reviews?: ParsedReview[];
  totalCount?: number;
  error?: string;
}

/**
 * Client-side CSV parser utility for review data.
 */
export async function parseReviewCSV(file: File): Promise<ParseCSVResult> {
  // 1. Validate File Extension
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return {
      success: false,
      error: "Invalid file format. Please select a valid .csv file.",
    };
  }

  // 2. Validate File Size (Max 10MB)
  const MAX_SIZE_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return {
      success: false,
      error: "File size exceeds the 10MB limit. Please upload a smaller CSV.",
    };
  }

  // 3. Validate Empty File
  if (file.size === 0) {
    return {
      success: false,
      error: "Selected file is empty. Please upload a CSV with review data.",
    };
  }

  try {
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length <= 1) {
      return {
        success: false,
        error: "CSV file contains no review data rows.",
      };
    }

    // Parse CSV line handling quotes
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim().replace(/^"(.*)"$/, "$1"));
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"(.*)"$/, "$1"));
      return result;
    };

    const headers = parseCSVLine(lines[0]).map((h) =>
      h.toLowerCase().replace(/[^a-z0-9]/g, "")
    );

    // Exact and specific header index matching
    const reviewIdIdx = headers.findIndex((h) => h === "reviewid" || h === "id");
    const dateIdx = headers.findIndex((h) => h === "date" || h.includes("created") || h.includes("time"));
    const customerNameIdx = headers.findIndex((h) => h === "customername" || h === "name" || h === "author" || h === "reviewername");
    const itemOrderedIdx = headers.findIndex((h) => h === "itemordered" || h === "item" || h === "product" || h === "order");
    const visitTypeIdx = headers.findIndex((h) => h === "visittype" || h === "visit");
    const ratingIdx = headers.findIndex((h) => h.includes("rating") || h.includes("star") || h.includes("score"));
    
    // Fix text index matching: prioritize "reviewtext", "text", "comment", "content" over general "review"
    let textIdx = headers.findIndex((h) => h === "reviewtext" || h === "text" || h === "comment" || h === "content");
    if (textIdx === -1) {
      textIdx = headers.findIndex((h) => h.includes("review") && !h.includes("id"));
    }

    const reviews: ParsedReview[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 2) continue;

      const rawRating = parseFloat(cols[ratingIdx >= 0 ? ratingIdx : 5]);
      const rating = Number.isFinite(rawRating) && rawRating >= 1 && rawRating <= 5 ? rawRating : 5;

      const reviewId = reviewIdIdx >= 0 ? cols[reviewIdIdx] : `REV-${1000 + i}`;
      const rawDate = dateIdx >= 0 ? cols[dateIdx] : new Date().toISOString().split("T")[0];
      const validDate = !Number.isNaN(Date.parse(rawDate)) ? rawDate.trim() : new Date().toISOString().split("T")[0];

      const customerName = customerNameIdx >= 0 ? cols[customerNameIdx] : "Customer";
      const itemOrdered = itemOrderedIdx >= 0 ? cols[itemOrderedIdx] : "N/A";
      const visitType = visitTypeIdx >= 0 ? cols[visitTypeIdx] : "General";
      const extractedText = textIdx >= 0 && cols[textIdx] ? cols[textIdx].trim() : cols[cols.length - 1] || "";

      if (extractedText.length > 0) {
        reviews.push({
          reviewId,
          date: validDate,
          customerName,
          itemOrdered,
          visitType,
          rating,
          reviewText: extractedText,
          text: extractedText, // Alias for backend review engine compatibility
          reviewerName: customerName,
        });
      }
    }

    if (reviews.length === 0) {
      return {
        success: false,
        error: "Could not parse any valid reviews from the CSV file.",
      };
    }

    return {
      success: true,
      reviews,
      totalCount: reviews.length,
    };
  } catch {
    return {
      success: false,
      error: "Failed to read or parse the CSV file. Please verify the file format.",
    };
  }
}
