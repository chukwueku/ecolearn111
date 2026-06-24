export const generateStudyGuide = async (topicTitle: string, level: string, description: string) => {
  try {
    const response = await fetch("/api/generateStudyGuide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicTitle, level, description }),
    });
    if (!response.ok) return "Failed to generate study guide. Please try again later.";
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
    const data = await response.json();
    return data.questions;
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
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

