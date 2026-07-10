export const generateStudyGuide = async (topicTitle: string, level: string, description: string) => {
  try {
    const response = await fetch("/api/generateStudyGuide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicTitle, level, description }),
    });
    if (!response.ok) {
      try {
        const errorData = await response.json();
        if (errorData.error) return errorData.error;
      } catch (e) {}
      return "Failed to generate study guide. Please try again later.";
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Failed to generate study guide. Please try again later.";
  }
};

export const generateQuestions = async (topicTitle: string, level: string, count: number = 5) => {
  try {
    const response = await fetch("/api/generateQuestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicTitle, level, count }),
    });
    if (!response.ok) return [];
    
    // Safely parse JSON to avoid SyntaxError with HTML error pages
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data.questions || [];
    } catch (e) {
      console.error("JSON parse error:", e, text);
      return [];
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

export const extractQuestionsFromPdf = async (pdfBase64: string, level: string, count: number = 5) => {
  try {
    const response = await fetch("/api/extractFromPdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfBase64, level, count }),
    });
    if (!response.ok) return [];
    
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data.questions || [];
    } catch (e) {
      console.error("JSON parse error:", e, text);
      return [];
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

export const generateDailyChallengeBatch = async (courses: string[], count: number, level: string = "undergraduate", exclude: string[] = []) => {
  try {
    const response = await fetch("/api/generateDailyChallengeBatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courses, count, level, exclude }),
    });
    if (!response.ok) return [];
    
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data.questions || [];
    } catch (e) {
      console.error("JSON parse error:", e, text);
      return [];
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

