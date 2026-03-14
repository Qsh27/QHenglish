export enum Difficulty {
  Junior = "Junior",
  Middle = "Middle",
  Senior = "Senior",
}

export enum GrammarPoint {
  NonFiniteVerb = "Non-finite Verbs",
  AttributiveClause = "Attributive Clause",
  AdverbialClause = "Adverbial Clause",
  Conjunction = "Conjunctions",
  NounClause = "Noun Clause",
  AbsoluteConstruction = "Absolute Construction",
}

export interface Option {
  id: string;
  text: string;
}

export interface Explanation {
  correctAnswer: string;
  rule: string;
  example: string;
  commonMistake: string;
}

export interface Question {
  id: string;
  sentenceBefore: string;
  sentenceAfter: string;
  options: Option[];
  correctOptionId: string;
  difficulty: Difficulty;
  category: GrammarPoint;
  explanation: Explanation;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>; // questionId -> optionId
  isSubmitted: boolean;
  score: number;
  showExplanation: boolean;
}
