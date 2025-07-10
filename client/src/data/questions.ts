import { AppQuestion } from "@/types";

// Frontend-only questions data - no backend dependency
export const mockQuestions: AppQuestion[] = [
  // Stage 1 Questions (General Product Assessment)
  {
    id: 1,
    productId: 0, // 0 means applies to all products
    stage: 1,
    questionNumber: 1,
    type: 'multiple_choice',
    question: 'How would you rate the overall visual appeal of this product?',
    options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
  },
  {
    id: 2,
    productId: 0,
    stage: 1,
    questionNumber: 2,
    type: 'star_rating',
    question: 'How likely are you to purchase this product based on first impression?',
    metadata: { minLabel: 'Very Unlikely', maxLabel: 'Very Likely' },
  },
  {
    id: 3,
    productId: 0,
    stage: 1,
    questionNumber: 3,
    type: 'multiple_choice',
    question: 'What is your primary concern about this product?',
    options: ['Price', 'Quality', 'Brand reputation', 'Features', 'No concerns'],
  },
  {
    id: 4,
    productId: 0,
    stage: 1,
    questionNumber: 4,
    type: 'free_text',
    question: 'What catches your attention most about this product? Please explain.',
  },
  {
    id: 5,
    productId: 0,
    stage: 1,
    questionNumber: 5,
    type: 'star_rating',
    question: 'How professional does this product appear to you?',
    metadata: { minLabel: 'Not Professional', maxLabel: 'Very Professional' },
  },

  // Stage 2 Questions (Detailed Analysis)
  {
    id: 6,
    productId: 0,
    stage: 2,
    questionNumber: 1,
    type: 'multiple_choice',
    question: 'Based on the image, how would you rate the product quality?',
    options: ['Poor quality', 'Below average', 'Average', 'Above average', 'Premium quality'],
  },
  {
    id: 7,
    productId: 0,
    stage: 2,
    questionNumber: 2,
    type: 'free_text',
    question: 'What improvements would you suggest for this product?',
  },
  {
    id: 8,
    productId: 0,
    stage: 2,
    questionNumber: 3,
    type: 'star_rating',
    question: 'How well does this product meet current market needs?',
    metadata: { minLabel: 'Poorly', maxLabel: 'Perfectly' },
  },
  {
    id: 9,
    productId: 0,
    stage: 2,
    questionNumber: 4,
    type: 'multiple_choice',
    question: 'Who do you think is the target audience for this product?',
    options: ['Teenagers', 'Young adults', 'Middle-aged adults', 'Seniors', 'All ages'],
  },
  {
    id: 10,
    productId: 0,
    stage: 2,
    questionNumber: 5,
    type: 'free_text',
    question: 'Describe the ideal customer for this product in your own words.',
  },

  // Stage 3 Questions (Final Evaluation)
  {
    id: 11,
    productId: 0,
    stage: 3,
    questionNumber: 1,
    type: 'star_rating',
    question: 'Overall, how satisfied would you be with this product?',
    metadata: { minLabel: 'Very Dissatisfied', maxLabel: 'Very Satisfied' },
  },
  {
    id: 12,
    productId: 0,
    stage: 3,
    questionNumber: 2,
    type: 'multiple_choice',
    question: 'How likely are you to recommend this product to others?',
    options: ['Not at all likely', 'Slightly likely', 'Moderately likely', 'Very likely', 'Extremely likely'],
  },
  {
    id: 13,
    productId: 0,
    stage: 3,
    questionNumber: 3,
    type: 'free_text',
    question: 'What is your final impression of this product? Summarize your thoughts.',
  },
  {
    id: 14,
    productId: 0,
    stage: 3,
    questionNumber: 4,
    type: 'star_rating',
    question: 'How competitive is this product compared to similar alternatives?',
    metadata: { minLabel: 'Not Competitive', maxLabel: 'Highly Competitive' },
  },
  {
    id: 15,
    productId: 0,
    stage: 3,
    questionNumber: 5,
    type: 'multiple_choice',
    question: 'What would motivate you most to purchase this product?',
    options: ['Price discount', 'Additional features', 'Better warranty', 'Brand trust', 'Positive reviews'],
  },
];

export const getQuestionsByStage = (productId: number, stage: number): AppQuestion[] => {
  return mockQuestions.filter(q => 
    (q.productId === 0 || q.productId === productId) && q.stage === stage
  );
};