import { AppQuestion } from "@/types";

// Frontend-only questions data - no backend dependency
export const mockQuestions: AppQuestion[] = [
  // Stage 1 Questions (General Content Assessment)
  {
    id: 1,
    productId: 0, // 0 means applies to all products
    stage: 1,
    questionNumber: 1,
    type: "multiple_choice",
    question: "How would you rate the overall attractiveness of this content?",
    options: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
  },
  {
    id: 2,
    productId: 0,
    stage: 1,
    questionNumber: 2,
    type: "star_rating",
    question: "How engaging is this content based on first impression?",
    metadata: { minLabel: "Not Engaging", maxLabel: "Very Engaging" },
  },
  {
    id: 3,
    productId: 0,
    stage: 1,
    questionNumber: 3,
    type: "multiple_choice",
    question: "What is your primary concern about this content?",
    options: [
      "Quality",
      "Appropriateness",
      "Creativity",
      "Authenticity",
      "No concerns",
    ],
  },
  {
    id: 4,
    productId: 0,
    stage: 1,
    questionNumber: 4,
    type: "free_text",
    question:
      "What catches your attention most about this content? Please explain.",
  },
  {
    id: 5,
    productId: 0,
    stage: 1,
    questionNumber: 5,
    type: "star_rating",
    question: "How professional does this content appear to you?",
    metadata: { minLabel: "Not Professional", maxLabel: "Very Professional" },
  },

  // Stage 2 Questions (Detailed Analysis)
  {
    id: 6,
    productId: 0,
    stage: 2,
    questionNumber: 1,
    type: "multiple_choice",
    question: "Based on the content, how would you rate the visual quality?",
    options: [
      "Poor quality",
      "Below average",
      "Average",
      "Above average",
      "Premium quality",
    ],
  },
  {
    id: 7,
    productId: 0,
    stage: 2,
    questionNumber: 2,
    type: "free_text",
    question: "What improvements would you suggest for this content?",
  },
  {
    id: 8,
    productId: 0,
    stage: 2,
    questionNumber: 3,
    type: "star_rating",
    question: "How well does this content meet audience expectations?",
    metadata: { minLabel: "Poorly", maxLabel: "Perfectly" },
  },
  {
    id: 9,
    productId: 0,
    stage: 2,
    questionNumber: 4,
    type: "multiple_choice",
    question: "Who do you think is the target audience for this content?",
    options: [
      "Young adults",
      "Adults 25-35",
      "Adults 35-45",
      "Mature audience",
      "All adults",
    ],
  },
  {
    id: 10,
    productId: 0,
    stage: 2,
    questionNumber: 5,
    type: "free_text",
    question: "Describe the ideal viewer for this content in your own words.",
  },

  // Stage 3 Questions (Final Evaluation)
  {
    id: 11,
    productId: 0,
    stage: 3,
    questionNumber: 1,
    type: "star_rating",
    question: "Overall, how satisfied would you be with this content?",
    metadata: { minLabel: "Very Dissatisfied", maxLabel: "Very Satisfied" },
  },
  {
    id: 12,
    productId: 0,
    stage: 3,
    questionNumber: 2,
    type: "multiple_choice",
    question: "How likely are you to engage with similar content?",
    options: [
      "Not at all likely",
      "Slightly likely",
      "Moderately likely",
      "Very likely",
      "Extremely likely",
    ],
  },
  {
    id: 13,
    productId: 0,
    stage: 3,
    questionNumber: 3,
    type: "free_text",
    question:
      "What is your final impression of this content? Summarize your thoughts.",
  },
  {
    id: 14,
    productId: 0,
    stage: 3,
    questionNumber: 4,
    type: "star_rating",
    question: "How appealing is this content compared to similar alternatives?",
    metadata: { minLabel: "Not Appealing", maxLabel: "Highly Appealing" },
  },
  {
    id: 15,
    productId: 0,
    stage: 3,
    questionNumber: 5,
    type: "multiple_choice",
    question: "What would motivate you most to view more content like this?",
    options: [
      "Better quality",
      "More variety",
      "Better presentation",
      "Authenticity",
      "Creativity",
    ],
  },
];

export const getQuestionsByStage = (
  productId: number,
  stage: number
): AppQuestion[] => {
  return mockQuestions.filter(
    (q) => (q.productId === 0 || q.productId === productId) && q.stage === stage
  );
};
