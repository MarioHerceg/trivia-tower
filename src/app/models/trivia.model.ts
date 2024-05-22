import { ITriviaCategory } from '../state/trivia';

export interface IResponseBase {
  response_code: number;
  response_message?: string;
}

export interface IResponseCategories {
  trivia_categories: ITriviaCategory[];
}

export interface IResponseQuestionCountsByCategory {
  category_id: number;
  category_question_count: {
    total_question_count: number;
    total_easy_question_count: number;
    total_medium_question_count: number;
    total_hard_question_count: number;
  };
}

export type IResponseToken = IResponseBase & { token: string };

export interface IQuestionsRequest {
  ammount: number;
  token: string;
  category: number;
  difficulty: QuestionDifficulty;
}

export enum QuestionDifficulty {
  ANY = 'any',
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuestionType {
  ANY = 'any',
  MULTIPLE = 'multiple',
  BOOLEAN = 'boolean',
}

export type IResponseQuestions = IResponseBase & { results: IResponseQuestion[] };

export interface IResponseQuestion {
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
}
