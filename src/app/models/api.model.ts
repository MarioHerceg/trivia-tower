import { ITriviaCategory } from '../state/trivia';

export interface IResponseBase {
  response_code: number;
  response_message?: string;
}

export interface IResponseCategories {
  trivia_categories: ITriviaCategory[];
}

export type IResponseToken = IResponseBase & { token: string };

export interface IQuestionsRequest {
  ammount: number;
  token: string;
  category: number;
  difficulty: QuestionDifficulty;
  type: QuestionType;
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
