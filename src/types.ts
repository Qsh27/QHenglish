export enum Difficulty {
  Junior = "Junior",
  Middle = "Middle",
  Senior = "Senior",
}

export enum GrammarPoint {
  NonFiniteVerb = "非谓语动词",
  AttributiveClause = "定语从句",
  AdverbialClause = "状语从句",
  Conjunction = "连词",
  NounClause = "名词性从句",
  AbsoluteConstruction = "独立主格",
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
